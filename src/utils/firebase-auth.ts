/* eslint-disable @typescript-eslint/no-explicit-any */
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  sendPasswordResetEmail, 
  confirmPasswordReset,
  sendEmailVerification,
  signOut,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  ConfirmationResult
} from 'firebase/auth';
import { doc, setDoc, getDoc, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { auth, db, isFirebaseConfigured } from './firebase';

export interface UserProfileData {
  uid?: string;
  fullName: string;
  email: string;
  mobileNumber?: string;
  role: 'Farmer' | 'Buyer' | 'Admin';
  farmName?: string;
  state?: string;
  district?: string;
  village?: string;
  totalArea?: string;
  farmingMode?: string;
  primaryCrop?: string;
  secondaryCrop?: string;
  emailVerified?: boolean;
  mobileVerified?: boolean;
}

// Validation Rules
export function validatePassword(password: string): { isValid: boolean; errorMsg?: string } {
  if (password.length < 6) {
    return { isValid: false, errorMsg: 'Password must be at least 6 characters long.' };
  }
  return { isValid: true };
}

export function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Friendly Auth Error Message Mapper
export function mapAuthCodeToMessage(code: string): string {
  switch (code) {
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
      return 'An unexpected authentication error occurred. Operating in local mode.';
  }
}

// Duplicate Account Check
export async function checkDuplicateAccount(email?: string, mobileNumber?: string): Promise<{ emailExists: boolean; mobileExists: boolean }> {
  if (!isFirebaseConfigured) return { emailExists: false, mobileExists: false };

  try {
    const functions = getFunctions();
    const checkDuplicate = httpsCallable<{ email?: string; mobileNumber?: string }, { emailExists: boolean; mobileExists: boolean }>(functions, 'checkDuplicateBeforeSignup');
    const res = await checkDuplicate({ email, mobileNumber });
    return res.data;
  } catch {
    let emailExists = false;
    if (email) {
      const snap = await getDoc(doc(db, 'users', email.toLowerCase()));
      if (snap.exists()) emailExists = true;
    }
    return { emailExists, mobileExists: false };
  }
}

// Firebase Email + Password Sign Up Flow with Official Firebase Verification Email Dispatch
export async function signUpWithEmail(profile: UserProfileData, password: string): Promise<UserProfileData> {
  if (!validateEmail(profile.email)) throw new Error('Invalid email format.');

  const passVal = validatePassword(password);
  if (!passVal.isValid) throw new Error(passVal.errorMsg);

  if (isFirebaseConfigured) {
    try {
      const credential = await createUserWithEmailAndPassword(auth, profile.email, password);
      const uid = credential.user.uid;

      // Dispatch official Firebase verification email directly to real Gmail inbox
      try {
        await sendEmailVerification(credential.user);
      } catch (e) {
        console.warn('Firebase email verification dispatch notice:', e);
      }

      const userDoc: UserProfileData = {
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
    } catch (err: any) {
      console.warn('Firebase Auth signup notice:', err.code || err.message);
      const friendlyMsg = mapAuthCodeToMessage(err.code || '') || err.message || 'Registration failed.';
      throw new Error(friendlyMsg);
    }
  }

  return { ...profile, uid: `usr-${Date.now()}` };
}

// Phone Number + OTP Auth Flow
let recaptchaVerifier: RecaptchaVerifier | null = null;

export function setupRecaptcha(containerId: string): RecaptchaVerifier {
  if (recaptchaVerifier) recaptchaVerifier.clear();
  recaptchaVerifier = new RecaptchaVerifier(auth, containerId, {
    size: 'invisible',
    callback: () => {}
  });
  return recaptchaVerifier;
}

export async function requestPhoneOtp(phoneNumber: string, appVerifier: RecaptchaVerifier): Promise<ConfirmationResult> {
  const formattedPhone = phoneNumber.startsWith('+') ? phoneNumber : `+91${phoneNumber.replace(/\D/g, '')}`;
  return await signInWithPhoneNumber(auth, formattedPhone, appVerifier);
}

export async function verifyPhoneOtpAndSignIn(confirmationResult: ConfirmationResult, otp: string): Promise<void> {
  await confirmationResult.confirm(otp);
}

// Sign In & Reset Password Utilities
export async function signInWithEmail(email: string, pass: string): Promise<void> {
  if (isFirebaseConfigured) {
    await signInWithEmailAndPassword(auth, email, pass);
  }
}

export async function sendPasswordReset(email: string): Promise<void> {
  if (isFirebaseConfigured) {
    await sendPasswordResetEmail(auth, email);
  }
}

export async function confirmFirebasePasswordReset(oobCode: string, newPass: string): Promise<void> {
  if (isFirebaseConfigured) {
    await confirmPasswordReset(auth, oobCode, newPass);
  }
}

export async function logoutUserSession(): Promise<void> {
  if (isFirebaseConfigured) {
    await signOut(auth);
  }
}

// Firestore User & Companion Sync Helpers
export async function saveUserDataToFirestore(userId: string, data: any): Promise<void> {
  if (!isFirebaseConfigured) return;
  try {
    const cleanId = userId.includes('@') ? userId.replace(/[^a-zA-Z0-9]/g, '_') : userId;
    await setDoc(doc(db, 'users', cleanId), {
      ...data,
      updatedAt: serverTimestamp()
    }, { merge: true });
    console.log('✅ Document successfully written to Firestore under collection "users" with ID:', cleanId);
  } catch (err) {
    console.warn('Firestore sync error:', err);
  }
}

export async function saveCompanionPlanToFirestore(userId: string, planData: any): Promise<string | null> {
  if (!isFirebaseConfigured) return null;
  try {
    const docRef = await addDoc(collection(db, 'users', userId, 'companionPlans'), {
      ...planData,
      createdAt: serverTimestamp()
    });
    return docRef.id;
  } catch (err) {
    console.warn('Firestore companion plan sync notice:', err);
    return null;
  }
}
