import React from 'react';
import Comm from './comm.jsx'
import {drawPath} from './trace_replay.jsx'
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


var FuzzyResultRow = React.createClass({
    handleClick:function (e) {
        this.props.handleTraceSearch(this.props.mac)
    },
    render: function() {
        return (
            <tr>
                <td>{this.props.phone}</td>
                <td>{this.props.mac}</td>
                <td>{this.props.trace_num}</td>
                <td><div><button type="button" className="btn btn-primary btn-sm" onClick={this.handleClick}>查看轨迹</button></div></td>
            </tr>
        );
    }
})

var FuzzySearchResult = React.createClass({
    render: function() {
        var handleTraceSearch = this.props.handleTraceSearch
        var rows = []
        if (this.props.data.feature_list != null) {
            this.props.data.feature_list.forEach(function (feature) {
                rows.push(<FuzzyResultRow mac={feature.mac} phone={feature.phone} trace_num={feature.trace_num} handleTraceSearch={handleTraceSearch}/>)
            });
        }
        return (
            <div>
                <table className="table table-striped">
                    <thead>
                    <tr>
                        <th>电话号码</th>
                        <th>MAC地址</th>
                        <th>轨迹数量</th>
                        <th>查看轨迹</th>
                    </tr>
                    </thead>
                    <tbody>{rows}</tbody>
                </table>
            </div>
        );
    }
})

var TraceRowWithoutMac = React.createClass({
    render: function() {
        return (
            <tr>
                <td>{this.props.longitude},{this.props.latitude}</td>
                <td>{this.props.time}</td>
                <td>{this.props.orgcode}</td>
                <td><div><button type="button"  disabled="disabled" className="btn btn-primary btn-sm" data-toggle="modal" data-target="#pictureModal">查看影像</button></div></td>
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
            if (point.org_code == null) {
                point.org_code = "0"
            }
            rows.push(<TraceRowWithoutMac longitude={point.longitude} latitude={point.latitude} orgcode={point.org_code} time={dateString} />);
        });
        return (
            <div>
                <table className="table table-striped table-hover">
                    <thead>
                    <tr>
                        <th>经纬</th>
                        <th>时间</th>
                        <th>数据来源</th>
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
    handleFuzzySearch:function (value) {
        this.search_value = value
        console.log("handleSearch:" + value)
        console.log("loadTraceFromServer")
        var url =  Comm.server_addr + '/feature/query?request={"get_trace_num":true, "phone":"' + value + '"}'
        $.ajax({
            url: url,
            dataType: 'json',
            cache: false,
            success: function (rsp) {
                console.log("handleFuzzySearch response", rsp)
                this.setState({result_type:2, fuzzy_search_data:rsp});
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(url, status, err.toString());
            }.bind(this)
        });
    },
    handleSearch: function (value) {
        if (/^\d+$/.test(value)) {
            console.log("handleFuzzySearch")
            this.handleFuzzySearch(value)
        } else {
            console.log("handleTraceSearch")
            this.handleTraceSearch(value)
        }
    },
    handleTraceSearch: function (value) {
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
                this.setState({result_type:1, rsp: rsp});
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(url, status, err.toString());
            }.bind(this)
        });
    },
    getInitialState: function () {
        console.log("getInitialState")
        return {result_type:1, rsp: {trace: []}, fuzzy_search_data:{feature_list:[]}};
    },
    componentDidMount: function () {

    },
    traceReplay:function (e) {
        var lnglatArr = []
        var lineArr = []
        this.state.rsp.trace.forEach(function (e) {
            lnglatArr.push(new AMap.LngLat(e.longitude, e.latitude))
        })
        AMap.convertFrom(lnglatArr, "gps", function (status, result) {
            console.log("convert geo", status, result)
            result.locations.forEach(function (pos) {
                lineArr.push([pos.getLng(), pos.getLat()])
            })
            drawPath(lineArr)
        })
    },
    render: function () {
        if(this.state.result_type == 1){
            return(
                <div className="container-fluid page-content">
                    <div className="row" style={{width:"300px"}}>
                        <div className="col-sm-12">
                            <SearchBar handleSearch={this.handleSearch} ></SearchBar>
                        </div>
                    </div>
                    <div className="row" style={{marginTop:"10px"}}>
                        <div className="col-sm-12">
                            <div className="panel panel-primary">
                                <div className="panel-heading">查询结果
                                    <button type="button"  style={{marginLeft:"20px"}} className="btn btn-warning  btn-sm" data-toggle="modal" data-target="#map_replay_box" onClick={this.traceReplay}>轨迹绘制</button>
                                </div>
                                <TraceTable trace={this.state.rsp.trace}></TraceTable>
                            </div>

                        </div>
                    </div>
                </div>
            );
        } else {
            return(
                <div className="container-fluid page-content">
                    <div className="row" style={{width:"300px"}}>
                        <div className="col-sm-12">
                            <SearchBar handleSearch={this.handleSearch} ></SearchBar>
                        </div>
                    </div>
                    <div className="row" style={{marginTop:"10px"}}>
                        <div className="col-sm-12">
                            <div className="panel panel-primary">
                                <div className="panel-heading">查询结果</div>
                                <FuzzySearchResult data={this.state.fuzzy_search_data}  handleTraceSearch={this.handleTraceSearch} ></FuzzySearchResult>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }

    }
});

module.exports = SearchPage;