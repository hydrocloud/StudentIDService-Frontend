import React from "react";
import ReactDOM from "react-dom";

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import injectTapEventPlugin from "react-tap-event-plugin";
import AppBar from "material-ui/AppBar";

import GlobalLoadingView from "./GlobalLoadingView.js";
import VerifyView from "./VerifyView.js";
import LoginView from "./LoginView.js";
import UserInfoView from "./UserInfoView.js";
import * as LoginController from "./LoginController.js";

export class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            current: <GlobalLoadingView />
        };
    }

    componentDidMount() {
        document.addEventListener(
            "requestrestart",
            this.handleRestart.bind(this)
        );
        document.addEventListener(
            "requestviewchange",
            this.handleViewChangeRequest.bind(this)
        );
        document.addEventListener(
            "logincomplete",
            this.handleLoginComplete.bind(this)
        );

        this.start();
    }

    async start() {
        LoginController.flushCache();

        this.setState({
            current: <GlobalLoadingView />
        });

        let loggedIn = await LoginController.isLoggedIn();
        
        let targetView = null;

        if(loggedIn) {
            if(await LoginController.isVerified()) {
                targetView = <UserInfoView />;
            } else {
                targetView = <VerifyView />;
            }
        } else {
            targetView = <LoginView />;
        }

        this.setState({
            current: targetView
        });
    }

    handleRestart(ev) {
        this.start();
    }

    handleViewChangeRequest(ev) {
        this.setState({
            current: ev.targetView
        });
    }

    async handleLoginComplete(ev) {
        let targetView = null;

        if(await LoginController.isVerified()) {
            targetView = <UserInfoView />;
        } else {
            targetView = <VerifyView />;
        }

        this.setState({
            current: targetView
        });
    }

    render() {
        return (
            <MuiThemeProvider>
                <div>
                    <AppBar showMenuIconButton={false} title="Student ID" style={{position: "fixed", width: "100%", top: 0, left: 0}} />
                    <div style={{marginTop: "100px", marginBottom: "30px", width: "100%", paddingLeft: "30px", paddingRight: "30px", boxSizing: "border-box"}}>
                        {this.state.current}
                    </div>
                </div>
            </MuiThemeProvider>
        );
    }
}

injectTapEventPlugin();

ReactDOM.render(
    <App />,
    document.getElementById("container")
);
