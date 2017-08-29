import * as api from "./api.js";

let loggedIn = false;
let userInfo = null;
let studentInfo = null;

export async function login() {
    if(loggedIn) {
        return;
    }

    let token = await window.oneidentity.login(document.getElementById("login-container"));
    let result = await api.request("user/login", {
        client_token: token
    });
    if(result.err !== 0) {
        throw new Error("登录失败: " + result.msg);
    }
    loggedIn = true;
}

export async function isLoggedIn() {
    if(!loggedIn) {
        let result = await api.request("user/info");
        if(result.err === 0) {
            loggedIn = true;
        }
    }

    return loggedIn;
}

export async function getUserInfo() {
    if(userInfo) return userInfo;
    let result = await api.request("user/info");
    if(result.err !== 0) {
        throw new Error("Cannot get user info");
    }
    userInfo = result;
    return userInfo;
}

export async function getStudentInfo() {
    if(studentInfo) return studentInfo;
    let result = await api.request("student/info");
    if(result.err !== 0) {
        throw new Error("Cannot get student info");
    }
    studentInfo = result;
    return studentInfo;
}

export async function verifyStudent(zxUsername, zxPassword) {
    if(studentInfo) {
        throw new Error("Already verified");
    }

    let result = await api.request("user/verify/zhixue", {
        username: zxUsername,
        password: zxPassword
    });
    if(result.err !== 0) {
        throw new Error(result.msg);
    }

    return await getStudentInfo();
}

export async function isVerified() {
    if(!loggedIn) {
        return false;
    }

    let info = await getUserInfo();
    return info.verified;
}

export async function logout() {
    let result = await api.request("user/logout");
    if(result.err !== 0) {
        throw new Error(result.msg);
    }
    loggedIn = false;
    flushCache();
}

export async function resetStudentVerification() {
    let result = await api.request("student/remove");
    if(result.err !== 0) {
        throw new Error("Reset failed");
    }
    flushCache();
}

export function flushCache() {
    userInfo = null;
    studentInfo = null;
}
