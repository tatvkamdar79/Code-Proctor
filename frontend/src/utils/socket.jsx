import io from "socket.io-client";
import { socketURL } from "../config/config";

const socket = io(socketURL);

export default socket;
