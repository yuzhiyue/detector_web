import React from 'react';
import Comm from './comm.jsx'
import md5 from 'blueimp-md5'

var UserEdit = React.createClass({
    saveUser:function (e) {
        var user = {
            username:   this.refs.username.value,
            group:      this.refs.group.value.split(","),
            phone:      this.refs.phone.value,
            desc:       this.refs.desc.value,
        }
        if (this.refs.password.value != "") {
            user.password =  md5(this.refs.password.value)
        }
        var url = Comm.server_addr + '/sys_user/update?request=' + JSON.stringify(user);
        console.log("save user ", url)
        $.ajax({
            url: url,
            dataType: 'json',
            cache: false,
            success: function(rsp) {
                console.log("save user response", rsp)
                this.setState({users: rsp.user_list});
            }.bind(this),
            error: function(xhr, status, err) {
                console.error(url, status, err.toString());
            }.bind(this)
        });
    },
    handleChange: function (e) {
        var user = {
            username:   this.refs.username.value,
            password:   this.refs.password.value,
            group:      this.refs.group.value,
            phone:      this.refs.phone.value,
            desc:       this.refs.desc.value,
        }
        this.props.handleUserEditInputData(user)
    },
    render: function () {
        console.log("etit user:" + this.props.user.username)
        var readOnly="readonly"
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
                                        <input type="email" className="form-control" ref="username" onChange={this.handleChange} value={this.props.user.username} />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label for="password" className="col-sm-2 control-label">密码</label>
                                    <div className="col-sm-10">
                                        <input type="email" className="form-control" ref="password" onChange={this.handleChange} />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label for="group" className="col-sm-2 control-label">用户组</label>
                                    <div className="col-sm-10">
                                        <input type="email" className="form-control" ref="group" onChange={this.handleChange} value={this.props.user.group}/>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label for="phone" className="col-sm-2 control-label">电话</label>
                                    <div className="col-sm-10">
                                        <input type="email" className="form-control" ref="phone" onChange={this.handleChange} value={this.props.user.phone}/>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label for="desc" className="col-sm-2 control-label">描述</label>
                                    <div className="col-sm-10">
                                        <input type="email" className="form-control" ref="desc" onChange={this.handleChange} value={this.props.user.desc}/>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-danger btn-sm" onClick={this.saveUser} >保存</button>
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
        return {users:[], edit_readonly:false, user_edit:{username:"",password:"",group:"",phone:"",desc:""}}
    },
    setUserEditData:function(user){
        console.log("setUserEditData:" + user)
        this.setState({user_edit:user})
        this.setReadOnly(true)
    },
    handleUserEditInputData:function(user){
        console.log("handleUserEditInputData:" + user)
        this.setState({user_edit:user})
    },
    setReadOnly:function (value) {
        this.setState({edit_readonly:value})
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
        this.setReadOnly(false)
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
                <UserEdit user={this.state.user_edit} readonly={this.state.readonly} handleUserEditInputData={this.handleUserEditInputData} />
            </div>
        );
    }
})

module.exports = UserPage;