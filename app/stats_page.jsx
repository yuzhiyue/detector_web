/**
 * Created by Cosine on 2016/8/21.
 */
import React from 'react';
import Comm from './comm.jsx'


var StatsTable = React.createClass({
    loadStateData: function (org_code) {
        $.ajax({
            url: Comm.server_addr + '/summary?request={"org_code": "' + org_code + '"}',
            dataType: 'json',
            cache: false,
            success: function(rsp) {
                if (this.isMounted()) {
                    this.setState({data:rsp});
                }
            }.bind(this),
            error: function(xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },
    componentDidMount: function() {
        console.log("componentDidMount")
        if (this.props.org_code != null) {
            this.loadStateData(this.props.org_code)
        }
    },
    getInitialState: function () {
        return {data:{today_trace_num:0, total_trace_num:0, today_mac_num:0, ap_num:0}}
    },
    render:function () {
        var org_name = this.props.org_name
        if (this.props.org_code != null) {
            org_name = Comm.getOrgName(this.props.org_code)
        }
        return (
        <div className="panel panel-primary">
            <div className="panel-heading">{org_name}</div>
            <table className="table table-striped table-hover">
                <tbody>
                <tr><td>今日探测数量</td><td>{this.state.data.today_trace_num}</td></tr>
                <tr><td>历史探测数量</td><td>{this.state.data.total_trace_num}</td></tr>
                <tr><td>今日探测人数</td><td>{this.state.data.today_mac_num}</td></tr>
                <tr><td>探测器数量</td><td>{this.state.data.ap_num}</td></tr>
                </tbody>
            </table>
        </div>

        )
    }
})

var StatsPage = React.createClass({
    render:function () {
        return (
            <div className="container-fluid page-container">
                <div className="row">
                    <StatsTable org_code="555400905" />
                </div>
                <div className="row">
                    <StatsTable org_name="梅州电信"/>
                </div>
            </div>
        )
    }
})

module.exports = StatsPage;