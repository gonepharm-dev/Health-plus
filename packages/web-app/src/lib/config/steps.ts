import type { RegistrationStep, FormStep } from '../types/forms';

export const STEP_ORDER: RegistrationStep[] = ['name', 'email', 'password', 'confirmPassword', 'role'];

export const STEPS: Record<RegistrationStep, FormStep> = {
    name: {
        beforeText: 'Your name is',
        afterText: ', and',
        placeholder: 'Enter your full name',
        type: 'text',
        inputWidth: 'w-64',
        validation: (value: string) => 
            value.trim().length < 2 ? 'Name must be at least 2 characters' : null
    },
    email: {
        beforeText: 'you want to sign up with the email address',
        afterText: '.',
        placeholder: 'Enter your email',
        type: 'email',
        inputWidth: 'w-64',
        validation: (value: string) => {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return !emailRegex.test(value) ? 'Please enter a valid email address' : null;
        }
    },
    password: {
        beforeText: 'Create a strong password with a mix of letters, symbols and numbers',
        afterText: '.',
        placeholder: '••••••••',
        type: 'password',
        inputWidth: 'w-64',
        validation: (value: string) => {
            if (value.length < 8) return 'Password must be at least 8 characters';
            if (!/[A-Z]/.test(value)) return 'Password must include an uppercase letter';
            if (!/[0-9]/.test(value)) return 'Password must include a number';
            if (!/[!@#$%^&*]/.test(value)) return 'Password must include a special character';
            return null;
        }
    },
    confirmPassword: {
        beforeText: 'Please confirm your password',
        afterText: '.',
        placeholder: '••••••••',
        type: 'password',
        inputWidth: 'w-64',
        validation: (value: string) => {
            // Password match validation will be handled in component
            return null;
        }
    },
    role: {
        beforeText: 'Select your role at Gonep',
        afterText: '.',
        placeholder: 'Choose your role',
        type: 'select',
        inputWidth: 'w-64',
        validation: (value: string) => 
            !value ? 'Please select a role' : null
    }
};