import React from 'react';
import Comm from './comm.jsx'

var SearchBar = React.createClass({
    handleChange: function (e) {
        console.log("handleChange:"+e.target.value)
        this.setState({input:e.target.value});
    },
    handleClick:function () {
        this.props.handleSearch(this.state.input)
    },
    getInitialState: function() {
        console.log("getInitialState")
        return  {input:""};
    },
    render: function() {
        return (
            <div>
                <div className="input-group">
                    <input type="text" className="form-control" placeholder="输入MAC地址"  onChange={this.handleChange} />
                    <span className="input-group-btn">
                        <button className="btn btn-default" type="button" onClick={this.handleClick} >查询</button>
                    </span>
                </div>
            </div>
        );
    }
});

class SearchResultRow extends React.Component {
    render() {

    }
}

class SearchResult extends React.Component {
    render() {

    }
}

var TraceRowWithoutMac = React.createClass({
    render: function() {
        return (
            <tr>
                <td>{this.props.ip}:{this.props.port}</td>
                <td>{this.props.longitude},{this.props.latitude}</td>
                <td>{this.props.time}</td>
            </tr>
        );
    }
})

var TraceTable = React.createClass({
    render: function() {
        var rows = [];
        if(this.props.behavior_log_list != null) {
            this.props.behavior_log_list.forEach(function(log) {
                var date = new Date()
                date.setTime(log.time * 1000)
                var dateString = date.toLocaleString()
                rows.push(<TraceRowWithoutMac ip={log.dst_ip} port={log.dst_port} longitude={log.longitude} latitude={log.latitude} time={dateString} />);
            });
        }

        return (
            <div>
                <table className="table table-striped table-hover">
                    <thead>
                    <tr>
                        <th>访问地址</th>
                        <th>经纬</th>
                        <th>时间</th>
                    </tr>
                    </thead>
                    <tbody>{rows}</tbody>
                </table>
            </div>
        );
    }
});

var BehaviorPage = React.createClass({
    handleSearch: function (value) {
        this.search_value = value
        console.log("handleSearch:" + value)
        console.log("loadTraceFromServer")
        var url = Comm.server_addr + '/behavior/query?request={"mac":"' + value + '"}'
        $.ajax({
            url: url,
            dataType: 'json',
            cache: false,
            success: function (rsp) {
                console.log("loadBehaviorFromServer response", rsp)
                this.setState({data: rsp});
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(url, status, err.toString());
            }.bind(this)
        });
    },
    getInitialState: function () {
        console.log("getInitialState")
        return {data: {behavior_log_list: []}};
    },
    componentDidMount: function () {

    },
    render: function () {
        return(
            <div className="container-fluid page-content">
                <div className="row" style={{width:"300px"}}>
                    <SearchBar handleSearch={this.handleSearch} ></SearchBar>
                </div>
                <div className="row" style={{marginTop:"10px"}}>
                    <div className="col-sm-12">
                        <div className="panel panel-primary">
                            <div className="panel-heading">查询结果</div>
                            <TraceTable behavior_log_list={this.state.data.behavior_log_list}></TraceTable>
                        </div>

                    </div>
                </div>
            </div>
        );
    }
});

module.exports = BehaviorPage;