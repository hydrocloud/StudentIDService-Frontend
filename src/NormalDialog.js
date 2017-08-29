import React from "react";
import Dialog from "material-ui/Dialog";
import FlatButton from "material-ui/FlatButton";

let lastCloseTime = 0;

export default class NormalDialog extends React.Component {
    constructor(props) {
        super(props);
        this.defaultActions = [
            <FlatButton
                label="OK"
                primary={true}
                onTouchTap={() => this.handleClose()}
            />
        ];
        this.state = {
            open: false
        };
    }

    componentDidMount() {
        if(Date.now() - lastCloseTime < 100) {
            this.handleClose();
            return;
        }
        this.setState({
            open: true
        });
    }

    componentWillUnmount() {
        this.setState({
            open: false
        });
    }

    handleClose() {
        lastCloseTime = Date.now();
        this.props.onClose();
    }

    render() {
        return (
            <div>
                <Dialog
                    title={this.props.title}
                    actions={this.props.actions || this.defaultActions}
                    modal={true}
                    open={this.state.open}
                    autoScrollBodyContent={true}
                >{this.props.content}</Dialog>
            </div>
        )
    }
}
