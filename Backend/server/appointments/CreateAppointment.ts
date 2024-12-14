import Elysia from "elysia";

export const r = "/"
export const CreateNewAppointment = () => new Elysia()
    .post(
        r,
        async(context) => {
            const {body, set} = context
        }
    )