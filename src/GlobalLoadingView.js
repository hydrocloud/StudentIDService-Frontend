import React from "react";
import CircularProgress from "material-ui/CircularProgress";

export default class GlobalLoadingView extends React.Component {
    render() {
        return (
            <div>
                <CircularProgress />
            </div>
        )
    }
}
