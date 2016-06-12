import React from 'react';
import Comm from './comm.jsx'

var UserRow = React.createClass({
    render: function () {
        return (
            <tr>
                <td>{this.props.username}</td>
                <td>{this.props.group}</td>
                <td>{this.props.phone}</td>
                <td>{this.props.desc}</td>
                <td><button type="button" className="btn btn-warning btn-sm" data-container="body" data-toggle="popover" data-placement="top" data-content="无操作权限">修改</button>
                    <button type="button" className="btn btn-danger btn-sm" >删除</button>
                </td>
            </tr>
        );
    }
});

class UserPage extends React.Component {
    constructor() {
        super();
        this.state = {users:[]}
    }
    loadData () {
        var url = Comm.server_addr + '/sys_user/list'
        $.ajax({
            url: url,
            dataType: 'json',
            cache: false,
            success: function(rsp) {
                console.log("load sys user response", rsp)
                this.setState({users: rsp.user_list});
            }.bind(this),
            error: function(xhr, status, err) {
                console.error(url, status, err.toString());
            }.bind(this)
        });
    }
    componentDidMount() {
        this.loadData()
    }
    render() {
        var rows = []
        this.state.users.forEach(function (user) {
            rows.push(<UserRow username={user.username} phone={user.phone} group={user.group} desc={user.desc} />)
        });
        return (
            <div className="container-fluid page-container">
                <div className="row">
                    <table className="table table-striped">
                        <thead>
                        <tr>
                            <th>用户名</th>
                            <th>用户组</th>
                            <th>联系电话</th>
                            <th>描述</th>
                            <th>编辑</th>
                        </tr>
                        </thead>
                        <tbody>{rows}</tbody>
                    </table>
                    <button type="button" className="btn btn-info btn-sm">添加用户</button>
                </div>
            </div>
        );
    }
}

module.exports = UserPage;