export type UserRole = 'doctor' | 'patient';

export interface UserRegistrationData {
    full_name: string;
    contact_number: string;
    role: UserRole;
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
    specialization?: string;
}
