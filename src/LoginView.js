import React from "react";
import * as LoginController from "./LoginController.js";
import LinearProgress from 'material-ui/LinearProgress';
import Dialog from 'material-ui/Dialog';

export default class LoginView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loginPanel: null
        };
    }
    async componentDidMount() {
        this.setState({
            loginPanel: (
                <div id="login-panel"></div>
            )
        });
        setTimeout(() => {
            window.oneidentity_oneclick.renderButtonContainer(document.getElementById("login-panel"), token => {
                this.onLoginComplete(token);
            });
        }, 100);
    }

    async onLoginComplete(token) {
        try {
            await LoginController.login(token);
        } catch(e) {
            console.log(e);
            return;
        }
        document.dispatchEvent(new CustomEvent(
            "logincomplete",
            {}
        ));
    }

    render() {
        return (
            <div>
                <Dialog
                    modal={true}
                    open={true}
                >
                    {this.state.loginPanel}
                </Dialog>
            </div>
        )
    }
}
