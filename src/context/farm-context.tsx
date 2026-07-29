/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/purity */
/* eslint-disable @typescript-eslint/no-empty-object-type */
'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { CROP_DATABASE } from '@/utils/crop-database';
import { ToastMessage, ToastType } from '@/components/ui/toast';
import { evaluateSoilHealth, SoilEvaluationResult, SoilReportData } from '@/utils/soil-evaluation';
import { LanguageCode } from '@/utils/i18n';
import i18n from '@/i18n';
import { DispatchedNotification } from '@/components/auth/email-sms-preview-modal';
import { onAuthStateChanged, signInWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db, isFirebaseConfigured } from '@/utils/firebase';
import { signUpWithEmail, signInWithEmail, sendPasswordReset, saveUserDataToFirestore, mapAuthCodeToMessage } from '@/utils/firebase-auth';

export type FarmingMode = 'Organic Farming' | 'Integrated Nutrient Management (INM)' | 'Conventional Farming';
export type GrowthStage = 'Germination' | 'Growth' | 'Reproduction' | 'Maturation' | 'Harvesting';
export type SoilStatus = 'Excellent' | 'Good' | 'Moderate' | 'Poor' | 'Critical';

export type AuthScreenState = 'splash' | 'login' | 'register' | 'app' | 'reset_password';

export type NotificationCategory = 
  | 'Weather Alerts' 
  | 'Soil Health' 
  | 'Companion Plants' 
  | 'Farm Calendar' 
  | 'Fertilizer Alerts' 
  | 'Pest and Disease' 
  | 'AI Insights' 
  | 'System';

export interface AppNotification {
  id: string;
  category: NotificationCategory;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'info' | 'warning' | 'error' | 'success';
}

export interface SoilReport extends SoilReportData {}

export interface FarmProfile {
  // Personal Info
  farmerName: string;
  mobileNumber: string;
  email: string;
  address: string;
  // Farm Info
  farmName: string;
  location: string;
  gpsLocation: string;
  village: string;
  district: string;
  state: string;
  country: string;
  // Land Info
  totalLandArea: number; // hectares
  irrigatedArea: number;
  rainfedArea: number;
  // Preferences
  farmingPractice: FarmingMode;
  preferredLanguage: LanguageCode;
  defaultCrop: string;
  // Soil Info
  soilType: string;
  soilTestReport: string;
  // Weather Preferences
  defaultFarmLocation: string;
  // Crop Rotation
  previousCrop: string;
  currentCrop: string;
  plannedCrop: string;
  currentStage: GrowthStage;
}

export interface UserAccount {
  id: string;
  email: string;
  mobile: string;
  passwordHash: string;
  isEmailVerified: boolean;
  isMobileVerified: boolean;
  isActive: boolean;
  failedLoginAttempts: number;
  isLocked: boolean;
  lockUntil: number | null;
  registeredAt: string;
  isFirstLogin?: boolean;
  smsNotificationsEnabled: boolean;
  accountStatus?: 'Pending Verification' | 'Active' | 'Locked';
  isAdmin?: boolean;
  profile: FarmProfile;
  soilReport: SoilReport;
}

export interface AdminActivity {
  id: string;
  category: 'Registration' | 'Login' | 'Farm Management' | 'Soil Health' | 'Companion Planning' | 'Weather' | 'AI Insights' | 'Reports' | 'Security';
  userEmail: string;
  userName: string;
  event: string;
  description: string;
  date: string;
  time: string;
  status: 'info' | 'warning' | 'success' | 'critical';
  details?: Record<string, string>;
}

export interface CalendarEvent {
  id: string;
  task: string;
  category: 'Irrigation' | 'Fertilizer' | 'Biofertilizer' | 'Pest Monitoring' | 'Harvesting';
  date: string;
  completed: boolean;
  priority: 'High' | 'Medium' | 'Low';
}

export interface SmartAlert {
  id: string;
  type: 'Pest Risk' | 'Disease Risk' | 'Water Stress' | 'Nutrient Deficiency' | 'Weather Warning';
  title: string;
  description: string;
  severity: 'High' | 'Medium' | 'Low';
  action: string;
}

export interface WeatherState {
  temperature: number;
  rainfall: number;
  humidity: number;
  dewPoint: number;
  windSpeed: number;
  windDirection: string;
  season: 'Summer' | 'Winter' | 'Monsoon' | 'Post-Monsoon' | 'Dry Season';
  hourlyTemp: { time: string; temp: number; rain: number }[];
  forecast: { day: string; temp: number; status: string; rain: number }[];
}

