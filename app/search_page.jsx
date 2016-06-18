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
                    <input type="text" className="form-control" placeholder="输入MAC地址或手机号"  onChange={this.handleChange} />
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
                <td>{this.props.longitude},{this.props.latitude}</td>
                <td>{this.props.time}</td>
                <td><div><button type="button" className="btn btn-primary btn-sm" data-toggle="modal" data-target="#pictureModal">查看影像</button></div></td>
            </tr>
        );
    }
})

var TraceTable = React.createClass({
    render: function() {
        var rows = [];
        var mac = this.props.mac
        if (mac == null) {
            mac = ""
        }
        this.props.trace.forEach(function(point) {
            var time = point.enter_time
            if (time == null) {
                time = point.time
            }
            var date = new Date()
            date.setTime(time * 1000)
            var dateString = date.toLocaleString()
            if (point.mac == null) {
                point.mac = mac
            }
            rows.push(<TraceRowWithoutMac longitude={point.longitude} latitude={point.latitude} time={dateString} />);
        });
        return (
            <div>
                <table className="table table-striped table-hover">
                    <thead>
                    <tr>
                        <th>经纬</th>
                        <th>时间</th>
                        <th>影像</th>
                    </tr>
                    </thead>
                    <tbody>{rows}</tbody>
                </table>
            </div>
        );
    }
});

var SearchPage = React.createClass({
    handleSearch: function (value) {
        this.search_value = value
        console.log("handleSearch:" + value)
        console.log("loadTraceFromServer")
        var url = ""
        if (value.length == 11){
            url = Comm.server_addr + '/trace?request={"phone":"' + value + '","query_type":"02","start_time":1}'
        } else {
            url = Comm.server_addr + '/trace?request={"mac":"' + value + '","query_type":"01","start_time":1}'
        }
        $.ajax({
            url: url,
            dataType: 'json',
            cache: false,
            success: function (rsp) {
                console.log("loadTraceFromServer response", rsp)
                this.setState({rsp: rsp});
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(url, status, err.toString());
            }.bind(this)
        });
    },
    getInitialState: function () {
        console.log("getInitialState")
        return {rsp: {trace: []}};
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
                            <TraceTable trace={this.state.rsp.trace}></TraceTable>
                        </div>

                    </div>
                </div>
            </div>
        );
    }
});

module.exports = SearchPage;