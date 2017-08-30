import * as api from "./api.js";

export async function getExecutorList() {
    return await api.request("admin/execution/list");
}
