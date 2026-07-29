import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
export async function POST(request) {
    try {
        const { email, otp } = await request.json();
        if (!email || !otp) {
            return NextResponse.json({ error: 'Email and OTP are required.' }, { status: 400 });
        }
        const smtpHost = process.env.SMTP_HOST || 'smtp.gmail.com';
        const smtpPort = Number(process.env.SMTP_PORT) || 587;
        const smtpUser = process.env.SMTP_USER;
        const smtpPass = process.env.SMTP_PASS;
        let transporter;
        if (smtpUser && smtpPass) {
            // Use User Configured SMTP (Gmail App Password, SendGrid, Resend, etc.)
            transporter = nodemailer.createTransport({
                host: smtpHost,
                port: smtpPort,
                secure: smtpPort === 465,
                auth: {
                    user: smtpUser,
                    pass: smtpPass,
                },
            });
        }
        else {
            // Create live Ethereal test SMTP account automatically
            const testAccount = await nodemailer.createTestAccount();
            transporter = nodemailer.createTransport({
                host: 'smtp.ethereal.email',
                port: 587,
                secure: false,
                auth: {
                    user: testAccount.user,
                    pass: testAccount.pass,
                },
            });
        }
        const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head><meta charset="utf-8"/></head>
      <body style="font-family: Arial, sans-serif; background-color: #020617; color: #f8fafc; padding: 24px;">
        <div style="max-width: 560px; margin: 0 auto; background-color: #0f172a; border-radius: 20px; padding: 32px; border: 1px solid #059669; box-shadow: 0 10px 25px rgba(0,0,0,0.5);">
          <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 20px;">
            <h1 style="color: #10b981; margin: 0; font-size: 24px; font-weight: 900;">CropNexa 🌱</h1>
          </div>
          
          <h2 style="color: #ffffff; font-size: 18px; margin-top: 0;">Email Address Verification</h2>
          <p style="font-size: 14px; color: #cbd5e1; line-height: 1.6;">
            You requested a 6-digit verification code to register your farmer account on CropNexa.
          </p>
          
          <div style="background-color: #020617; border: 2px border #059669; padding: 20px; border-radius: 16px; text-align: center; margin: 24px 0;">
            <span style="font-size: 12px; text-transform: uppercase; color: #10b981; letter-spacing: 2px; display: block; margin-bottom: 8px; font-weight: bold;">Your 6-Digit OTP Code</span>
            <div style="font-size: 32px; font-weight: 900; color: #34d399; letter-spacing: 8px; font-family: monospace;">
              ${otp}
            </div>
          </div>
          
          <p style="font-size: 13px; color: #94a3b8; line-height: 1.5;">
            This OTP code is valid for <strong>5 minutes</strong>. If you did not request this code, please ignore this email.
          </p>
          <hr style="border: 0; border-top: 1px solid #1e293b; margin: 24px 0;"/>
          <p style="font-size: 11px; color: #64748b; text-align: center; margin: 0;">
            CropNexa Companion Planting Agricultural System • support@cropnexa.in
          </p>
        </div>
      </body>
      </html>
    `;
        const mailOptions = {
            from: process.env.SMTP_FROM || '"CropNexa Security" <noreply@cropnexa.in>',
            to: email,
            subject: `[${otp}] Your CropNexa Email Verification Code`,
            text: `Your 6-digit CropNexa registration verification OTP is: ${otp}\n\nValid for 5 minutes.`,
            html: htmlContent,
        };
        const info = await transporter.sendMail(mailOptions);
        const previewUrl = nodemailer.getTestMessageUrl(info);
        return NextResponse.json({
            success: true,
            message: `OTP email dispatched to ${email}`,
            messageId: info.messageId,
            previewUrl: previewUrl || null
        });
    }
    catch (err) {
        console.error('Error sending OTP email:', err);
        return NextResponse.json({ error: err.message || 'Failed to send OTP email.' }, { status: 500 });
    }
}
