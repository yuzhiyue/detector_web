import React from 'react';
import Comm from './comm.jsx'

var UserEdit = React.createClass({
    render: function () {
        console.log("etit user:" + this.props.user.username)
        return (
        <div className="modal fade" id="user_edit">
            <div className="modal-dialog modal-lg">
                <div className="modal-content">
                    <div className="modal-header">
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                        <h4 className="modal-title">编辑用户信息</h4>
                    </div>
                    <div className="modal-body">
                        <div>
                            <form className="form-horizontal">
                                <div className="form-group">
                                    <label for="username" className="col-sm-2 control-label">用户名</label>
                                    <div className="col-sm-10">
                                        <input type="email" className="form-control" id="username" value={this.props.user.username}/>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label for="password" className="col-sm-2 control-label">密码</label>
                                    <div className="col-sm-10">
                                        <input type="email" className="form-control" id="password" />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label for="group" className="col-sm-2 control-label">用户组</label>
                                    <div className="col-sm-10">
                                        <input type="email" className="form-control" id="group" value={this.props.user.group}/>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label for="phone" className="col-sm-2 control-label">电话</label>
                                    <div className="col-sm-10">
                                        <input type="email" className="form-control" id="phone" value={this.props.user.phone}/>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label for="desc" className="col-sm-2 control-label">描述</label>
                                    <div className="col-sm-10">
                                        <input type="email" className="form-control" id="desc" value={this.props.user.desc}/>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-danger btn-sm" >保存</button>
                    </div>
                </div>
            </div> 
        </div>
        )
    }
});

var UserRow = React.createClass({
    handleClick: function (e) {
        this.props.setUserEditData(this.props.user)
    },
    render: function () {
        return (
            <tr>
                <td>{this.props.user.username}</td>
                <td>{this.props.user.group}</td>
                <td>{this.props.user.phone}</td>
                <td>{this.props.user.desc}</td>
                <td><button type="button" className="btn btn-warning btn-sm" onClick={this.handleClick} data-container="body" data-toggle="modal" data-target="#user_edit">修改</button>
                    <button type="button" className="btn btn-danger btn-sm" >删除</button>
                </td>
            </tr>
        );
    }
});

var UserPage = React.createClass({
    getInitialState:function () {
        return {users:[], user_edit:{username:"",password:"",group:"",phone:"",desc:""}}
    },
    setUserEditData:function(user){
        console.log("setUserEditData:" + user)
        this.setState({user_edit:user})
    },
    loadData: function() {
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
    },
    componentDidMount:function() {
        this.loadData()
    },
    resetEditUserData:function () {
        this.setState({user_edit:{username:"",password:"",group:"",phone:"",desc:""}})
    },
    render:function() {
        var rows = []
        var fn = this.setUserEditData
        this.state.users.forEach(function (user) {
            rows.push(<UserRow setUserEditData={fn} user={user} />)
        });
        console.log("render" + this.state.user_edit)
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
                    <button type="button" className="btn btn-info btn-sm" onClick={this.resetEditUserData} data-toggle="modal" data-target="#user_edit">添加用户</button>
                </div>
                <UserEdit user={this.state.user_edit} />
            </div>
        );
    }
})

module.exports = UserPage;