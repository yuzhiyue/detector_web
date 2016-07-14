import React from 'react';
import Comm from './comm.jsx'

var DetectorConfPage = React.createClass({
    saveConf:function (e) {
        var conf = {
            mac:   this.refs.mac.value,
            longitude: Number(this.refs.lng.value),
            latitude:  Number(this.refs.lat.value),
        }
        var url = Comm.server_addr + '/detector/conf?request=' + JSON.stringify(conf);
        console.log("save conf ", url)
        $.ajax({
            url: url,
            dataType: 'json',
            cache: false,
            success: function(rsp) {
                console.log("save conf response", rsp)
                if(rsp.ret_code == 0) {
                    alert("修改成功！");
                } else {
                    alert("MAC不存在！");
                }
            }.bind(this),
            error: function(xhr, status, err) {
                console.error(url, status, err.toString());
                alert("请求错误，请重试。");
            }.bind(this)
        });
    },
    handleChange: function (e) {
    },
    render: function () {
        return (
            <div className="container-fluid page-container">
                <div className="row">
                    <form className="form-horizontal">
                        <div className="form-group">
                            <label for="username" className="col-sm-2 control-label">MAC</label>
                            <div className="col-sm-10">
                                <input type="email" className="form-control" ref="mac" onChange={this.handleChange} />
                            </div>
                        </div>
                        <div className="form-group">
                            <label for="password" className="col-sm-2 control-label">经度</label>
                            <div className="col-sm-10">
                                <input type="email" className="form-control" ref="lng" onChange={this.handleChange} />
                            </div>
                        </div>
                        <div className="form-group">
                            <label for="group" className="col-sm-2 control-label">纬度</label>
                            <div className="col-sm-10">
                                <input type="email" className="form-control" ref="lat" onChange={this.handleChange} />
                            </div>
                        </div>
                        <div className="form-group">
                            <label for="group" className="col-sm-2 control-label"></label>
                            <div className="col-sm-10">
                                <button type="button" className="btn btn-danger btn-sm" onClick={this.saveConf} >保存</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        )
    }
});

module.exports = DetectorConfPage;