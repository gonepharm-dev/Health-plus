import Elysia, {t} from "elysia";
import { CreateAppointment } from "../dbOperations/appointment";

export const r = "/"

export const CreateNewAppointment = new Elysia()
    .post(
        r,
        async(context) => {
            const {body, set} = context;

            const {doctor_id, patient_id, status, appointment_date, consultation_type, notes} = body
            const appointment = {
                doctor_id, 
                patient_id, 
                status, 
                appointment_date, 
                consultation_type,
                notes
            }

            const Response = await CreateAppointment(appointment)
            if(Response.message === "error"){
                set.status = 400
                return Response
            }else{
                set.status = 200
                return Response
            }

        }, 
        {
            body: t.Object({
                doctor_id: t.String(),
                patient_id: t.String(),
                status: t.String(),
                appointment_date: t.Date(),
                consultation_type: t.String(),
                notes: t.String()
            })
        }
    )