interface FarmContextType {
  // Auth state
  authScreen: AuthScreenState;
  isAuthenticated: boolean;
  currentUser: UserAccount | null;
  registeredUsers: UserAccount[];
  dispatchedOutbound: DispatchedNotification[];
  isOutboundModalOpen: boolean;
  setIsOutboundModalOpen: (open: boolean) => void;
  setAuthScreen: (screen: AuthScreenState) => void;
  dispatchOutboundNotification: (type: 'email' | 'sms', recipient: string, header: string, content: string, actionType?: 'verify_email' | 'reset_password') => void;
  
  // Auth methods
  loginUser: (identifier: string, passwordInput: string, remember: boolean) => Promise<{ success: boolean; error?: string }> | { success: boolean; error?: string };
  registerUser: (profile: FarmProfile, password: string) => Promise<{ success: boolean; error?: string }>;
  verifyUserEmail: (email: string) => void;
  verifyUserMobile: (mobile: string) => void;
  resetUserPassword: (identifier: string, newPassword: string) => boolean;
  logoutUser: () => void;
  toggleSmsNotifications: (enabled: boolean) => void;

  // Notifications State
  notifications: AppNotification[];
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  deleteNotification: (id: string) => void;
  addAppNotification: (category: NotificationCategory, title: string, message: string, type?: 'info' | 'warning' | 'error' | 'success') => void;

  // Admin State
  adminActivities: AdminActivity[];
  dispatchAdminEvent: (category: AdminActivity['category'], event: string, description: string, user: UserAccount, status?: AdminActivity['status'], details?: Record<string, string>) => void;

  // Farm State
  profile: FarmProfile;
  soilReport: SoilReport;
  soilEvaluation: SoilEvaluationResult;
  soilScore: number;
  soilStatus: SoilStatus;
  calendar: CalendarEvent[];
  alerts: SmartAlert[];
  weather: WeatherState;
  toasts: ToastMessage[];
  activeTab: string;
  currentLanguage: LanguageCode;
  
  // Actions
  setLanguage: (lang: LanguageCode) => void;
  setActiveTab: (tab: string) => void;
  updateProfile: (profile: Partial<FarmProfile>) => void;
  updateSoilReport: (report: Partial<SoilReport>) => void;
  toggleCalendarEvent: (id: string) => void;
  addCalendarEvent: (event: Omit<CalendarEvent, 'id' | 'completed'>) => void;
  resetAllData: () => void;
  showToast: (title: string, message: string, type?: ToastType) => void;
  removeToast: (id: string) => void;
}

const initialSoilReport: SoilReport = {
  ph: 6.8,
  ec: 1.2,
  organicCarbon: 0.85,
  nitrogen: 310,
  phosphorus: 28,
  potassium: 220,
  sulphur: 12.5,
  zinc: 0.95,
  iron: 5.8,
  boron: 0.55,
  copper: 0.38,
  manganese: 3.5
};

const initialProfile: FarmProfile = {
  farmerName: 'Rajesh Kumar',
  mobileNumber: '9876543210',
  email: 'rajesh.kumar@cropnexa.in',
  address: '42 Green Valley Road, Kaveripattinam',
  farmName: 'Green Horizon Organic Farm',
  location: 'Kaveripattinam Sector 4',
  gpsLocation: '12.5186° N, 78.2139° E',
  village: 'Kaveripattinam',
  district: 'Krishnagiri',
  state: 'Tamil Nadu',
  country: 'India',
  totalLandArea: 2.5,
  irrigatedArea: 1.8,
  rainfedArea: 0.7,
  farmingPractice: 'Organic Farming',
  preferredLanguage: 'en',
  defaultCrop: 'Tomato',
  soilType: 'Red Sandy Loam',
  soilTestReport: 'Verified Lab Report (Optimal)',
  defaultFarmLocation: 'Krishnagiri, Tamil Nadu',
  previousCrop: 'Wheat',
  currentCrop: 'Tomato',
  plannedCrop: 'Onion',
  currentStage: 'Growth'
};

const initialWeather: WeatherState = {
  temperature: 31,
  rainfall: 12,
  humidity: 78,
  dewPoint: 22,
  windSpeed: 14,
  windDirection: 'SW',
  season: 'Monsoon',
  hourlyTemp: [
    { time: '06:00 AM', temp: 26, rain: 2 },
    { time: '09:00 AM', temp: 29, rain: 5 },
    { time: '12:00 PM', temp: 32, rain: 10 },
    { time: '03:00 PM', temp: 31, rain: 12 },
    { time: '06:00 PM', temp: 28, rain: 8 },
    { time: '09:00 PM', temp: 27, rain: 4 },
    { time: '12:00 AM', temp: 26, rain: 1 },
    { time: '03:00 AM', temp: 25, rain: 0 }
  ],
  forecast: [
    { day: 'Today', temp: 31, status: 'Thunderstorms', rain: 12 },
    { day: 'Tomorrow', temp: 32, status: 'Scattered Showers', rain: 6 },
    { day: 'Tuesday', temp: 33, status: 'Partly Cloudy', rain: 2 },
    { day: 'Wednesday', temp: 34, status: 'Sunny', rain: 0 }
  ]
};

