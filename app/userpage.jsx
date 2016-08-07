import React from 'react';
import Comm from './comm.jsx'
import md5 from 'blueimp-md5'




var PrivateItem = React.createClass({
    render:function () {
        return(
            <label className="checkbox-inline"><input type="checkbox" onChange={this.props.handleChange} checked={this.props.checked} value={this.props.group}></input>{this.props.text}</label>
        )
    }
});

var Private = React.createClass({
    render:function () {
        var rows = Comm.PageItems.map(function (e) {
            var checked = false
            for(var i in this.props.group){
                if(e.group === this.props.group[i]){
                    checked = true
                }
            }
            return (<PrivateItem group={e.group} text={e.text} checked={checked} handleChange={this.props.handleChange} />)
        }.bind(this))
        return(
            <div>
                {rows}
            </div>
        )
    }
});

var AreaItem = React.createClass({
    render:function () {
        return(
            <label className="checkbox-inline"><input type="checkbox" onChange={this.props.handleChange} checked={this.props.checked} value={this.props.area}></input>{this.props.area}</label>
        )
    }
});

var Area = React.createClass({
    render:function () {
        var areaItems = ["不限制"].concat(Comm.AreaItems)
        var rows = areaItems.map(function (e) {
            var checked = false
            for(var i in this.props.area){
                if(e === this.props.area[i]){
                    checked = true
                }
            }
            return (<AreaItem area={e} checked={checked} handleChange={this.props.handleChange} />)
        }.bind(this))
        return(
            <div>
                {rows}
            </div>
        )
    }
});

var UserEdit = React.createClass({
    saveUser:function (e) {
        var user = {
            username:   this.refs.username.value,
            group:      this.props.user.group,
            area:      this.props.user.area,
            phone:      this.refs.phone.value,
            desc:       this.refs.desc.value,
        }
        if (this.refs.password.value != "") {
            user.password =  md5(this.refs.password.value)
        }
        var url = encodeURI(Comm.server_addr + '/sys_user/update?request=' + JSON.stringify(user));
        console.log("save user ", url)
        $.ajax({
            url: url,
            dataType: 'json',
            cache: false,
            success: function(rsp) {
                console.log("save user response", rsp)
                window.location.reload();
            }.bind(this),
            error: function(xhr, status, err) {
                console.error(url, status, err.toString());
            }.bind(this)
        });
    },
    handleChange: function () {
        var user = {
            username:   this.refs.username.value,
            password:   this.refs.password.value,
            group:      this.props.user.group,
            area:      this.props.user.area,
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
                                <div className="form-group">
                                    <label for="desc" className="col-sm-2 control-label">权限</label>
                                    <div className="col-sm-10">
                                        <Private group={this.props.user.group} handleChange={this.props.handleGroupChange} />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label for="desc" className="col-sm-2 control-label">辖区</label>
                                    <div className="col-sm-10">
                                        <Area area={this.props.user.area} handleChange={this.props.handleAreaChange} />
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
    handleRemoveUser: function (e) {
        var url = Comm.server_addr + '/sys_user/remove?request={"username":"' + this.props.user.username + '"}'
        console.log(url)
        $.ajax({
            url: url,
            dataType: 'json',
            cache: false,
            success: function(rsp) {
                console.log("remove user response", rsp)
                window.location.reload();
            }.bind(this),
            error: function(xhr, status, err) {
                console.error(url, status, err.toString());
            }.bind(this)
        });
    },
    render: function () {
        return (
            <tr>
                <td>{this.props.user.username}</td>
                <td>{this.props.user.group}</td>
                <td>{this.props.user.phone}</td>
                <td>{this.props.user.desc}</td>
                <td><button type="button" className="btn btn-warning btn-sm" onClick={this.handleClick} data-container="body" data-toggle="modal" data-target="#user_edit">修改</button>
                    <button type="button" className="btn btn-danger btn-sm" onClick={this.handleRemoveUser} >删除</button>
                </td>
            </tr>
        );
    }
});

var UserPage = React.createClass({
    getInitialState:function () {
        return {users:[], edit_readonly:false, user_edit:{username:"",password:"",group:[], area:[], phone:"",desc:""}}
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
    handleGroupChange: function (e) {
        var user_edit = this.state.user_edit
        var group = e.target.value
        var checked = e.target.checked
        var newGroup = []
        if (checked) {
            newGroup.push(group)
        }
        user_edit.group.forEach(function (e) {
            if (!checked && group == e) {
                return
            }
            for(var i in newGroup){
                if(e === newGroup[i]){
                    return
                }
            }
            newGroup.push(e)
        })
        user_edit.group = newGroup
        this.setState({user_edit:user_edit})
    },
    handleAreaChange: function (e) {
        var user_edit = this.state.user_edit
        var area = e.target.value
        var checked = e.target.checked
        var newArea = []
        if (checked) {
            newArea.push(area)
        }
        user_edit.area.forEach(function (e) {
            if (!checked && area == e) {
                return
            }
            for(var i in newArea){
                if(e === newArea[i]){
                    return
                }
            }
            newArea.push(e)
        })
        user_edit.area = newArea
        this.setState({user_edit:user_edit})
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
        this.setState({user_edit:{username:"",password:"",group:[], area:[], phone:"",desc:""}})
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
                <UserEdit user={this.state.user_edit} readonly={this.state.readonly} handleUserEditInputData={this.handleUserEditInputData} handleGroupChange={this.handleGroupChange} handleAreaChange={this.handleAreaChange} />
            </div>
        );
    }
})

module.exports = UserPage;