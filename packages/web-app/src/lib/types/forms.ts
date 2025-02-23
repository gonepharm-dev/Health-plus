export type RegistrationStep = 'name' | 'email' | 'password' | 'confirmPassword' | 'role';

export interface FormStep {
    beforeText: string;
    afterText: string;
    placeholder: string;
    type: string;
    inputWidth: string;
    validation?: (value: string) => string | null;
}

export interface FormData {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
    role: string;
}