import React from "react";
import CircularProgress from "material-ui/CircularProgress";
import Paper from 'material-ui/Paper';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import { List, ListItem } from 'material-ui/List';
import * as LoginController from "./LoginController.js";
import ExamListView from "./ExamListView.js";
import NormalDialog from "./NormalDialog.js";

export default class UserInfoView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            body: "",
            maybeUserOptions: null
        };
    }

    componentDidMount() {
        this.setState({
            body: <CircularProgress />
        });
        this.fetchAndUpdate();
    }

    async fetchAndUpdate() {
        let userInfo = await LoginController.getUserInfo();
        let studentInfo = await LoginController.getStudentInfo();

        this.setState({
            body: (
                <div>
                    <p style={{fontSize: "14px", lineHeight: "36px"}}>
                        <span>{studentInfo.school_name} {studentInfo.class_name}</span><br />
                        <strong>{studentInfo.name}</strong>{userInfo.level ? (
                            <span style={{color: "#FF0000"}}> (Level {userInfo.level})</span>
                        ) : null}
                    </p>
                    <FlatButton
                        label="选项"
                        primary={true}
                        onTouchTap={() => this.openOptionsDialog(userInfo, studentInfo)}
                    />
                </div>
            )
        });
    }

    async resetStudentVerification() {
        await LoginController.resetStudentVerification();
        document.dispatchEvent(new CustomEvent(
            "requestrestart",
            {}
        ));
    }

    async logout() {
        await LoginController.logout();
        document.dispatchEvent(new CustomEvent(
            "requestrestart",
            {}
        ));
    }

    openOptionsDialog(userInfo, studentInfo) {
        let options = (
            <div>
                <p>用户: {userInfo.username}</p>
                <FlatButton
                    label="重置学生认证"
                    secondary={true}
                    onTouchTap={() => this.resetStudentVerification()}
                />
                <FlatButton
                    label="退出登录"
                    secondary={true}
                    onTouchTap={() => this.logout()}
                />
            </div>
        );
        this.setState({
            maybeUserOptions: (
                <NormalDialog
                    title="选项"
                    content={options}
                    onClose={() => {
                        this.setState({
                            maybeUserOptions: null
                        });
                    }}
                />
            )
        });
    }

    render() {
        return (
            <div>
                <Paper style={{padding: "20px", boxSizing: "border-box"}}>
                    {this.state.body}
                    {this.state.maybeUserOptions}
                </Paper>
                <ExamListView />
            </div>
        )
    }
}
