import React from "react";
import * as LoginController from "./LoginController.js";

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
            <div></div>
        )
    }
}
