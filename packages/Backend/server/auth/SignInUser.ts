import { loginUser } from "../dbOperations/user";
import Elysia, {t} from "elysia";

export const r = "/sign-in"

export const SignInUser = new Elysia()
    .post(
        r,
        async(context) => {
            const {body, set} = context
            const {subject, password} = body
            const user = {
                subject,
                password
            }
            console.log(user)

            const Response = await loginUser(user)
            console.log(Response)
            if(Response.message === "error"){
                set.status = 400
                return Response
            }else if(Response.message === "OK"){
                set.status = 200
                return Response
            }
        },
        {
            body: t.Object({
                subject: t.String(),
                password: t.String()
            }),
        },
    );