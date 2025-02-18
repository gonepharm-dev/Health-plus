import crypto from 'crypto';

// Generate a random reset token
export const generateResetToken = () => {
    const resetToken:number = crypto.randomInt(10000, 99999);

    const passwordResetToken = crypto.createHash('sha256')
                                        .update(resetToken.toString())
                                        .digest('hex');

    const passwordResetExpiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();

    return { resetToken, passwordResetToken, passwordResetExpiresAt };
};

// Genarate a random token to verify the user email before saving.
export const generateEmailValidator = () => {
    const randomToken: number = crypto.randomInt(100000, 999999);

    const hashedRandomToken = crypto.createHash('sha256')
                                    .update(randomToken.toString())
                                    .digest('hex');

    // Convert expiration time to an ISO string
    const emailTokenExpiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();

    return { randomToken, hashedRandomToken, emailTokenExpiresAt };
};
