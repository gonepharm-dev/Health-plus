export interface newAppointmentType {
    appointment_date: Date;
    status: string;
    // "scheduled" | "completed" | "canceled";
    doctor_id: string;
    patient_id: string;
    notes: string;
    consultation_type: string
    // "video" | "in-person" | "phone call"
}