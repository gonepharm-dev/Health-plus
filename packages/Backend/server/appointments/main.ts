import Elysia from "elysia";
import { CreateNewAppointment } from "./CreateAppointment";

export const AppointmentsController = new Elysia().group("/appointents", (app) => 
    app
        .use(CreateNewAppointment)
        .onError(({ code, error, set }) => {
            if (code === "VALIDATION") {
                console.error("❗️ Caught by auth error handling ", error.message);
                set.status = 400;
                return {
                message: error,
                suggest: "Check your values for null values",
                };
            }
            if (code === "INTERNAL_SERVER_ERROR") {
                console.error("❗️ Caught by auth error handling ", error.message);
                set.status = 500;
                return {
                message: "Internal server error",
                error: error.message,
                };
            }
            }),

)