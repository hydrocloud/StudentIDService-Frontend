import React from "react";
import ReactDOM from "react-dom";

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import * as colors from 'material-ui/styles/colors';
import lightBaseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import injectTapEventPlugin from "react-tap-event-plugin";
import AppBar from "material-ui/AppBar";
import FlatButton from 'material-ui/FlatButton';

import GlobalLoadingView from "./GlobalLoadingView.js";
import VerifyView from "./VerifyView.js";
import LoginView from "./LoginView.js";
import UserInfoView from "./UserInfoView.js";
import ExecutorListView from "./ExecutorListView.js";
import * as LoginController from "./LoginController.js";

require("./ConsoleUtils.js");

export class App extends React.Component {
    constructor(props) {
        super(props);

        let primaryColorName = "cyan";

        switch(Math.floor(Math.random() * 10000) % 8) {
            case 0: {
                primaryColorName = "purple";
                break;
            }
            case 1: {
                primaryColorName = "deepPurple";
                break;
            }
            case 2: {
                primaryColorName = "indigo";
                break;
            }
            case 3: {
                primaryColorName = "blue";
                break;
            }
            case 4: {
                primaryColorName = "lightBlue";
                break;
            }
            case 5: {
                primaryColorName = "cyan";
                break;
            }
            case 6: {
                primaryColorName = "teal";
                break;
            }
            case 7: {
                primaryColorName = "green";
                break;
            }
        }

        this.baseTheme = lightBaseTheme;
        this.baseTheme.palette.primary1Color = colors[primaryColorName + "500"];
        this.baseTheme.palette.primary2Color = colors[primaryColorName + "700"];

        this.state = {
            current: <GlobalLoadingView />,
            theme: getMuiTheme(this.baseTheme),
            canListExecutors: false,
            executorListView: null
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
        let userInfo = null;

        if(loggedIn) {
            if(await LoginController.isVerified()) {
                targetView = <UserInfoView />;
                userInfo = await LoginController.getUserInfo();
            } else {
                targetView = <VerifyView />;
            }
        } else {
            targetView = <LoginView />;
        }

        this.setState({
            current: targetView,
            userInfo: userInfo
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

    showExecutorListView() {
        this.setState({
            executorListView: (
                <ExecutorListView onClose={() => this.setState({
                    executorListView: null
                })} />
            )
        });
    }

    render() {
        return (
            <MuiThemeProvider muiTheme={this.theme}>
                <div>
                    <AppBar
                        showMenuIconButton={false}
                        title="Student ID"
                        style={{position: "fixed", width: "100%", top: 0, left: 0}}
                        iconElementRight={
                            (
                                this.state.userInfo
                                && this.state.userInfo.level >= 5
                            )
                            ? <FlatButton
                                label="Executors"
                                onTouchTap={() => this.showExecutorListView()}
                            />
                            : null
                        }
                    />
                    <div style={{marginTop: "100px", marginBottom: "30px", width: "100%", paddingLeft: "30px", paddingRight: "30px", boxSizing: "border-box"}}>
                        {this.state.current}
                    </div>
                    {this.state.executorListView}
                </div>
            </MuiThemeProvider>
        );
    }
}

injectTapEventPlugin();
window.oneidentity.setServiceWindow(document.getElementById("oneidentity-service").contentWindow);

ReactDOM.render(
    <App />,
    document.getElementById("container")
);
