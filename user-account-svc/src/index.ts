import app from "./app";

import { configuration } from "config";
import http from "http";

const { port: listeningPort } = configuration;

const server = http.createServer(app);
server.listen(listeningPort, () => {
  console.info(`App listening on port ${ listeningPort }`);
});
