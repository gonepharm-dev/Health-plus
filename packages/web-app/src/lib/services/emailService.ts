export interface EmailResponse {
    success: boolean;
    messageId?: string;
    error?: string;
    details?: string;
}

class EmailServiceError extends Error {
    constructor(
        message: string,
        public readonly details?: string
    ) {
        super(message);
        this.name = 'EmailServiceError';
    }
}

class EmailService {
    private async handleResponse(response: Response): Promise<EmailResponse> {
        if (!response.ok) {
            const errorData = await response.json()
                .catch(() => ({ error: 'Unknown error' }));
            
            throw new EmailServiceError(
                errorData.error || 'Failed to send verification code',
                errorData.details
            );
        }
        
        try {
            return await response.json() as EmailResponse;
        } catch (error) {
            throw new EmailServiceError(
                'Invalid response from server',
                error instanceof Error ? error.message : undefined
            );
        }
    }

    async sendOTPEmail(email: string, otp: string): Promise<void> {
        try {
            const response = await fetch('/api/email/send-otp', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({ email, otp })
            });

            const data = await this.handleResponse(response);
            
            if (!data.success) {
                throw new EmailServiceError(
                    data.error || 'Failed to send verification code',
                    data.details
                );
            }
        } catch (error) {
            if (error instanceof EmailServiceError) {
                throw error;
            }
            
            throw new EmailServiceError(
                'Failed to send verification code',
                error instanceof Error ? error.message : 'Unknown error'
            );
        }
    }
}

export const emailService = new EmailService();