import React from "react";
import TextField from 'material-ui/TextField';
import RaisedButton from "material-ui/RaisedButton";
import FlatButton from "material-ui/FlatButton";
import Paper from 'material-ui/Paper';
import * as LoginController from "./LoginController.js";

export default class VerifyView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            zxUsername: "",
            zxPassword: ""
        };
    }

    componentDidMount() {
        this.setState({
            loading: false,
            zxUsername: "",
            zxPassword: ""
        });
    }

    async doLogin() {
        this.setState({
            loading: true
        });

        try {
            await LoginController.verifyStudent(
                this.state.zxUsername,
                this.state.zxPassword
            );
            document.dispatchEvent(new CustomEvent(
                "requestrestart",
                {}
            ));
        } catch(e) {
            console.log(e);
            alert("验证失败: " + e);
        }

        this.setState({
            loading: false
        });
    }

    async doLogout() {
        this.setState({
            loading: true
        });

        try {
            await LoginController.logout();
            document.dispatchEvent(new CustomEvent(
                "requestrestart",
                {}
            ));
        } catch(e) {
            console.log(e);
            alert(e);
        }

        this.setState({
            loading: false
        });
    }

    render() {
        return (
            <Paper style={{padding: "20px", boxSizing: "border-box"}}>
                <TextField
                    floatingLabelText="智学网用户名"
                    onChange={ev => this.setState({
                        zxUsername: ev.target.value
                    })}
                    value={this.state.zxUsername}
                /><br />
                <TextField
                    floatingLabelText="智学网密码"
                    onChange={ev => this.setState({
                        zxPassword: ev.target.value
                    })}
                    value={this.state.zxPassword}
                    type="password"
                /><br />
                <RaisedButton
                    label="登录"
                    primary={true}
                    onTouchTap={() => this.doLogin()}
                    disabled={this.state.loading}
                />
                <FlatButton
                    label="登出"
                    primary={true}
                    onTouchTap={() => this.doLogout()}
                    disabled={this.state.loading}
                />
            </Paper>
        )
    }
}
