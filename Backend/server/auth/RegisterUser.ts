import { CreateUser } from "../dbOperations/user";
import Elysia, {t} from "elysia";
//import { RecordModel } from "pocketbase";

export const r = '/sign-up'

export const RegisterUsers = new Elysia()
    .post(
        r,
        async (context) => {
            const {body, set} = context;

            const {email, username, full_name, password, specialization, contact_number, role, passwordConfirm} = body; 
            const user = {password, passwordConfirm, email, emailVisibility: true, verified: false, username, full_name, specialization, contact_number, role} 

            const Response = await CreateUser(user)
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
                email: t.String(),
                username: t.String(),
                full_name: t.String(),
                password: t.String(),
                passwordConfirm: t.String(),
                specialization: t.String(),
                contact_number: t.Number(),
                role: t.String(),
            }),
        },
    );