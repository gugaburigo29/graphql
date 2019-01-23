import * as http from 'http'

import App from './app'
import {normalizePort, onError, onListening} from "./utils";

const server = http.createServer(App);
const port = normalizePort(process.env.port || 3000);

server.listen(port);
server.on('error', onError(server));
server.on('listening', onListening(server));

