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
        let info = await LoginController.getStudentInfo();

        this.setState({
            body: (
                <div>
                    <p>欢迎, {info.school_name} {info.class_name} {info.name}</p>
                    <FlatButton
                        label="选项"
                        primary={true}
                        onTouchTap={() => this.openOptionsDialog()}
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

    openOptionsDialog() {
        let options = (
            <div>
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
                    <h3>用户信息</h3>
                    {this.state.body}
                    {this.state.maybeUserOptions}
                </Paper>
                <ExamListView />
            </div>
        )
    }
}

class UserOptions extends React.Component {
    constructor(props) {
        super(props);
        this.defaultActions = [
            <FlatButton
                label="OK"
                primary={true}
                onTouchTap={() => this.props.onClose()}
            />
        ];
    }

    render() {
        return (
            <div>
                <Dialog
                    title="选项"
                    actions={this.props.actions || this.defaultActions}
                    modal={true}
                    open={true}
                >{this.props.content}</Dialog>
            </div>
        )
    }
}
