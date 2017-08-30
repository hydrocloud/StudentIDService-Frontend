import React from "react";
import CircularProgress from "material-ui/CircularProgress";
import Paper from 'material-ui/Paper';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import { List, ListItem } from 'material-ui/List';
import * as ExecutionController from "./ExecutionController.js";
import ExamListView from "./ExamListView.js";
import NormalDialog from "./NormalDialog.js";
import JSONPretty from 'react-json-pretty';

export default class ExecutorListView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            executors: [],
            detailsData: null
        };
    }

    async componentDidMount() {
        this.setState({
            executors: []
        });

        let executors = await ExecutionController.getExecutorList();

        this.setState({
            executors: executors.map(v => (
                <ListItem
                    key={v.Id}
                    primaryText={v.Name}
                    secondaryText={
                        <p>
                        {"创建于 " + new Date(v.CreateTime).toLocaleString()}<br />
                        {
                            "已运行 " + v.RunningTime + " 毫秒"
                            + (v.Done ? (
                                " " + (
                                    v.Error ? "出错" : "已完成"
                                )
                             ) : (" " + v.Progress + "%"))
                        }
                        </p>
                    }
                    secondaryTextLines={2}
                    onTouchTap={() => this.setState({
                        detailsData: v
                    })}
                />
            ))
        });
    }

    componentWillUnmount() {
    }

    showDetails(data) {

    }

    render() {
        return (
            <NormalDialog
                title="Executors"
                content={
                    <div>
                        <List>
                            {this.state.executors}
                        </List>
                        {
                            this.state.detailsData
                            ? <ExecutorDetailsView
                                data={this.state.detailsData}
                                onClose={() => this.setState({
                                    detailsData: null
                                })}
                            />
                            : null
                        }
                    </div>
                }
                onClose={() => this.props.onClose()}
            />
        )
    }
}

class ExecutorDetailsView extends React.Component {
    render() {
        return (
            <NormalDialog
                title="Executor Details"
                content={(
                    <JSONPretty json={this.props.data} />
                )}
                onClose={() => this.props.onClose()}
            />
        )
    }
}
