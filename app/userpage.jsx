import React from 'react';

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

var UserPage = React.createClass({
    users:[{username:"admin",group:"管理员",desc:"系统管理员", phone:"15870002521"},
        {username:"mzadmin",group:"管理员",desc:"梅州管理员", phone:"18667843244"},
        {username:"mxadmin",group:"区域管理员",desc:"梅县管理员", phone:"18664214241"},
        {username:"mjadmin",group:"区域管理员",desc:"梅江管理员", phone:"18642145641"},
        {username:"user",group:"普通用户",desc:"普通用户", phone:"18665425432"}
    ],
    render: function () {
        var rows = []
        this.users.forEach(function (user) {
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
});

module.exports = UserPage;