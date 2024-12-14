export interface newAppointmentType {
    appointment_date: Date;
    status: "scheduled" | "completed" | "canceled";
    doctor_id: string;
    patient_id: string;
    notes: string;
    consultation_type: "video" | "in-person" | "phone call"
}