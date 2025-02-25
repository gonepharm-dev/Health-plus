import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import nodemailer from 'nodemailer';

const otpEmailTemplate = (otp: string) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verification Code</title>
</head>
<body style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; margin: 0; padding: 0;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #F3F6FA;">
        <header style="background-color: #0277BD; padding: 20px; text-align: center;">
            <h1 style="color: #FFFFFF; margin: 10px 0; font-size: 28px;">Gonep Pharmaceuticals</h1>
        </header>

        <main style="padding: 30px 25px;">
            <p style="font-size: 16px; color: #333333; margin-bottom: 20px;">Hello,</p>
            
            <div style="background-color: #FFFFFF; padding: 25px; border-radius: 10px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
                <p style="font-size: 15px; line-height: 1.6; color: #555555; margin: 0 0 20px 0;">
                    Your verification code is:
                </p>
                
                <div style="background-color: #B3E5FC; padding: 15px; border-radius: 5px; text-align: center; margin: 20px 0;">
                    <div style="font-size: 24px; font-weight: bold; color: #01579B; letter-spacing: 2px;">${otp}</div>
                    <p style="font-size: 12px; color: #555555; margin: 10px 0 0 0;">This code expires in 5 minutes</p>
                </div>
                
                <p style="font-size: 14px; color: #555555; margin: 20px 0 0 0;">
                    If you didn't request this code, please ignore this email.
                </p>
            </div>

            <p style="font-size: 14px; color: #666666; margin: 25px 0 0 0;">
                Regards,<br>
                <strong>The Gonep Pharmaceuticals Team</strong>
            </p>
        </main>

        <footer style="background-color: #F3F6FA; padding: 20px; text-align: center;">
            <div style="font-size: 12px; color: #666666;">
                <p style="margin: 5px 0;">© ${
                    new Date().getFullYear()
                } Gonep Pharmaceuticals. All rights reserved</p>
            </div>
        </footer>
    </div>
</body>
</html>
`;

export const POST: RequestHandler = async ({ request }) => {
    try {
        const { email, otp } = await request.json();
        
        if (!email || !otp) {
            return json({ 
                success: false, 
                error: 'Email and OTP are required'
            }, { status: 400 });
        }

        // Configure nodemailer transporter
        const transporter = nodemailer.createTransport({
            host: import.meta.env.VITE_BREVO_HOST,
            port: 587,
            auth: {
                user: import.meta.env.VITE_BREVO_USERNAME,
                pass: import.meta.env.VITE_BREVO_PASSWORD
            }
        });

 
        const mailOptions = {
            from: import.meta.env.VITE_BREVO_EMAIL_ADDRESS,
            to: email,
            subject: 'Your Verification Code',
            html: otpEmailTemplate(otp)
        };

        // Send mail
        const info = await transporter.sendMail(mailOptions);

        return json({ 
            success: true, 
            messageId: info.messageId
        });
    } catch (error) {
        console.error('Error sending OTP email:', error);
        return json({ 
            success: false, 
            error: 'Failed to send verification code',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
};