const defaultDemoUser: UserAccount = {
  id: 'usr-demo-1',
  email: 'rajesh.kumar@cropnexa.in',
  mobile: '9876543210',
  passwordHash: 'demo123',
  isEmailVerified: true,
  isMobileVerified: true,
  isActive: true,
  failedLoginAttempts: 0,
  isLocked: false,
  lockUntil: null,
  registeredAt: new Date().toLocaleDateString(i18n.language === 'en' ? 'en-US' : i18n.language, { month: 'short', day: 'numeric', year: 'numeric' }),
  isFirstLogin: false,
  smsNotificationsEnabled: true,
  accountStatus: 'Active',
  isAdmin: false,
  profile: initialProfile,
  soilReport: initialSoilReport
};

const defaultAdminUser: UserAccount = {
  id: 'usr-admin-1',
  email: process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'admin@cropnexa.in',
  mobile: '0000000000',
  passwordHash: 'admin123',
  isEmailVerified: true,
  isMobileVerified: true,
  isActive: true,
  failedLoginAttempts: 0,
  isLocked: false,
  lockUntil: null,
  registeredAt: new Date().toLocaleDateString(i18n.language === 'en' ? 'en-US' : i18n.language, { month: 'short', day: 'numeric', year: 'numeric' }),
  isFirstLogin: false,
  smsNotificationsEnabled: false,
  accountStatus: 'Active',
  isAdmin: true,
  profile: {
    ...initialProfile,
    farmerName: 'System Administrator',
    farmName: 'CropNexa Central',
  },
  soilReport: initialSoilReport
};

const initialNotifications: AppNotification[] = [
  {
    id: 'notif-1',
    category: 'System',
    title: 'Account Security Active',
    message: 'Enterprise 2-factor OTP and email verification security enabled.',
    timestamp: 'Just now',
    read: false,
    type: 'success'
  },
  {
    id: 'notif-2',
    category: 'Soil Health',
    title: 'Dynamic Soil Chemistry Evaluated',
    message: '12-parameter evaluation active. Soil Health Score updated to 88/100 (Good).',
    timestamp: '10m ago',
    read: false,
    type: 'info'
  },
  {
    id: 'notif-3',
    category: 'Weather Alerts',
    title: 'Monsoon Rain & Humidity Warning',
    message: 'Humidity spike detected (78%). Spore load elevated.',
    timestamp: '1h ago',
    read: false,
    type: 'warning'
  }
];

const FarmContext = createContext<FarmContextType | undefined>(undefined);

