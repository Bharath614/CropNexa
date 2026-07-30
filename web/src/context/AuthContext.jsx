import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, sendEmailVerification, sendPasswordResetEmail, signOut, signInWithPhoneNumber } from 'firebase/auth';
import { auth } from '@/utils/firebase';
const AuthContext = createContext(undefined);
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            setUser(firebaseUser);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);
    const login = async (email, password) => {
        const credential = await signInWithEmailAndPassword(auth, email, password);
        return credential.user;
    };
    const register = async (email, password) => {
        const credential = await createUserWithEmailAndPassword(auth, email, password);
        // Optional: send verification email automatically
        await sendEmailVerification(credential.user);
        return credential.user;
    };
    const logout = async () => {
        await signOut(auth);
    };
    const sendVerificationEmail = async () => {
        if (auth.currentUser) {
            await sendEmailVerification(auth.currentUser);
        }
    };
    const resetPassword = async (email) => {
        await sendPasswordResetEmail(auth, email);
    };
    const startPhoneSignIn = async (phoneNumber, appVerifier) => {
        const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
        return confirmationResult;
    };
    const confirmPhoneSignIn = async (confirmationResult, code) => {
        const credential = await confirmationResult.confirm(code);
        return credential.user;
    };
    return (<AuthContext.Provider value={{
            user,
            loading,
            login,
            register,
            logout,
            sendVerificationEmail,
            resetPassword,
            startPhoneSignIn,
            confirmPhoneSignIn,
        }}>
      {children}
    </AuthContext.Provider>);
};
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
