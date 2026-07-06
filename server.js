import app from "./src/app.js";
import { config } from "./src/config/config.js";
import { databaseConnection } from "./src/config/database.js";

const PORT = config.PORT || 4000;

const server = async () => {
  try {
    await databaseConnection();

    app.listen(PORT, () => {
      console.log("server is started at port ", PORT);
    });
  } catch (err) {
    console.log("Failed to starting the server", err)
  }
};

server();
