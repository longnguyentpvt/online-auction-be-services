import server from "./app";

import { configuration } from "config";

const { port : listeningPort } = configuration;
server.listen(listeningPort, () => {
  console.info(`App listening on port ${ listeningPort }`);
});
