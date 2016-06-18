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

var FeatureRow = React.createClass({
    render: function () {
        return (
            <tr>
                <td>{this.props.mac}</td>
                <td>{this.props.phone}</td>
                <td></td>
                <td></td>
                <td>{this.props.time}</td>
                <td>百米</td>
            </tr>
        );
    }
});

var Panel = React.createClass({
    render: function () {
        return (
            <div className="panel panel-default">
                <div className="panel-body">
                    <div style={{float:'left'}}>{this.props.title}</div>
                    <div style={{float:'right'}}><span className="badge">{this.props.body}</span></div>
                </div>
                <div className="panel-footer"><a href={this.props.link}>{this.props.linkText}</a></div>
            </div>
        );
    }
});

var FeaturePage = React.createClass({
    handleSearch: function (value) {
        this.search_value = value
        console.log("handleSearch:" + value)
        console.log("loadTraceFromServer")
        var url =  Comm.server_addr + '/feature/query?request={"phone":"' + value + '","mac":"' + value + '"}'
        $.ajax({
            url: url,
            dataType: 'json',
            cache: false,
            success: function (rsp) {
                console.log("loadFeatureFromServer response", rsp)
                this.setState({search_data:rsp});
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(url, status, err.toString());
            }.bind(this)
        });
    },
    getInitialState: function () {
        return {data:{total_feature_num:0, today_update_feature_num:0, last_update_feature:[]},search_data:{feature_list:[]}}
    },
    componentDidMount: function () {
        var url = Comm.server_addr + '/feature/summary'
        $.ajax({
            url: url,
            dataType: 'json',
            cache: false,
            success: function(rsp) {
                console.log("loadFeatureSummaryFromServer response", rsp)
                this.setState({data: rsp});
            }.bind(this),
            error: function(xhr, status, err) {
                console.error(url, status, err.toString());
            }.bind(this)
        });
    },
    render: function () {
        var rows = []
        if (this.state.search_data.feature_list != null) {
            this.state.search_data.feature_list.forEach(function (feature) {
                var time = feature.time
                var date = new Date()
                date.setTime(time * 1000)
                var dateString = date.toLocaleString()
                rows.push(<FeatureRow mac={feature.mac} phone={feature.phone} idType="" idNo="" time={dateString} orgCode={feature.org_code}/>)
            });
        }
        return (
            <div className="container-fluid page-container">
                <div className="row">
                    <div className="col-sm-6"><Panel title="特征库总数" body={this.state.data.total_feature_num} linkText="查看列表"></Panel></div>
                    <div className="col-sm-6"><Panel title="今日更新数" body={this.state.data.today_update_feature_num} linkText="查看列表"></Panel></div>
                </div>
                <div className="row" style={{width:"300px"}}>
                    <SearchBar handleSearch={this.handleSearch} ></SearchBar>
                </div>
                <div className="row">
                    <div className="panel panel-primary">
                        <div className="panel-heading">特征库搜索结果</div>
                        <table className="table table-striped">
                            <thead>
                            <tr>
                                <th>MAC地址</th>
                                <th>电话号码</th>
                                <th>证件类型</th>
                                <th>证件号</th>
                                <th>时间</th>
                                <th>数据来源</th>
                            </tr>
                            </thead>
                            <tbody>{rows}</tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    }
});

module.exports = FeaturePage;



// var rows = []
// this.state.data.forEach(function (feature) {
//     if (feature.person_list != null && feature.person_list.length > 0){
//         var persion_info = feature.person_list[0]
//         var phone = ""
//         var dateString = ""
//         if (persion_info.phone_list != null && persion_info.phone_list.length > 0){
//             phone = persion_info.phone_list[0].phone_no
//             time = persion_info.phone_list[0].time
//             date = new Date()
//             date.setTime(time * 1000)
//             dateString = date.toLocaleString()
//         }
//
//         rows.push(<FeatureRow mac={feature.mac} phone={phone} idType="" idNo="" time={dateString} />)
//     }
// });