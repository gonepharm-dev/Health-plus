import { DBInstance } from "../utils/startDB";
import { newAppointmentType } from "../types/apointmentTypes";

const CreateNewAppointment = async(appointment: newAppointmentType) => {
    const {doctor_id, patient_id} = appointment
    try{
        //confirm if doctor id is valid
        const doctor = await DBInstance.collection("User").getList(1, 1, {
            filter: `id = ${doctor_id}`
        })
        if(doctor.items.length === 1){
            //check if user is a doctor
            const doctorRecord = doctor.items[0]
            if(doctorRecord.role !== "Doctor"){
                return {message: "error", error: "Specified user is not a doctor"}
            }
        }else{
            return{message:"error", error: "Invalid doctor"}
        }
        //confirm if patient id is valid
        const patient = await DBInstance.collection("User").getList(1, 1, {
            filter: `id = ${patient_id}`
        })
        if(doctor.items.length !== 1){
            return{message:"error", error: "Invalid patient"}
        }
        //create the record
        const newAppontment = await DBInstance.collection("Appointments").create(appointment)
        return {message: "OK", newAppontment}
    }catch(error){
        return{message: "error", error}
    }
}