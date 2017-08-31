import * as api from "./api.js";

window.fetchZhixueSubjectScores = async function({
    examId,
    loginUsername,
    loginPassword,
    subjectName,
    accountListFromExamId
}) {
    console.log(await api.request(
        "admin/exam/fetch/zhixue/subject_scores?exam_id=" + encodeURIComponent(examId),
        {
            login_username: loginUsername,
            login_password: loginPassword,
            subject_name: subjectName,
            account_list_from_exam_id: accountListFromExamId
        }
    ));
}
