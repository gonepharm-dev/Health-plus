import { Elysia } from "elysia";
import { UsersController } from "./auth/main";

const start = "Running HealthPlus server....";

const App = new Elysia()
  .onAfterResponse((context) => {
    console.log(context.response);
  })
  .onError(({ code, error, set }) => {
    console.error(error);
    switch (code) {
      case "NOT_FOUND":
        set.status = 404;
        return "Not Found :(";

      case "INTERNAL_SERVER_ERROR":
        set.status = 500;
        return "Internal Server Error :(";

      case "VALIDATION":
        set.status = 400;
        return error;

      default:
        set.status = 400;
        return error;
    }
  })
  .get("/", () => start)
  .use(UsersController)
export default App;
