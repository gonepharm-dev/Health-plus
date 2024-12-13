import App from "./app";

const startApplication = () => {
  const application = App;
  //TODO: Fetch listening port from .env file
  application.listen(3000);
  console.info(
    `📶 Elysia is running at http://${application.server?.hostname}:${application.server?.port}`,
  );
};

startApplication();