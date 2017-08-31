import React from "react";
import * as LoginController from "./LoginController.js";
import LinearProgress from 'material-ui/LinearProgress';
import Dialog from 'material-ui/Dialog';

export default class LoginView extends React.Component {
    async componentDidMount() {
        try {
            await LoginController.login();
        } catch(e) {
            console.log(e);
            return;
        }
        /*
        document.dispatchEvent(new CustomEvent(
            "logincomplete",
            {}
        ));*/
    }

    render() {
        return (
            <div>
                <Dialog
                    modal={true}
                    open={true}
                >
                    <LinearProgress mode="indeterminate" />
                </Dialog>
            </div>
        )
    }
}
