/* eslint-disable @typescript-eslint/no-explicit-any */
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import sgMail from '@sendgrid/mail';
import twilio from 'twilio';
import * as crypto from 'crypto';

admin.initializeApp();
const db = admin.firestore();

// API Configuration via Environment Secrets
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY || functions.config().sendgrid?.key;
const SENDGRID_FROM_EMAIL = process.env.SENDGRID_FROM_EMAIL || functions.config().sendgrid?.from || 'noreply@cropnexa.in';

const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID || functions.config().twilio?.sid;
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN || functions.config().twilio?.token;
const TWILIO_PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER || functions.config().twilio?.phone;

if (SENDGRID_API_KEY) sgMail.setApiKey(SENDGRID_API_KEY);
const twilioClient = (TWILIO_ACCOUNT_SID && TWILIO_AUTH_TOKEN) ? twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN) : null;

// ============================================================================
// 1. AUTH TRIGGER: onUserCreate
// Automatically triggers whenever a new user signs up in Firebase Auth
// ============================================================================
export const onUserCreate = functions.auth.user().onCreate(async (user: functions.auth.UserRecord) => {
  const { uid, email, phoneNumber, displayName } = user;
  const now = admin.firestore.FieldValue.serverTimestamp();

  const customClaims = (user.customClaims || {}) as Record<string, any>;
  const fullName = displayName || customClaims.fullName || 'Valued Farmer';
  const mobileNumber = phoneNumber || customClaims.mobileNumber || '';
  const role = customClaims.role || 'Farmer';
  const authProvider = phoneNumber ? 'phone' : 'email';

  // Step 1: Ensure Firestore user document exists
  const userRef = db.collection('users').doc(uid);
  const userSnap = await userRef.get();

  if (!userSnap.exists) {
    await userRef.set({
      fullName,
      email: email || '',
      mobileNumber,
      role,
      emailVerified: user.emailVerified || false,
      mobileVerified: !!phoneNumber,
      authProvider,
      createdAt: now,
      updatedAt: now,
      status: 'active'
    });
  }

  // Step 2: Audit log in signupLogs
  await db.collection('signupLogs').add({
    uid,
    email: email || '',
    mobileNumber,
    authProvider,
    timestamp: now
  });

  // Step 3: Trigger Confirmation Email (if email is available)
  if (email && SENDGRID_API_KEY) {
    try {
      const emailHtml = `
        <!DOCTYPE html>
        <html>
        <head><meta charset="utf-8"/></head>
        <body style="font-family: Arial, sans-serif; background-color: #0f172a; color: #f8fafc; padding: 24px;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #1e293b; border-radius: 16px; padding: 32px; border: 1px solid #065f46;">
            <h1 style="color: #10b981; margin-bottom: 12px; font-size: 24px;">Welcome to CropNexa 🌱</h1>
            <p style="font-size: 15px; color: #cbd5e1; line-height: 1.6;">Dear User,</p>
            <p style="font-size: 14px; color: #cbd5e1; line-height: 1.6;">
              Thank you for choosing CropNexa. We are delighted to welcome you to our platform dedicated to empowering smarter and more efficient farming.
            </p>
            <p style="font-size: 14px; color: #cbd5e1; line-height: 1.6;">
              To complete your registration and securely access your account, please verify your email address by clicking the <strong>"Verify Email Address"</strong> button below:
            </p>
            <div style="text-align: center; margin: 28px 0;">
              <a href="https://cropnexa.in/verify-email?email=${encodeURIComponent(email)}" style="display: inline-block; background-color: #059669; color: white; padding: 14px 28px; border-radius: 12px; text-decoration: none; font-weight: bold; font-size: 15px; box-shadow: 0 4px 12px rgba(5, 150, 105, 0.3);">Verify Email Address</a>
            </div>
            <p style="font-size: 14px; color: #cbd5e1; line-height: 1.6;">
              Once your email has been verified, you'll be able to sign in and enjoy all the features and services CropNexa has to offer.
            </p>
            <p style="font-size: 13px; color: #94a3b8; line-height: 1.6;">
              If you did not create this account, please disregard this email. No further action is required.
            </p>
            <p style="font-size: 14px; color: #cbd5e1; line-height: 1.6; margin-top: 24px;">
              We look forward to supporting you on your agricultural journey.
            </p>
            <hr style="border: 0; border-top: 1px solid #334155; margin: 28px 0;"/>
            <p style="font-size: 13px; color: #10b981; font-weight: bold; margin: 0;">Warm Regards,</p>
            <p style="font-size: 14px; color: #ffffff; font-weight: bold; margin: 4px 0 0 0;">CropNexa Team</p>
            <p style="font-size: 12px; color: #64748b; margin: 2px 0 0 0;">Empowering Smarter Farming 🌱</p>
          </div>
        </body>
        </html>
      `;

      await sgMail.send({
        to: email,
        from: { name: 'CropNexa Team', email: SENDGRID_FROM_EMAIL },
        subject: 'Verify Your Email Address — CropNexa',
        html: emailHtml
      });
      functions.logger.info(`Confirmation email dispatched to ${email}`);
    } catch (err) {
      functions.logger.error('Failed to send confirmation email:', err);
    }
  }

  // Step 4: Trigger Confirmation SMS (if mobile is available)
  if (mobileNumber && twilioClient && TWILIO_PHONE_NUMBER) {
    try {
      const smsText = `CropNexa: Welcome ${fullName}! Your account has been created successfully. Access companion planting insights at cropnexa.in`;
      await twilioClient.messages.create({
        body: smsText.slice(0, 160), // Ensure max 160 chars
        from: TWILIO_PHONE_NUMBER,
        to: mobileNumber
      });
      functions.logger.info(`Confirmation SMS dispatched to ${mobileNumber}`);
    } catch (err) {
      functions.logger.error('Failed to send confirmation SMS:', err);
    }
  }
});

