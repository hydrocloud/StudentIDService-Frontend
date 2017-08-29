import * as api from "./api.js";

let examList = null;

export async function getExamList() {
    if(examList) return examList;

    examList = await api.request("student/exams");
    return examList;
}

export function flushCache() {
    examList = null;
}
