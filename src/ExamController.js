import * as api from "./api.js";

let examList = null;

export async function getExamList() {
    if(examList) return examList;

    examList = await api.request("student/exams");
    return examList;
}

export async function requestRankUpdate(examId) {
    let result = await api.request(
        "admin/exam/rank/update/total_scores?exam_id=" + encodeURIComponent(examId)
    );
    if(result.err !== 0) {
        throw result.msg;
    }
}

export function flushCache() {
    examList = null;
}