// ============================================================================
// 2. CALLABLE FUNCTION: checkDuplicateBeforeSignup
// Check Firestore and Firebase Auth for existing accounts before submitting form
// ============================================================================
export const checkDuplicateBeforeSignup = functions.https.onCall(async (data: any) => {
  const { email, mobileNumber } = data || {};

  if (!email && !mobileNumber) {
    throw new functions.https.HttpsError('invalid-argument', 'Either email or mobile number must be provided.');
  }

  const result = { emailExists: false, mobileExists: false };

  // Check Email
  if (email) {
    try {
      await admin.auth().getUserByEmail(email);
      result.emailExists = true;
    } catch (err: any) {
      if (err.code !== 'auth/user-not-found') {
        const snap = await db.collection('users').where('email', '==', email).limit(1).get();
        if (!snap.empty) result.emailExists = true;
      }
    }
  }

  // Check Mobile
  if (mobileNumber) {
    const formattedPhone = mobileNumber.startsWith('+') ? mobileNumber : `+91${mobileNumber.replace(/\D/g, '')}`;
    try {
      await admin.auth().getUserByPhoneNumber(formattedPhone);
      result.mobileExists = true;
    } catch (err: any) {
      if (err.code !== 'auth/user-not-found') {
        const snap = await db.collection('users').where('mobileNumber', '==', mobileNumber).limit(1).get();
        if (!snap.empty) result.mobileExists = true;
      }
    }
  }

  return result;
});

// ============================================================================
// 3. CALLABLE FUNCTION: sendCustomOtp (Optional Custom OTP Path)
// Generates a 6-digit OTP, stores hashed OTP with 5 min expiry, sends SMS
// ============================================================================
export const sendCustomOtp = functions.https.onCall(async (data: any) => {
  const { mobileNumber } = data || {};

  if (!mobileNumber || !/^\+?[1-9]\d{9,14}$/.test(mobileNumber)) {
    throw new functions.https.HttpsError('invalid-argument', 'Valid mobile number with country code is required.');
  }

  const otpDocRef = db.collection('otpStore').doc(mobileNumber);
  const otpDoc = await otpDocRef.get();

  // Cooldown & Resend limit check
  if (otpDoc.exists) {
    const otpData = otpDoc.data();
    const lastSent = otpData?.createdAt?.toMillis() || 0;
    const now = Date.now();

    if (now - lastSent < 30000) { // 30 second cooldown
      throw new functions.https.HttpsError('resource-exhausted', 'Please wait 30 seconds before requesting a new OTP.');
    }

    if (otpData?.attempts >= 3) {
      throw new functions.https.HttpsError('permission-denied', 'Maximum OTP requests reached. Please try again later.');
    }
  }

  // Generate 6-digit OTP
  const rawOtp = Math.floor(100000 + Math.random() * 900000).toString();
  const hashedOtp = crypto.createHash('sha256').update(rawOtp).digest('hex');
  const expiresAt = Date.now() + 5 * 60 * 1000; // 5 mins expiry

  await otpDocRef.set({
    hashedOtp,
    expiresAt: admin.firestore.Timestamp.fromMillis(expiresAt),
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    attempts: (otpDoc.exists ? (otpDoc.data()?.attempts || 0) + 1 : 1),
    failedVerificationAttempts: 0
  });

  // Send SMS via Twilio
  if (twilioClient && TWILIO_PHONE_NUMBER) {
    await twilioClient.messages.create({
      body: `Your CropNexa verification OTP is: ${rawOtp}. Valid for 5 minutes. Do not share with anyone.`,
      from: TWILIO_PHONE_NUMBER,
      to: mobileNumber
    });
  }

  return { success: true, message: 'OTP dispatched successfully.', expiresAt };
});

// ============================================================================
// 4. CALLABLE FUNCTION: verifyOtp (Custom OTP Path Verification)
// ============================================================================
export const verifyOtp = functions.https.onCall(async (data: any) => {
  const { mobileNumber, otp } = data || {};

  if (!mobileNumber || !otp) {
    throw new functions.https.HttpsError('invalid-argument', 'Mobile number and OTP are required.');
  }

  const otpDocRef = db.collection('otpStore').doc(mobileNumber);
  const otpDoc = await otpDocRef.get();

  if (!otpDoc.exists) {
    throw new functions.https.HttpsError('not-found', 'No OTP request found for this mobile number.');
  }

  const otpData = otpDoc.data();
  const now = Date.now();

  if (otpData?.expiresAt.toMillis() < now) {
    throw new functions.https.HttpsError('deadline-exceeded', 'OTP has expired. Please request a new code.');
  }

  if (otpData?.failedVerificationAttempts >= 3) {
    throw new functions.https.HttpsError('permission-denied', 'Too many invalid attempts. Please request a new OTP.');
  }

  const submittedHash = crypto.createHash('sha256').update(otp).digest('hex');
  if (submittedHash !== otpData?.hashedOtp) {
    await otpDocRef.update({
      failedVerificationAttempts: admin.firestore.FieldValue.increment(1)
    });
    throw new functions.https.HttpsError('invalid-argument', 'Invalid OTP code.');
  }

  // Clear OTP doc on success
  await otpDocRef.delete();

  return { verified: true, mobileNumber };
});
