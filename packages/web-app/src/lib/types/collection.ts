import type { RecordModel } from 'pocketbase';

export interface User extends RecordModel {
  username: string;
  email: string;
  emailVisibility: boolean;
  verified: boolean;
  full_name: string;
  role: 'patient' | 'doctor' | 'admin';
  active: boolean;
  contact_number?: string;
  specialization?: string;
  avatar?: string;
  hashedRandomToken?: string;
  emailTokenExpiresAt?: string;
}

export interface RegistrationData {
  username: string;
  email: string;
  password: string;
  passwordConfirm: string; // 
  role?: 'patient' | 'doctor' | 'admin';
  contact_number?: string;
  specialization?: string;
  full_name: string;
  emailVisibility?: boolean;
  active?: boolean;
  hashedRandomToken?: string;
  emailTokenExpiresAt?: string;
}

export interface AuthResponse {
  token: string;
  record: User;
}