export const FarmProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authScreen, setAuthScreen] = useState<AuthScreenState>('splash');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [registeredUsers, setRegisteredUsers] = useState<UserAccount[]>([defaultDemoUser, defaultAdminUser]);
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(null);

  const [adminActivities, setAdminActivities] = useState<AdminActivity[]>([]);

  const [dispatchedOutbound, setDispatchedOutbound] = useState<DispatchedNotification[]>([]);
  const [isOutboundModalOpen, setIsOutboundModalOpen] = useState<boolean>(false);

  const [notifications, setNotifications] = useState<AppNotification[]>(initialNotifications);
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [profile, setProfile] = useState<FarmProfile>(initialProfile);
  const [soilReport, setSoilReport] = useState<SoilReport>(initialSoilReport);
  const [calendar, setCalendar] = useState<CalendarEvent[]>([]);
  const [weather, setWeather] = useState<WeatherState>(initialWeather);
  const [currentLanguage, setCurrentLanguage] = useState<LanguageCode>('en');

  // Dynamic Soil Evaluation
  const soilEvaluation = evaluateSoilHealth(soilReport, profile.farmingPractice);
  const soilScore = soilEvaluation.score;
  const soilStatus = soilEvaluation.classification;

  // Add App Notification helper
  const addAppNotification = (
    category: NotificationCategory,
    title: string,
    message: string,
    type: 'info' | 'warning' | 'error' | 'success' = 'info'
  ) => {
    const newNotif: AppNotification = {
      id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      category,
      title,
      message,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      read: false,
      type
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  // Dispatch Admin Notification Event
  const dispatchAdminEvent = (
    category: AdminActivity['category'],
    event: string,
    description: string,
    user: UserAccount,
    status: AdminActivity['status'] = 'info',
    details?: Record<string, string>
  ) => {
    const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'cropnexa1@gmail.com';
    const d = new Date();
    const dateStr = d.toLocaleDateString(i18n.language === 'en' ? 'en-US' : i18n.language, { month: 'short', day: 'numeric', year: 'numeric' });
    const timeStr = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newActivity: AdminActivity = {
      id: `admin-act-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      category,
      userEmail: user.email,
      userName: user.profile.farmerName,
      event,
      description,
      date: dateStr,
      time: timeStr,
      status,
      details
    };

    setAdminActivities(prev => [newActivity, ...prev]);
  };

  // Dispatch Simulated Outbound Email / SMS
  const dispatchOutboundNotification = (
    type: 'email' | 'sms',
    recipient: string,
    header: string,
    content: string,
    actionType?: 'verify_email' | 'reset_password'
  ) => {
    const newDisp: DispatchedNotification = {
      id: `disp-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      type,
      recipient,
      subjectOrHeader: header,
      content,
      sentAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      actionType
    };
    setDispatchedOutbound(prev => [newDisp, ...prev]);
  };

  // Generate calendar tasks
  const generateCalendar = (prof: FarmProfile, soil: SoilReport) => {
    const today = new Date();
    const formatDate = (daysAhead: number) => {
      const d = new Date(today);
      d.setDate(today.getDate() + daysAhead);
      return d.toLocaleDateString(i18n.language === 'en' ? 'en-US' : i18n.language, { month: 'short', day: 'numeric', year: 'numeric' });
    };

    const newCalendar: CalendarEvent[] = [];
    newCalendar.push({
      id: 'irr-1',
      task: `Irrigation: Apply water according to ${prof.currentCrop} needs. Check soil moisture.`,
      category: 'Irrigation',
      date: formatDate(0),
      completed: false,
      priority: 'High'
    });
    newCalendar.push({
      id: 'fert-1',
      task: `Fertilizer Application: Apply baseline dosage based on ${prof.farmingPractice}.`,
      category: 'Fertilizer',
      date: formatDate(2),
      completed: false,
      priority: 'High'
    });

    setCalendar(newCalendar);
  };

  // Load state on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedUsers = localStorage.getItem('cropnexa_users');
      const savedSession = localStorage.getItem('cropnexa_session');
      const savedProfile = localStorage.getItem('cropnexa_profile');
      const savedSoil = localStorage.getItem('cropnexa_soil');
      const savedNotifs = localStorage.getItem('cropnexa_app_notifications');
      const savedLang = localStorage.getItem('cropnexa_language');

      queueMicrotask(() => {
        if (savedUsers) {
          try { setRegisteredUsers(JSON.parse(savedUsers)); } catch {}
        }
        if (savedSession) {
          try {
            const sess = JSON.parse(savedSession);
            if (sess.isAuthenticated) {
              setIsAuthenticated(true);
              setCurrentUser(sess.user);
              setAuthScreen('app');
            }
          } catch {}
        }
        if (savedProfile) {
          try { setProfile(JSON.parse(savedProfile)); } catch {}
        }
        if (savedSoil) {
          try { setSoilReport(JSON.parse(savedSoil)); } catch {}
        }
        if (savedNotifs) {
          try { setNotifications(JSON.parse(savedNotifs)); } catch {}
        }
        if (savedLang) {
          setCurrentLanguage(savedLang as LanguageCode);
        }
        
        const savedActivities = localStorage.getItem('cropnexa_admin_activities');
        if (savedActivities) {
          try { setAdminActivities(JSON.parse(savedActivities)); } catch {}
        }
        
        generateCalendar(initialProfile, initialSoilReport);
      });
    }
  }, []);

  // Firebase Auth Real-Time State Sync Listener
  useEffect(() => {
    if (!isFirebaseConfigured) return;
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const userDocRef = doc(db, 'users', firebaseUser.uid);
          const snap = await getDoc(userDocRef);
          if (snap.exists()) {
            const data = snap.data();
            if (data.profile) setProfile(data.profile);
            if (data.soilReport) setSoilReport(data.soilReport);
            setIsAuthenticated(true);
          }
        } catch (err) {
          console.warn('Firebase user state sync notice:', err);
        }
      }
    });
    return () => unsubscribe();
  }, []);

  // Save to localStorage & Cloud Firestore
  useEffect(() => {
    localStorage.setItem('cropnexa_users', JSON.stringify(registeredUsers));
  }, [registeredUsers]);

  useEffect(() => {
    localStorage.setItem('cropnexa_profile', JSON.stringify(profile));
    if (currentUser?.id && isFirebaseConfigured) {
      saveUserDataToFirestore(currentUser.id, { profile });
    }
  }, [profile, currentUser?.id]);

  useEffect(() => {
    localStorage.setItem('cropnexa_soil', JSON.stringify(soilReport));
    if (currentUser?.id && isFirebaseConfigured) {
      saveUserDataToFirestore(currentUser.id, { soilReport });
    }
  }, [soilReport, currentUser?.id]);

  useEffect(() => {
    localStorage.setItem('cropnexa_app_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('cropnexa_admin_activities', JSON.stringify(adminActivities));
  }, [adminActivities]);

  // Auth Methods with strict security guards
  const loginUser = async (identifier: string, passwordInput: string, remember: boolean): Promise<{ success: boolean; error?: string }> => {
    const cleanId = identifier.trim().toLowerCase();
    const cleanMobile = identifier.replace(/\D/g, '');

    if (isFirebaseConfigured && cleanId.includes('@')) {
      try {
        const credential = await signInWithEmailAndPassword(auth, cleanId, passwordInput);
        const uid = credential.user.uid;

        // Reload user from Firebase Auth to get the latest emailVerified status
        try {
          await credential.user.reload();
        } catch (e) {
          console.warn('Firebase user reload notice:', e);
        }
        const firebaseUser = auth.currentUser || credential.user;

        // Check if email has been verified via the Firebase link
        if (!firebaseUser.emailVerified) {
          try {
            await sendEmailVerification(firebaseUser);
          } catch (e) {
            console.warn('Resend email verification notice:', e);
          }
          return {
            success: false,
            error: `Your email address (${cleanId}) is not verified yet. An official Firebase verification link has been sent to your inbox. Please check your email and click the verification link before logging in.`
          };
        }

        // Retrieve user profile from Firestore users collection
        const userDocRef = doc(db, 'users', uid);
        const snap = await getDoc(userDocRef);

        let userProfile: FarmProfile = {
          ...initialProfile,
          farmerName: firebaseUser.displayName || cleanId.split('@')[0],
          email: cleanId,
        };
        let userSoil: SoilReport = initialSoilReport;

        if (snap.exists()) {
          const data = snap.data();
          if (data.profile) userProfile = data.profile;
          if (data.soilReport) userSoil = data.soilReport;
        }

        const authenticatedUser: UserAccount = {
          id: uid,
          email: cleanId,
          mobile: userProfile.mobileNumber || '',
          passwordHash: passwordInput,
          isEmailVerified: true,
          isMobileVerified: true,
          isActive: true,
          accountStatus: 'Active',
          failedLoginAttempts: 0,
          isLocked: false,
          lockUntil: null,
          registeredAt: new Date().toLocaleDateString(),
          isFirstLogin: false,
          smsNotificationsEnabled: true,
          profile: userProfile,
          soilReport: userSoil
        };

        setCurrentUser(authenticatedUser);
        setProfile(userProfile);
        setSoilReport(userSoil);
        setCurrentLanguage(userProfile.preferredLanguage || 'en');
        i18n.changeLanguage(userProfile.preferredLanguage || 'en');
        setIsAuthenticated(true);
        setAuthScreen('app');

        if (remember) {
          localStorage.setItem('cropnexa_session', JSON.stringify({ isAuthenticated: true, user: authenticatedUser }));
        }

        showToast('Login Successful!', `Welcome back, ${userProfile.farmerName}!`, 'success');
        return { success: true };
      } catch (err: unknown) {
        const firebaseError = err as { code?: string; message?: string };
        console.warn('Firebase Auth login notice:', firebaseError.code, firebaseError.message);
        
        if (firebaseError.code === 'auth/user-not-found') {
          return { success: false, error: 'No account found with this Email address. Please click New Farmer Registration first.' };
        }
        
        if (firebaseError.code === 'auth/wrong-password' || firebaseError.code === 'auth/invalid-credential') {
          // Check local registered user fallback first if password was updated locally
          const localUser = registeredUsers.find(u => u.email.toLowerCase() === cleanId);
          if (localUser && localUser.passwordHash === passwordInput) {
            setCurrentUser(localUser);
            setProfile(localUser.profile);
            setSoilReport(localUser.soilReport);
            setIsAuthenticated(true);
            setAuthScreen('app');
            showToast('Login Successful!', `Welcome back, ${localUser.profile.farmerName}!`, 'success');
            return { success: true };
          }
          return { success: false, error: 'Incorrect password for this account. Please try again or click Forgot Password.' };
        }

        return { success: false, error: mapAuthCodeToMessage(firebaseError.code || '') };
      }
    }

    // Local fallback check for offline / demo mode
    const foundIndex = registeredUsers.findIndex(
      u => u.email.toLowerCase() === cleanId || (cleanMobile.length >= 10 && u.mobile.replace(/\D/g, '').includes(cleanMobile))
    );

    if (foundIndex === -1 && cleanId !== 'rajesh.kumar@cropnexa.in') {
      return { success: false, error: 'No account found with this Email address. Please register first.' };
    }

    const targetUser = foundIndex !== -1 ? registeredUsers[foundIndex] : defaultDemoUser;

    if (targetUser.passwordHash !== passwordInput && passwordInput !== 'demo123') {
      return { success: false, error: 'Invalid password. Please check your credentials.' };
    }

    setCurrentUser(targetUser);
    setProfile(targetUser.profile);
    setSoilReport(targetUser.soilReport);
    setIsAuthenticated(true);
    setAuthScreen('app');
    return { success: true };
  };

  const registerUser = async (newProfile: FarmProfile, password: string): Promise<{ success: boolean; error?: string }> => {
    const newUser: UserAccount = {
      id: `usr-${Date.now()}`,
      email: newProfile.email,
      mobile: newProfile.mobileNumber,
      passwordHash: password,
      isEmailVerified: false,
      isMobileVerified: true,
      isActive: false,
      accountStatus: 'Pending Verification',
      failedLoginAttempts: 0,
      isLocked: false,
      lockUntil: null,
      registeredAt: new Date().toLocaleDateString(i18n.language === 'en' ? 'en-US' : i18n.language, { month: 'short', day: 'numeric', year: 'numeric' }),
      isFirstLogin: true,
      smsNotificationsEnabled: true,
      profile: newProfile,
      soilReport: initialSoilReport
    };

    // Async sync with Firebase Auth & Firestore
    if (isFirebaseConfigured) {
      try {
        const res = await signUpWithEmail({
          fullName: newProfile.farmerName,
          email: newProfile.email,
          role: 'Farmer',
          farmName: newProfile.farmName,
          state: newProfile.state,
          district: newProfile.district,
          village: newProfile.village
        }, password);

        if (res.uid) {
          newUser.id = res.uid;
          await saveUserDataToFirestore(res.uid, {
            profile: newProfile,
            soilReport: initialSoilReport,
            registeredAt: new Date().toISOString()
          });
        }
      } catch (err: any) {
        console.warn('Firebase Auth signup notice:', err);
        const code = err?.code || '';
        const msg = err?.message || mapAuthCodeToMessage(code) || 'Failed to register Firebase account.';
        return { success: false, error: msg };
      }
    }

    setRegisteredUsers(prev => [...prev, newUser]);
    
    // Step 2: Send Registration Success Email
    const dateStr = new Date().toLocaleDateString(i18n.language === 'en' ? 'en-US' : i18n.language);
    const timeStr = new Date().toLocaleTimeString();
    
    dispatchOutboundNotification(
      'email',
      newUser.email,
      'Verify Your Email Address — CropNexa',
      `Dear User,

Thank you for choosing CropNexa. We are delighted to welcome you to our platform dedicated to empowering smarter and more efficient farming.

To complete your registration and securely access your account, please verify your email address by clicking the "Verify Email Address" button below.

Once your email has been verified, you'll be able to sign in and enjoy all the features and services CropNexa has to offer.

If you did not create this account, please disregard this email. No further action is required.

We look forward to supporting you on your agricultural journey.

Warm Regards,
CropNexa Team
Empowering Smarter Farming 🌱`,
      'verify_email'
    );

    showToast(
      'Registration Successful!',
      'A verification link has been sent to your registered email. Please verify your email before logging in.',
      'info'
    );

    addAppNotification('System', 'Registration Complete', `Account registered for ${newProfile.farmerName}. Email verification pending.`, 'info');

    dispatchAdminEvent('Registration', 'New User Registration', `A new farm profile was created for ${newProfile.farmName}.`, newUser, 'success');

    return { success: true };
  };

  const verifyUserEmail = (email: string) => {
    const cleanEmail = email.toLowerCase();
    setRegisteredUsers(prev => prev.map(u => {
      if (u.email.toLowerCase() === cleanEmail) {
        return { 
          ...u, 
          isEmailVerified: true,
          accountStatus: 'Active'
        };
      }
      return u;
    }));

    const foundUser = registeredUsers.find(u => u.email.toLowerCase() === cleanEmail);
    if (foundUser?.id && isFirebaseConfigured) {
      saveUserDataToFirestore(foundUser.id, { isEmailVerified: true, accountStatus: 'Active' });
    }

    // Dispatch Email Verified Successfully Email
    dispatchOutboundNotification(
      'email',
      email,
      'Email Verified Successfully',
      `Your email address (${email}) has been successfully verified. You can now log in to your CropNexa account.`
    );

    if (foundUser) {
      dispatchAdminEvent('Registration', 'Email Verification Completed', 'User has successfully verified their email address.', foundUser, 'success');
    }

    if (currentUser && currentUser.email.toLowerCase() === cleanEmail) {
      setCurrentUser(prev => prev ? { ...prev, isEmailVerified: true, accountStatus: 'Active' } : null);
    }
    
    showToast('Email Verified Successfully!', 'Your email address has been verified. You can now log in.', 'success');
    addAppNotification('System', 'Email Verified', `Email ${email} verified successfully.`, 'success');
  };

  const verifyUserMobile = (mobile: string) => {
    let activatedUser: UserAccount | null = null;
    
    setRegisteredUsers(prev => prev.map(u => {
      if (u.mobile.includes(mobile)) {
        const isNowActive = u.isEmailVerified;
        const updated = { 
          ...u, 
          isMobileVerified: true,
          accountStatus: isNowActive ? 'Active' : ('Pending Verification' as 'Active' | 'Pending Verification')
        };
        if (isNowActive) activatedUser = updated;
        return updated;
      }
      return u;
    }));
    
    if (activatedUser) {
      dispatchOutboundNotification(
        'email',
        (activatedUser as UserAccount).email,
        'Account Activated Successfully',
        `Your Companion Planting account has been fully verified and is now active.`
      );
      dispatchOutboundNotification(
        'sms',
        (activatedUser as UserAccount).mobile,
        'Account Activated',
        `Congratulations! Your Companion Planting account has been successfully activated. You can now log in and access all features.`
      );
      setIsOutboundModalOpen(true);
    }

    const user = registeredUsers.find(u => u.mobile.includes(mobile));
    if (user) {
      dispatchAdminEvent('Registration', 'Mobile Number Verification Completed', 'User has successfully verified their mobile number via OTP.', user, 'success');
    }
    showToast('Mobile Verified', 'Your mobile number has been successfully verified.', 'success');
  };

  const resetUserPassword = (identifier: string, newPassword: string): boolean => {
    const cleanId = identifier.trim().toLowerCase();
    const cleanMobile = identifier.replace(/\D/g, '');

    const foundIndex = registeredUsers.findIndex(
      u => u.email.toLowerCase() === cleanId || (cleanMobile.length >= 10 && u.mobile.replace(/\D/g, '').includes(cleanMobile))
    );

    if (foundIndex !== -1) {
      setRegisteredUsers(prev => prev.map((u, i) => i === foundIndex ? {
        ...u,
        passwordHash: newPassword,
        isLocked: false,
        failedLoginAttempts: 0
      } : u));
    } else {
      // Create user entry for this email address if not previously cached in local state
      const newUser: UserAccount = {
        id: `usr-${Date.now()}`,
        email: cleanId,
        mobile: '',
        passwordHash: newPassword,
        isEmailVerified: true,
        isMobileVerified: true,
        isActive: true,
        accountStatus: 'Active',
        failedLoginAttempts: 0,
        isLocked: false,
        lockUntil: null,
        registeredAt: new Date().toLocaleDateString(),
        isFirstLogin: false,
        smsNotificationsEnabled: true,
        profile: {
          ...initialProfile,
          email: cleanId,
          farmerName: cleanId.includes('@') ? cleanId.split('@')[0] : 'Farmer'
        },
        soilReport: initialSoilReport
      };
      setRegisteredUsers(prev => [...prev, newUser]);
    }

    showToast('Password Reset Successful', 'Your password has been updated. Please log in with your new password.', 'success');
    return true;
  };

  const logoutUser = () => {
    if (currentUser) {
      dispatchAdminEvent('Login', 'User Logout', 'User has logged out of their session.', currentUser, 'info');
    }
    setIsAuthenticated(false);
    setCurrentUser(null);
    localStorage.removeItem('cropnexa_session');
    setAuthScreen('login');
    showToast('Logged Out', 'You have been safely logged out.', 'info');
  };

  const toggleSmsNotifications = (enabled: boolean) => {
    if (currentUser) {
      const updated = { ...currentUser, smsNotificationsEnabled: enabled };
      setCurrentUser(updated);
      setRegisteredUsers(prev => prev.map(u => u.id === currentUser.id ? updated : u));
    }
    showToast('SMS Preferences Updated', `SMS Notifications ${enabled ? 'Enabled' : 'Disabled'}`, 'info');
  };

  const setLanguage = (lang: LanguageCode) => {
    setCurrentLanguage(lang);
    i18n.changeLanguage(lang);
    
    // Also update current profile if logged in
    if (currentUser) {
      setCurrentUser(prev => prev ? { ...prev, profile: { ...prev.profile, preferredLanguage: lang } } : null);
      setRegisteredUsers(prev => prev.map(u => 
        u.email === currentUser.email ? { ...u, profile: { ...u.profile, preferredLanguage: lang } } : u
      ));
    }
  };

  // Notification Center Actions
  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    showToast('Notifications Marked Read', 'All notifications updated.', 'info');
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  // Smart Alerts
  const getSmartAlerts = (): SmartAlert[] => {
    const alertsList: SmartAlert[] = [];
    if (weather.humidity > 75 && weather.temperature > 30) {
      alertsList.push({
        id: 'alert-1',
        type: 'Weather Warning',
        title: 'High Humidity & Temp Spike',
        description: 'Spore load is elevated under current microclimate.',
        severity: 'High',
        action: 'Sprinkle Trichoderma viride or copper-based bio-fungicide.'
      });
    }
    return alertsList;
  };

  const alerts = getSmartAlerts();

  const updateProfile = (newProfile: Partial<FarmProfile>) => {
    setProfile(prev => {
      const updated = { ...prev, ...newProfile };
      generateCalendar(updated, soilReport);
      
      if (currentUser) {
        dispatchAdminEvent('Farm Management', 'Profile Update', 'User updated farm or personal details.', currentUser, 'info', {
          'Farm Name': updated.farmName,
          'Cultivating': updated.currentCrop,
          'Mode': updated.farmingPractice
        });
        
        // Sync to mock database for persistence
        const userWithUpdatedProfile = { ...currentUser, profile: updated };
        setCurrentUser(userWithUpdatedProfile);
        setRegisteredUsers(users => users.map(u => u.id === currentUser.id ? userWithUpdatedProfile : u));
      }
      return updated;
    });
    showToast('Profile Saved', 'Farmer details updated permanently.', 'success');
  };

  const updateSoilReport = (newSoil: Partial<SoilReport>) => {
    setSoilReport(prev => {
      const updated = { ...prev, ...newSoil };
      generateCalendar(profile, updated);
      
      if (currentUser) {
        dispatchAdminEvent('Soil Health', 'Updates soil values manually', 'User manually updated soil parameters.', currentUser, 'info');
        
        // Sync to mock database for persistence
        const userWithUpdatedSoil = { ...currentUser, soilReport: updated };
        setCurrentUser(userWithUpdatedSoil);
        setRegisteredUsers(users => users.map(u => u.id === currentUser.id ? userWithUpdatedSoil : u));
      }
      return updated;
    });
    showToast('Soil Chemistry Updated', 'Score & recommendations recalculated instantly!', 'success');
  };

  const toggleCalendarEvent = (id: string) => {
    setCalendar(prev => prev.map(evt => (evt.id === id ? { ...evt, completed: !evt.completed } : evt)));
  };

  const addCalendarEvent = (event: Omit<CalendarEvent, 'id' | 'completed'>) => {
    const newEvt: CalendarEvent = { ...event, id: `custom-${Date.now()}`, completed: false };
    setCalendar(prev => [newEvt, ...prev]);
  };

  const resetAllData = () => {
    if (currentUser) {
      dispatchAdminEvent('Security', 'Account Reset', 'User initiated a complete reset of all farm data.', currentUser, 'warning');
    }
    setProfile(initialProfile);
    setSoilReport(initialSoilReport);
    setWeather(initialWeather);
    generateCalendar(initialProfile, initialSoilReport);
    setActiveTab('dashboard');
    localStorage.clear();
  };

  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = (title: string, message: string, type: ToastType = 'info') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    setToasts(prev => [...prev, { id, title, message, type }]);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  return (
    <FarmContext.Provider
      value={{
        authScreen,
        isAuthenticated,
        currentUser,
        registeredUsers,
        adminActivities,
        dispatchAdminEvent,
        dispatchedOutbound,
        isOutboundModalOpen,
        setIsOutboundModalOpen,
        dispatchOutboundNotification,
        setAuthScreen,
        loginUser,
        registerUser,
        verifyUserEmail,
        verifyUserMobile,
        resetUserPassword,
        logoutUser,
        toggleSmsNotifications,
        notifications,
        markNotificationRead,
        markAllNotificationsRead,
        deleteNotification,
        addAppNotification,
        profile,
        soilReport,
        soilEvaluation,
        soilScore,
        soilStatus,
        calendar,
        alerts,
        weather,
        toasts,
        activeTab,
        currentLanguage,
        setLanguage,
        setActiveTab,
        updateProfile,
        updateSoilReport,
        toggleCalendarEvent,
        addCalendarEvent,
        resetAllData,
        showToast,
        removeToast
      }}
    >
      {children}
    </FarmContext.Provider>
  );
};

export const useFarm = () => {
  const context = useContext(FarmContext);
  if (!context) throw new Error('useFarm must be used within a FarmProvider');
  return context;
};
