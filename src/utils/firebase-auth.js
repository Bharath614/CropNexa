import { createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail, confirmPasswordReset, sendEmailVerification, signOut, RecaptchaVerifier, signInWithPhoneNumber, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { doc, setDoc, getDoc, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { auth, db, isFirebaseConfigured } from './firebase';
// Validation Rules
export function validatePassword(password) {
    if (password.length < 6) {
        return { isValid: false, errorMsg: 'Password must be at least 6 characters long.' };
    }
    return { isValid: true };
}
export function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
// Friendly Auth Error Message Mapper
export function mapAuthCodeToMessage(code) {
    switch (code) {
        case 'auth/operation-not-allowed':
            return 'Google Sign-In is not enabled in Firebase Console yet. Please go to Firebase Console -> Authentication -> Sign-in method and enable Google.';
        case 'auth/unauthorized-domain':
            return 'This website domain is not authorized for Google Sign-In yet. Please add this domain under Firebase Console -> Authentication -> Settings -> Authorized domains.';
        case 'auth/popup-closed-by-user':
            return 'Google Sign-In popup was closed before completing sign in.';
        case 'auth/popup-blocked':
            return 'Google Sign-In popup was blocked by your browser. Please allow popups for this website.';
        case 'auth/email-already-in-use':
            return 'An account with this email address already exists. Please sign in instead.';
        case 'auth/invalid-email':
            return 'The email address entered is invalid.';
        case 'auth/weak-password':
            return 'Password is too weak. Please use at least 6 characters.';
        case 'auth/user-not-found':
        case 'auth/wrong-password':
        case 'auth/invalid-credential':
            return 'Invalid email or password. Please check your credentials and try again.';
        case 'auth/invalid-verification-code':
            return 'The OTP code entered is incorrect or expired. Please request a new code.';
        case 'auth/code-expired':
            return 'The OTP verification code has expired. Please click Resend OTP.';
        case 'auth/too-many-requests':
            return 'Too many attempts. Access has been temporarily blocked for security. Please try again later.';
        case 'auth/network-request-failed':
            return 'Network connection failed. Operating in local mode.';
        default:
            return 'An authentication error occurred. Please check your Firebase Console settings or network connection.';
    }
}
// Duplicate Account Check
export async function checkDuplicateAccount(email, mobileNumber) {
    if (!isFirebaseConfigured)
        return { emailExists: false, mobileExists: false };
    try {
        const functions = getFunctions();
        const checkDuplicate = httpsCallable(functions, 'checkDuplicateBeforeSignup');
        const res = await checkDuplicate({ email, mobileNumber });
        return res.data;
    }
    catch {
        let emailExists = false;
        if (email) {
            const snap = await getDoc(doc(db, 'users', email.toLowerCase()));
            if (snap.exists())
                emailExists = true;
        }
        return { emailExists, mobileExists: false };
    }
}
// Firebase Email + Password Sign Up Flow with Official Firebase Verification Email Dispatch
export async function signUpWithEmail(profile, password) {
    if (!validateEmail(profile.email))
        throw new Error('Invalid email format.');
    const passVal = validatePassword(password);
    if (!passVal.isValid)
        throw new Error(passVal.errorMsg);
    if (isFirebaseConfigured) {
        try {
            const credential = await createUserWithEmailAndPassword(auth, profile.email, password);
            const uid = credential.user.uid;
            // Dispatch official Firebase verification email directly to real Gmail inbox
            try {
                await sendEmailVerification(credential.user);
            }
            catch (e) {
                console.warn('Firebase email verification dispatch notice:', e);
            }
            const userDoc = {
                ...profile,
                uid,
                emailVerified: credential.user.emailVerified,
            };
            await setDoc(doc(db, 'users', uid), {
                ...userDoc,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
                status: 'active'
            }, { merge: true });
            return userDoc;
        }
        catch (err) {
            console.warn('Firebase Auth signup notice:', err.code || err.message);
            const friendlyMsg = mapAuthCodeToMessage(err.code || '') || err.message || 'Registration failed.';
            throw new Error(friendlyMsg);
        }
    }
    return { ...profile, uid: `usr-${Date.now()}` };
}
// Phone Number + OTP Auth Flow
let recaptchaVerifier = null;
export function setupRecaptcha(containerId) {
    if (recaptchaVerifier)
        recaptchaVerifier.clear();
    recaptchaVerifier = new RecaptchaVerifier(auth, containerId, {
        size: 'invisible',
        callback: () => { }
    });
    return recaptchaVerifier;
}
export async function requestPhoneOtp(phoneNumber, appVerifier) {
    const formattedPhone = phoneNumber.startsWith('+') ? phoneNumber : `+91${phoneNumber.replace(/\D/g, '')}`;
    return await signInWithPhoneNumber(auth, formattedPhone, appVerifier);
}
export async function verifyPhoneOtpAndSignIn(confirmationResult, otp) {
    await confirmationResult.confirm(otp);
}
// Sign In & Reset Password Utilities
export async function signInWithEmail(email, pass) {
    if (isFirebaseConfigured) {
        await signInWithEmailAndPassword(auth, email, pass);
    }
}
export async function sendPasswordReset(email) {
    if (isFirebaseConfigured) {
        await sendPasswordResetEmail(auth, email);
    }
}
export async function confirmFirebasePasswordReset(oobCode, newPass) {
    if (isFirebaseConfigured) {
        await confirmPasswordReset(auth, oobCode, newPass);
    }
}
export async function logoutUserSession() {
    if (isFirebaseConfigured) {
        await signOut(auth);
    }
}
// Firestore User & Companion Sync Helpers
export async function saveUserDataToFirestore(userId, data) {
    if (!isFirebaseConfigured)
        return;
    try {
        const cleanId = userId.includes('@') ? userId.replace(/[^a-zA-Z0-9]/g, '_') : userId;
        await setDoc(doc(db, 'users', cleanId), {
            ...data,
            updatedAt: serverTimestamp()
        }, { merge: true });
        console.log('✅ Document successfully written to Firestore under collection "users" with ID:', cleanId);
    }
    catch (err) {
        console.warn('Firestore sync error:', err);
    }
}
export async function saveCompanionPlanToFirestore(userId, planData) {
    if (!isFirebaseConfigured)
        return null;
    try {
        const docRef = await addDoc(collection(db, 'users', userId, 'companionPlans'), {
            ...planData,
            createdAt: serverTimestamp()
        });
        return docRef.id;
    }
    catch (err) {
        console.warn('Firestore companion plan sync notice:', err);
        return null;
    }
}

// Google Sign-In Flow
export async function signInWithGoogle() {
    if (!isFirebaseConfigured) return null;
    try {
        const provider = new GoogleAuthProvider();
        provider.setCustomParameters({ prompt: 'select_account' });
        const result = await signInWithPopup(auth, provider);
        const user = result.user;
        const uid = user.uid;
        
        const googleProfile = {
            farmerName: user.displayName || user.email?.split('@')[0] || 'Farmer',
            email: user.email || '',
            mobileNumber: user.phoneNumber || '',
            photoURL: user.photoURL || '',
            address: 'Verified Google Account',
            farmName: `${user.displayName || 'Farmer'}'s Green Horizon Farm`,
            preferredLanguage: 'en',
            currentCrop: 'Tomato',
            farmingPractice: 'Organic Farming',
            currentStage: 'Growth'
        };
        
        await saveUserDataToFirestore(uid, {
            profile: googleProfile,
            isEmailVerified: true,
            accountStatus: 'Active',
            lastLoginAt: serverTimestamp()
        });
        
        return { uid, user, profile: googleProfile };
    } catch (err) {
        console.warn('Google Sign-In notice:', err.code, err.message);
        throw err;
    }
}
