import React from 'react';
import Comm from './comm.jsx'

var FeatureRow = React.createClass({
    render: function () {
        return (
            <tr>
                <td>{this.props.mac}</td>
                <td>{this.props.phone}</td>
                <td>{this.props.idType}</td>
                <td>{this.props.idNo}</td>
                <td>{this.props.time}</td>
                <td><button type="button" className="btn btn-warning btn-sm" data-container="body" data-toggle="popover" data-placement="top" data-content="无操作权限">保存</button>
                    <button type="button" className="btn btn-danger btn-sm" >删除</button>
                </td>
            </tr>
        );
    }
});

var FeaturePage = React.createClass({
    getInitialState: function () {
        return {data:[]}
    },
    componentDidMount: function () {
        var url = Comm.server_addr + '/device_user?request={"mac":["b8bc1b9e6d19","94d8592cb3c0","b4ef39251d7a","3480b3243fa4","a018282b2738","2c5bb834155c"]}'
        $.ajax({
            url: url,
            dataType: 'json',
            cache: false,
            success: function(rsp) {
                console.log("loadFeatureFromServer response", rsp)
                this.setState({data: rsp.result});
            }.bind(this),
            error: function(xhr, status, err) {
                console.error(url, status, err.toString());
            }.bind(this)
        });
    },
    render: function () {
        var rows = []
        this.state.data.forEach(function (feature) {
            if (feature.person_list != null && feature.person_list.length > 0){
                var persion_info = feature.person_list[0]
                var phone = ""
                var dateString = ""
                if (persion_info.phone_list != null && persion_info.phone_list.length > 0){
                    phone = persion_info.phone_list[0].phone_no
                    time = persion_info.phone_list[0].time
                    date = new Date()
                    date.setTime(time * 1000)
                    dateString = date.toLocaleString()
                }

                rows.push(<FeatureRow mac={feature.mac} phone={phone} idType="" idNo="" time={dateString} />)
            }
        });
        return (
            <div className="container-fluid page-container">
                <div className="row">
                    <table className="table table-striped">
                        <thead>
                        <tr>
                            <th>MAC地址</th>
                            <th>电话号码</th>
                            <th>证件类型</th>
                            <th>证件号</th>
                            <th>时间</th>
                            <th>编辑</th>
                        </tr>
                        </thead>
                        <tbody>{rows}</tbody>
                    </table>
                    <button type="button" className="btn btn-info btn-sm">添加特征</button>
                    <div style={{marginTop:'5px'}} ><button type="button" style={{float:'left'}} className="btn btn-info btn-sm">上一页</button>
                        <button type="button" style={{float:'right'}} className="btn btn-info btn-sm">下一页</button>
                    </div>

                </div>
            </div>
        );
    }
});

module.exports = FeaturePage;