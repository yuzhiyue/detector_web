/**
 * Created by Cosine on 2016/5/7.
 */


import React from 'react';
import ReactDOM from 'react-dom';
import UserPage from './userpage.jsx'
import LoginPage from './login_page.jsx'
import FeaturePage from './feature_page.jsx'
import SearchPage from './search_page.jsx'
import SimilarPage from './similar_page.jsx'
import BehaviorPage from './behavior_page.jsx'
import Comm from './comm.jsx'
import { Router, Route, IndexRoute, Link, hashHistory } from 'react-router'


var pictures = ["video/1.jpg", "video/2.jpg", "video/3.jpg", "video/4.jpg", "video/5.jpg"]
var PictureList = React.createClass({
    render: function () {
        var componentId = Comm.randomChar(6)
        var target = "#"+componentId
        var picList = []
        this.props.pictures.forEach(function(picture) {
            picList.push(<li className="list-group-item"><img style={{width:"600px"}} src={picture}/></li>)
        });
        return (
            <div id={componentId}>
                <ul className="list-group">{picList}</ul>
            </div>
        );
    }
});

var TopNavbarItem = React.createClass({
    handleClick:function () {
    },
    render: function () {
        return (
            <li onClick={this.handleClick} ><a href={this.props.link}>{this.props.children}</a></li>
        );
    }
});

var TopNavbar = React.createClass({
    handleClick:function () {
        Comm.deleteCookie("username")
    },
    render: function(){
        var menu = this.props.items.map(function(item){
            return (
                <TopNavbarItem link={item.link}>{item.text}</TopNavbarItem>
            )
        });
        return (
            <nav className="navbar navbar-inverse navbar-fixed-top top-bar">
                <div className="container">
                    <ul className="nav navbar-nav">{menu}</ul>
                    <ul className="nav navbar-nav navbar-right">
                        <li><a>当前用户：{this.props.username}</a></li>
                        <li><a href="." onClick={this.handleClick}>注销</a></li>
                    </ul>
                </div>
            </nav>
        );
    }
});

var LeftNavbar = React.createClass({
    render: function () {
        var changePageHandler = this.props.changePageHandler
        var items = this.props.items.map(function(item){
            return (
                <LeftNavbarItem changePageHandler={changePageHandler} link={item.link}>{item.text}</LeftNavbarItem>
            )
        });
        return (
            <nav className="narbar navbar-default left-bar">
                <ul className="nav nav-stacked"> {items} </ul>
            </nav>
        )
    }
});

