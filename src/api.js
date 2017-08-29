import { makeRequest } from "./network.js";

export function request(path, data) {
    return makeRequest("POST", "/api/" + path, data).then(r => JSON.parse(r));
}
