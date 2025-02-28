import type { RecordModel } from "pocketbase";

export interface User extends RecordModel {
    id: string;
    email: string;
    emailVisibility: boolean;
    username?: string;
    verified: boolean;
    avatar?: string;
    full_name: string;
    specialization?: string;
    active: boolean;
    role: string; // "patient", "doctor", "admin"
    contact_number?: number;
    imageUrl?: string;
    hashedRandomToken?: string;
    emailTokenExpiresAt?: string;
    created: string;
    updated: string;
}

export interface Appointment {
    id: string;
    patient_id: string; // relation to User
    doctor_id: string; // relation to User
    appointment_date: string;
    status: "scheduled" | "completed" | "cancelled" | "in_progress" | "no_show";
    notes?: string;
    consultation_type: "video" | "phone-call" | "in-person";
    created: string;
    updated: string;
    expand?: {
        patient_id?: User;
        doctor_id?: User;
    };
}

export interface PatientProfile {
    id: string;
    user: string; // relation to User
    dateOfBirth: string;
    gender: "male" | "female" | "other" | "prefer_not_to_say";
    address?: string;
    medicalHistory?: Record<string, any>;
    emergencyContact?: string;
    emergencyContactPhone?: string;
    onboardingCompleted: boolean;
    created: string;
    updated: string;
    expand?: {
        user?: User;
    };
}

export interface DoctorProfile {
    id: string;
    user: string; // relation to User
    specialization: string;
    bio: string;
    professionalStatement: string;
    yearsOfExperience: number;
    education: Record<string, any>;
    languages: string[];
    ratingAverage: number;
    ratingCount: number;
    consultationFee: number;
    onboardingCompleted: boolean;
    created: string;
    updated: string;
    expand?: {
        user?: User;
    };
}

export interface DoctorAvailability {
    id: string;
    doctor: string; // relation to User
    dayOfWeek: number;
    startTime: string;
    endTime: string;
    isAvailable: boolean;
    created: string;
    updated: string;
    expand?: {
        doctor?: User;
    };
}

export interface Consultation {
    id: string;
    appointment: string; // relation to Appointment
    meetingLink?: string;
    meetingId?: string;
    joinedByPatient: boolean;
    joinedByDoctor: boolean;
    startedAt?: string;
    endedAt?: string;
    notes?: string;
    diagnosis?: string;
    prescriptions?: Record<string, any>;
    followUpRecommended: boolean;
    created: string;
    updated: string;
    expand?: {
        appointment?: Appointment;
    };
}

export interface Notification {
    id: string;
    user: string; // relation to User
    title: string;
    message: string;
    type: "appointment" | "system" | "payment";
    read: boolean;
    relatedRecord?: Record<string, any>;
    created: string;
    expand?: {
        user?: User;
    };
}

export interface ChatMessage {
    id: string;
    message: string;
    time: string;
    sender_id: string; // relation to User
    receiver_id: string; // relation to User
    room: string;
    created: string;
    updated: string;
    expand?: {
        sender_id?: User;
        receiver_id?: User;
    };
}

export interface Review {
    id: string;
    appointment: string; // relation to Appointment
    patient: string; // relation to User
    doctor: string; // relation to User
    rating: number; 
    comment?: string;
    created: string;
    updated: string;
    expand?: {
        appointment?: Appointment;
        patient?: User;
        doctor?: User;
    };
}

export interface PatientRecord {
    id: string;
    Date: string;
    diagnosis?: string;
    prescription?: string;
    attachments?: Record<string, any>;
    patient: string; // relation to User
    doctor: string; // relation to User
    created: string;
    updated: string;
    expand?: {
        patient?: User;
        doctor?: User;
    };
}

export interface VideoSession {
    id: string;
    session_start: string;
    appointment_id: string; // ideally this should be a relation
    session_end: string;
    session_url: string;
    created: string;
    updated: string;
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