var LeftNavbarItem = React.createClass({
    handleClick:function () {
        this.props.changePageHandler(this.props.link)
    },
    render: function () {
        return (
            <li><Link to={this.props.link}>{this.props.children}</Link></li>
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

var MyChart = React.createClass({
    componentDidMount: function () {
        console.log("Chart componentDidMount")
        var ctx = document.getElementById(this.props.chartId).getContext("2d");
        var myLineChart = new Chart(ctx, {
            type: 'line',
            data: this.props.data,
            options: Chart.defaults.global
        });
    },
    render: function () {
        return (
            <div className="panel panel-default">
                <div className="panel-body">
                    <canvas id={this.props.chartId} style={{height:"200px"}}></canvas>
                </div>
                <div className="panel-footer"><a href={this.props.link}>{this.props.linkText}</a></div>
            </div>
        );
    }
});

var VideoAnalyser = React.createClass({
    loadData: function () {
        var url = Comm.server_addr + '/video?request={"mac":"868120137840424", "start_time":1, "end_time":1}'
        $.ajax({
            url: url,
            dataType: 'json',
            cache: false,
            success: function(rsp) {
                console.log("loadDetectorInfoFromServer response", rsp)
                this.setState({picture_list: rsp.picture_list});
            }.bind(this),
            error: function(xhr, status, err) {
                console.error(url, status, err.toString());
            }.bind(this)
        });
    },
    componentDidMount: function() {
        this.loadData()
    },
    getInitialState: function() {
        return  {picture_list:[]}
    },
    render: function () {
        var picList = []
        this.state.picture_list.forEach(function(picture) {
            var macList = []
            picture.device_list.forEach(function (device) {
                macList.push(<li className="list-group-item">{device.mac}</li>)
            })
            var date = new Date()
            date.setTime(picture.time * 1000)
            var dateString = date.toLocaleString()
            picList.push(
                <li className="list-group-item">
                    <div className="container-fluid page-content">
                        <div className="row">
                            <div className="col-sm-6">
                                <div className="panel panel-default">
                                    <div className="panel-heading">{dateString}</div>
                                    <img style={{width:"385px"}} src={picture.url}/>
                                </div>
                            </div>
                            <div className="col-sm-6">
                                <div className="panel panel-default">
                                    <div className="panel-heading">周边设备</div>
                                    <ul className="list-group">{macList}</ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </li>
            )
        });
        return (
            <div>
                <ul className="list-group">{picList}</ul>
            </div>
        );
    }
});

var Home = React.createClass({
    loadDetectorsFromServer: function() {
        //console.log("loadDetectorsFromServer")
        $.ajax({
            url: Comm.server_addr + "/detector_list?request={}",
            dataType: 'json',
            cache: false,
            success: function(rsp) {
                if (this.isMounted()) {
                    this.setState({commData:rsp});
                }
            }.bind(this),
            error: function(xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },
    componentDidMount: function() {
        console.log("componentDidMount")
        this.loadDetectorsFromServer();
        setInterval(this.loadDetectorsFromServer, 10000);
    },
    getInitialState: function() {
        return  {commData:{today_mac_count:0 ,detector_list:[{mac:""}]}};
    },
    render: function () {
        var apCount = this.state.commData.detector_list.length
        var data1 = {
            labels : ["13:00","14:00","15:00","16:00","17:00","18:00","19:00"],
            datasets : [
                {
                    label : "MAC数量",
                    fillColor : "rgba(220,220,220,0.5)",
                    strokeColor : "rgba(220,220,220,1)",
                    pointColor : "rgba(220,220,220,1)",
                    pointStrokeColor : "#fff",
                    data : [65,59,90,81,56,55,40]
                }
            ]
        }
        var data2 = {
            labels : ["13:00","14:00","15:00","16:00","17:00","18:00","19:00"],
            datasets : [
                {
                    label : "在线探测器数量",
                    fill: false,
                    lineTension: 0.1,
                    backgroundColor: "rgba(75,192,192,0.4)",
                    borderColor: "rgba(75,192,192,1)",
                    borderCapStyle: 'butt',
                    borderDash: [],
                    borderDashOffset: 0.0,
                    borderJoinStyle: 'miter',
                    pointBorderColor: "rgba(75,192,192,1)",
                    pointBackgroundColor: "#fff",
                    pointBorderWidth: 1,
                    pointHoverRadius: 5,
                    pointHoverBackgroundColor: "rgba(75,192,192,1)",
                    pointHoverBorderColor: "rgba(220,220,220,1)",
                    pointHoverBorderWidth: 2,
                    pointRadius: 1,
                    pointHitRadius: 10,
                    data : [20,20,20,20,20,20,20]
                }
            ]
        }
        return (
            <div className="container-fluid page-content">
                <div className="row">
                    <div className="col-sm-4"><Panel title="今日探测MAC次数" body={this.state.commData.discovermac} linkText="查看列表"></Panel></div>
                    <div className="col-sm-4"><Panel title="今日探测人数" body={this.state.commData.people} linkText="查看列表"></Panel></div>
                    <div className="col-sm-4"><Panel title="探测器数" body={apCount} linkText="查看列表"></Panel></div>
                </div>
                <div className="row">
                    <div className="col-sm-6"><MyChart title="今日探测MAC数" chartId="chart1" data={data1}></MyChart></div>
                    <div className="col-sm-6"><MyChart title="在线设备数" chartId="chart2" data={data2}></MyChart></div>
                </div>
            </div>
        );
    }
});

var TraceRow = React.createClass({
    render: function() {
        return (
            <tr>
                <td>{this.props.mac}</td>
                <td>{this.props.longitude},{this.props.latitude}</td>
                <td>{this.props.time}</td>
                <td><div><button type="button" className="btn btn-primary btn-sm" data-toggle="modal" data-target="#pictureModal">查看影像</button></div></td>
            </tr>
        );
    }
});

var DetectorDetailBox = React.createClass({
    render: function() {
        var rows = [];
        var mac = this.props.mac
        if (mac == null) {
            mac = ""
        }
        var idx = 0
        this.props.trace.forEach(function(point) {
            if (idx > 30 ) {
                return
            }
            idx++
            var time = point.enter_time
            if (time == null) {
                time = point.time
            }
            date = new Date()
            date.setTime(time * 1000)
            var dateString = date.toLocaleString()
            if (point.mac == null) {
                point.mac = mac
            }
            rows.push(<TraceRow mac={point.mac} longitude={point.longitude} latitude={point.latitude} time={dateString} />);
        });
        var date = new Date()
        date.setTime(this.props.detector.last_login_time * 1000)
        var dateString = date.toLocaleString()
        return (
            <div className="container-fluid page-content">
                <div className="row">
                    <div className="col-sm-12">
                        <div className="panel panel-default">
                            <div className="panel-heading">探测器属性</div>
                            <table className="table table-striped table-hover">
                                <thead><tr><th>设备MAC</th><th>经纬</th><th>最近登录时间</th><th>周边设备数</th></tr></thead>
                                <tbody><tr>
                                    <td>{this.props.detector.mac}</td>
                                    <td>{this.props.detector.longitude},{this.props.detector.latitude}</td>
                                    <td>{dateString}</td>
                                    <td>{this.props.trace.length}</td>
                                </tr></tbody>
                            </table>
                            <div><button type="button" className="btn btn-primary btn-sm" data-toggle="modal" data-target="#video_analyser">视频联动分析</button></div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-sm-12">
                        <div className="panel panel-default">
                            <div className="panel-heading">附近的设备</div>
                            <table className="table table-striped table-hover">
                                <thead>
                                <tr>
                                    <th>设备MAC</th>
                                    <th>经纬</th>
                                    <th>时间</th>
                                    <th>影像</th>
                                </tr>
                                </thead>
                                <tbody>{rows}</tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <ModalBox boxId="video_analyser" body={<VideoAnalyser />} title="视频关联分析"/>
            </div>
        );
    }
});

var ModalBox = React.createClass({
    render: function() {
        var bodyCompont = this.props.body
        return (
            <div className="modal fade" id={this.props.boxId}>
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <div className="modal-header">
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                            <h4 className="modal-title">{this.props.title}</h4>
                        </div>
                        <div className="modal-body">
                            {bodyCompont}
                        </div>
                        <div className="modal-footer">
                        </div>
                    </div>
                </div>
            </div>
        );
    }
});


var SimpleSearchPage = React.createClass({
    handleSearch: function (value) {

    },
    getInitialState: function () {
        console.log("getInitialState")
        return {rsp: {trace: []}};
    },
    componentDidMount: function () {

    },
    render: function () {
        return(
            <div className="container-fluid page-content">
                <div className="row" style={{width:"400px"}}>
                    <div className="input-group">
                        <input type="text" className="form-control" placeholder="输入车牌号查询"  />
                    <span className="input-group-btn">
                        <button className="btn btn-default" type="button" onClick={this.handleClick} >查询</button>
                    </span>
                    </div>
                </div>
                <div className="row" style={{marginTop:"10px"}}>
                    <div className="col-sm-12">
                        <div className="panel panel-primary">
                            <div className="panel-heading">查询结果</div>
                            <table className="table table-striped table-hover">
                                <thead>
                                <tr>
                                    <th>车牌号</th>
                                    <th>扫描事件</th>
                                    <th>地址</th>
                                    <th>MAC列表</th>
                                </tr>
                                </thead>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
});

var BehavePage = React.createClass({
    render: function () {
        var thirdNum = this.props.commData.third_part_detector_list.length
        return(
            <div className="container-fluid page-content">
                <div className="row">
                    <div className="panel panel-primary">
                        <div className="panel-heading">上网行为数据：{thirdNum}</div>
                        <DetectorList data={this.props.commData.third_part_detector_list}  showBoxHandler={this.showDeviceListBox}/>
                    </div>
                </div>
            </div>
        );
    }
});

var DetectorPage = React.createClass({
    loadDetectorsFromServer: function() {
        //console.log("loadDetectorsFromServer")
        $.ajax({
            url: Comm.server_addr + "/detector_list?request={}",
            dataType: 'json',
            cache: false,
            success: function(rsp) {
                if (this.isMounted()) {
                    this.setState({commData:rsp});
                    var idx = 1;
                    this.state.commData.detector_list.forEach(function (e) {
                        var text = '<div class="marker-route marker-marker-bus-from"><b>探:'+ idx.toString() +'号</b></div>'
                        new AMap.Marker({
                            map: self.myMap,
                            position: [e.longitude, e.latitude],
                            offset: new AMap.Pixel(-17, -42), //相对于基点的偏移位置
                            draggable: false,  //是否可拖动
                            content: text
                        });
                        idx = idx + 1
                    })
                }
            }.bind(this),
            error: function(xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },
    componentDidMount: function() {
        self.myMap = new AMap.Map('map_detector', {
            resizeEnable: true,
            zoom:14,
            center: [116.109095,24.296806]

        });
        self.myMap.plugin(["AMap.ToolBar"], function() {
            self.myMap.addControl(new AMap.ToolBar());
        });
        

        this.loadDetectorsFromServer();
        setInterval(this.loadDetectorsFromServer, 10000);
    },
    showDeviceListBox: function (apData) {
        var url = Comm.server_addr + '/detector_info?request={"mac":"' + apData.mac + '","start_time":1}'
        $.ajax({
            url: url,
            dataType: 'json',
            cache: false,
            success: function(rsp) {
                console.log("loadDetectorInfoFromServer response", rsp)
                this.setState({deviceList: rsp, current_detector:apData});
            }.bind(this),
            error: function(xhr, status, err) {
                console.error(url, status, err.toString());
            }.bind(this)
        });
    },
    getInitialState: function() {
        return  {deviceList:{device_list:[]}, current_detector:{mac:"", longitude:0, latitude:0,last_login_time:0},commData:{today_mac_count:0 ,third_part_detector_list:[], detector_list:[{mac:""}]}}
    },
    render: function () {
        var modalBody =  <DetectorDetailBox trace={this.state.deviceList.device_list} detector={this.state.current_detector}/>
        var thirdNum = this.state.commData.third_part_detector_list.length
        return(
            <div className="container-fluid page-content">
                <div className="row">
                    <div className="col-sm-8">
                        <div className="panel panel-primary">
                            <div className="panel-heading">探测器分布</div>
                            <div id="map_detector" className="map"/>
                        </div>
                    </div>
                    <div className="col-sm-4">
                        <div className="panel panel-primary">
                            <div className="panel-heading">今日探测人数：{this.state.commData.people}</div>
                            <DetectorList data={this.state.commData.detector_list}  showBoxHandler={this.showDeviceListBox}/>
                        </div>
                        <div className="panel panel-primary">
                            <div className="panel-heading">第三方探测器数量：{thirdNum}</div>
                            <DetectorList data={this.state.commData.third_part_detector_list}  showBoxHandler={this.showDeviceListBox}/>
                        </div>
                    </div>
                </div>
                <ModalBox boxId="device_list_box" body={modalBody} title="探测器详细信息"/>
            </div>
        );
    }
});

var DetectorList = React.createClass({
    render: function () {
        var idx = 0;
        var showBoxHandler = this.props.showBoxHandler
        var nodes = this.props.data.map(function (detector) {
                idx += 1;
                return (
                    <DetectorItem key={detector.mac} data={detector} idx={idx} showBoxHandler={showBoxHandler}></DetectorItem>
                );
            }
        );
        return (
            <div className="detector_list">
                <ul className="list-group">{nodes}</ul>
            </div>
        );
    }
});

var DetectorItem = React.createClass({
    handleClick: function(event) {
        console.log("click on " + this.props.data.mac)
        this.props.showBoxHandler(this.props.data)
    },
    render: function () {
        var state = this.props.data.status === "01" ? "在线" : "离线";
        var div_class = this.props.data.status === "01" ? "online" : "offline";
        var mac_count = 0;
        if (this.props.data.today_mac_count != null) {
            mac_count = this.props.data.today_mac_count;
        }
        var company = "广晟"
        if(this.props.data.company == "02") {
            company = "百米"
        }
        return (
            <a className="list-group-item" onClick={this.handleClick} href="#" data-toggle="modal" data-target="#device_list_box">
                <span className="badge">{mac_count}</span>
                <div>{this.props.idx}号 {company}</div>
                {/*<div>{this.props.data.mac}</div>*/}
                <div className={div_class}><b>状态：</b>{state}</div>
            </a>
        );
    }
});

var DetectorPage2 = React.createClass({
    componentDidMount: function() {
    },
    showDeviceListBox: function (apData) {

    },
    getInitialState: function() {
        return  {deviceList:{device_list:[]}, current_detector:{mac:"", longitude:0, latitude:0,last_login_time:0}}
    },
    render: function () {
        var modalBody =  <VideoAnalyser />
        var FixData = {detector_list:[{mac:"353419033412758",today_mac_count:0,status:"01",longitude:116.10483,latitude:24.28942,company:"01",last_login_time:1463583123,login_count:0}]}
        return(
            <div className="container-fluid page-content">
                <div className="row">
                    {/*<div className="col-sm-8">
                     <div className="panel panel-primary">
                     <div className="panel-heading">探测器分布</div>
                     <div id="map_detector2" className="map"/>
                     </div>
                     </div>*/}
                    <div className="col-sm-8">
                        <div className="panel panel-primary">
                            <div className="panel-heading">视频关联探针列表</div>
                            <DetectorList2 data={FixData.detector_list}  showBoxHandler={this.showDeviceListBox}/>
                        </div>
                    </div>
                </div>
                <ModalBox boxId="video_box" body={modalBody} title="视频关联分析"/>
            </div>
        );
    }
});

var DetectorList2 = React.createClass({
    render: function () {
        var idx = 0;
        var showBoxHandler = this.props.showBoxHandler
        var nodes = this.props.data.map(function (detector) {
                idx += 1;
                return (
                    <DetectorItem2 key={detector.mac} data={detector} idx={idx} showBoxHandler={showBoxHandler}></DetectorItem2>
                );
            }
        );
        return (
            <div className="detector_list">
                <ul className="list-group">{nodes}</ul>
            </div>
        );
    }
});

var DetectorItem2 = React.createClass({
    handleClick: function(event) {
        console.log("click on " + this.props.data.mac)
        this.props.showBoxHandler(this.props.data)
    },
    render: function () {
        var state = this.props.data.status === "01" ? "在线" : "离线";
        var div_class = this.props.data.status === "01" ? "online" : "offline";
        var mac_count = 0;
        if (this.props.data.today_mac_count != null) {
            mac_count = this.props.data.today_mac_count;
        }
        var company = "广晟"
        if(this.props.data.company == "02") {
            company = "百米"
        }
        return (
            <a className="list-group-item" onClick={this.handleClick}  href="#" data-toggle="modal" data-target="#video_box">
                <span className="badge">{mac_count}</span>
                <div>{this.props.idx}号 {company}</div>
                <div>{this.props.data.mac}</div>
                <div className={div_class}><b>状态：</b>{state}</div>
            </a>
        );
    }
});

var DetectorRow = React.createClass({
    render: function () {
        var date = new Date()
        date.setTime(this.props.last_login_time * 1000)
        var dateString = date.toLocaleString()
        return (
            <tr>
                <td>{this.props.mac}</td>
                <td>{this.props.longitude},{this.props.latitude}</td>
                <td>{dateString}</td>
                <td>在线</td>
                <td>陈工</td>
                <td>18554374756</td>
                <td>{this.props.region}</td>
            </tr>
        );
    }
});

var RegionPage = React.createClass({
    detector:[{mac:"admin",longitude:116.101728,latitude:24.286132, last_login_time:1463591175, region:"梅县区"},
        {mac:"admin",longitude:116.101628,latitude:24.286432, last_login_time:1463592175, region:"梅县区"},
        {mac:"admin",longitude:116.101458,latitude:24.286872, last_login_time:1463594175, region:"梅县区"},
        {mac:"admin",longitude:116.101458,latitude:24.286332, last_login_time:1463581175, region:"梅县区"},
        {mac:"admin",longitude:116.101125,latitude:24.286052, last_login_time:1463596175, region:"梅县区"},
        {mac:"admin",longitude:116.101526,latitude:24.285933, last_login_time:1463598176, region:"梅县区"},
        {mac:"admin",longitude:116.101628,latitude:24.281432, last_login_time:1463592175, region:"梅江区"},
        {mac:"admin",longitude:116.103458,latitude:24.283872, last_login_time:1463598175, region:"梅江区"},
        {mac:"admin",longitude:116.101758,latitude:24.288332, last_login_time:1463581475, region:"梅江区"},
        {mac:"admin",longitude:116.101125,latitude:24.286052, last_login_time:1463596135, region:"梅江区"},
        {mac:"admin",longitude:116.103526,latitude:24.296933, last_login_time:1463599115, region:"梅江区"}
    ],
    getInitialState: function () {
        return {region:"梅县区"}
    },
    handleClick:function (e) {
        console.log("on click", e.targe.value)
        this.setState({region:e.target.value})
    },
    render: function () {
        var region = this.state.region
        var rows = []
        this.detector.forEach(function (detector) {
            rows.push(<DetectorRow mac={Comm.randomCharWithoutTime(15)} longitude={detector.longitude} latitude={detector.latitude} last_login_time={detector.last_login_time}  region={detector.region} />)
        });
        return (
            <div className="container-fluid page-container">
                <div className="row">
                    {/*<div className="dropdown">
                     <button className="btn btn-default dropdown-toggle" type="button" id="dropdownMenu1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
                     {region}
                     <span className="caret"></span>
                     </button>
                     <ul className="dropdown-menu" aria-labelledby="dropdownMenu1">
                     <li><a href="#" value="梅县区" OnClick={this.handleClick}>梅县区</a></li>
                     <li><a href="#" value="梅江区" OnClick={this.handleClick}>梅江区</a></li>
                     <li><a href="#" value="大埔县" OnClick={this.handleClick}>大埔县</a></li>
                     <li><a href="#" value="丰顺县" OnClick={this.handleClick}>丰顺县</a></li>
                     <li><a href="#" value="五华县" OnClick={this.handleClick}>五华县</a></li>
                     <li><a href="#" value="平远县" OnClick={this.handleClick}>平远县</a></li>
                     <li><a href="#" value="蕉岭县" OnClick={this.handleClick}>蕉岭县</a></li>
                     <li><a href="#" value="兴宁县" OnClick={this.handleClick}>兴宁县</a></li>
                     </ul>
                     </div>*/}
                    <table className="table table-striped">
                        <thead>
                        <tr>
                            <th>MAC</th>
                            <th>经纬</th>
                            <th>上线时间</th>
                            <th>状态</th>
                            <th>责任人</th>
                            <th>联系电话</th>
                            <th>区域</th>
                        </tr>
                        </thead>
                        <tbody>{rows}</tbody>
                    </table>
                </div>
            </div>
        );
    }
});

var items=[{text:'概览',link:"/home"},
    {text:'探针管理',link:"/detector"},
    {text:'轨迹查询',link:"/search"},
    // {text:'区域扫描',link:SearchPage},
    {text:'轨迹吻合度分析',link:"/similar"},
    // {text:'电子围栏',link:"/search"},
    // {text:'视频关联分析',link:"detector2"},
    // {text:'车牌号关联分析',link:"/car"},
    {text:'上网行为查询',link:"/behavior"},
    {text:'特征库管理',link:"/feature"},
    {text:'用户管理',link:"/user"}
]

var Page = React.createClass({
    render:function () {
        var username = Comm.getCookie("username")
        console.log("username:" + username)
        if (username == "") {
            return (
                <LoginPage />
            )
        } else {
            return (
                <div>
                    <TopNavbar items={[{text:'首页',link:"#"},{text:'下载手机版',link:"apk/app.apk"}]} username={username}></TopNavbar>
                    <div className="container-fluid page-container">
                        <div className="row">
                            <div className="col-sm-2">
                                <LeftNavbar changePageHandler={this.changePageHandler} items={items} />
                            </div>
                            <div className="col-sm-10">
                                {this.props.children}
                            </div>
                        </div>
                    </div>
                    <ModalBox title="影像" boxId="pictureModal" body={<PictureList pictures={pictures}/>} />
                </div>
            );
        }
    }
});



ReactDOM.render(
    <Router history={hashHistory}>
        <Route path="/" component={Page} >
            <IndexRoute component={Home} />
            <Route path="home" component={Home}  />
            <Route path="detector" component={DetectorPage}  />
            <Route path="search" component={SearchPage}  />
            <Route path="feature" component={FeaturePage}  />
            <Route path="behavior" component={BehaviorPage}  />
            <Route path="user" component={UserPage}  />
            <Route path="similar" component={SimilarPage}  />
            
        </Route>
    </Router>,
    document.getElementById("warpper")
);
