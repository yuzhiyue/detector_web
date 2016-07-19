import React from 'react';
import Comm from './comm.jsx'
import md5 from 'blueimp-md5'

var LoginPage = React.createClass({
    handleClick: function () {
        var username = this.refs.username.value
        console.log("input:" + username)
        var password =  md5(this.refs.password.value)
        var url = Comm.server_addr + '/sys_user/login?request={"username":"' + username + '", "password":"' + password + '"}'
        console.log("login ", url)
        $.ajax({
            url: url,
            dataType: 'json',
            cache: false,
            success: function(rsp) {
                console.log("login response", rsp)
                if(rsp.ret_code == "0") {
                    Comm.addCookie("username", username)
                    window.location.reload();
                }else {
                    alert("用户名或密码错误！")
                }
            }.bind(this),
            error: function(xhr, status, err) {
                console.error(url, status, err.toString());
            }.bind(this)
        });
    },
    render:function () {
        return(
            <div className="container" style={{width:"400px"}}>
                <form className="form-signin" role="form">
                    <h2 className="form-signin-heading">请登陆</h2>
                    <input type="text" className="form-control" placeholder="用户名" ref="username" required autofocus></input>
                    <input type="password" className="form-control" placeholder="密码" ref="password" required></input>
                    <label className="checkbox">
                        <input type="checkbox" value="remember-me"></input>
                    </label>
                    <button type="button" className="btn btn-lg btn-primary btn-block" onClick={this.handleClick}>登陆</button>
                </form>
            </div>
        );
    }
});

module.exports = LoginPage;