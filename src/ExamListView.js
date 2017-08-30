import React from "react";
import CircularProgress from "material-ui/CircularProgress";
import Paper from 'material-ui/Paper';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import { List, ListItem } from 'material-ui/List';
import * as ExamController from "./ExamController.js";
import NormalDialog from "./NormalDialog.js";

export default class ExamListView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            exams: null,
            detailsDialog: null
        };
        this.lastDialogCloseTime = 0;
    }

    componentDidMount() {
        this.update();
    }

    async update() {
        let exams = await ExamController.getExamList();
        exams.sort((a, b) => b.Time - a.Time);

        this.setState({
            exams: exams.map(v => (
                <ListItem
                    key={v.Id}
                    primaryText={v.Name}
                    secondaryText={new Date(v.Time).toLocaleDateString()}
                    onTouchTap={() => this.showDetailsDialog(v)}
                />
            ))
        })
    }

    showDetailsDialog(info) {
        let currentTime = Date.now();
        if(currentTime - this.lastDialogCloseTime < 100) {
            return;
        }

        let rankClickCount = 1;
        let rankLastClickTime = 0;

        let onRankClick = () => {
            let t = Date.now();
            if(t - rankLastClickTime < 200) {
                rankClickCount++;
            } else {
                rankClickCount = 1;
            }
            rankLastClickTime = t;
            if(rankClickCount == 5) {
                rankClickCount = 1;
                ExamController.requestRankUpdate(info.Id)
                    .then(() => alert("Rank Update Scheduled"))
                    .catch(e => alert("Rank Update Failed: " + e));
            }
        }

        let content = (
            <List>
                <ListItem
                    key="total_score"
                    primaryText="总分"
                    secondaryText={"" + info.Score}
                />
                <ListItem
                    key="rank"
                    primaryText="排名"
                    secondaryText={info.RankPercent ? ("前 " + info.RankPercent + "%") : "未知"}
                    onTouchTap={onRankClick}
                />
                {info.Subjects.map((v, i) => {
                    return (
                        <ListItem
                            key={v.Name + i}
                            primaryText={v.Name}
                            secondaryText={"" + v.Score}
                        />
                    );
                })}
            </List>
        );

        this.setState({
            detailsDialog: <NormalDialog
                title={info.Name}
                content={content}
                onClose={() => this.setState({
                    detailsDialog: null
                })}
            />
        })
    }

    render() {
        return (
            <div>
                <Paper style={{padding: "20px", marginTop: "20px", boxSizing: "border-box"}}>
                    <List>{this.state.exams}</List>
                </Paper>
                {this.state.detailsDialog}
            </div>
        );
    }
}
