import { serverInit } from "./app";

async function init() {
  const app = await serverInit();
  app.listen(4000, () => {
    console.log("Server started at http://localhost:4000");
  });
}

init();
