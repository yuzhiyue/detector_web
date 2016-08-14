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
import DetectorPage from './detector_page.jsx'
import DetectorConfPage from './detector_conf.jsx'
import Comm from './comm.jsx'
import {TraceReplayBox} from "./trace_replay.jsx"

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
            <nav className="navbar navbar-fixed-top top-bar">
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
                <LeftNavbarItem changePageHandler={changePageHandler} link={item.link} group={item.group} ></LeftNavbarItem>
            )
        });
        return (
            <nav className="narbar left-bar">
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
        var img = "./res/menu_" + this.props.group + "a.jpg"
        if(this.props.active) {
            img = "./res/menu_" + this.props.group + "b.jpg"
        }
        
        return (
            <li><Link to={this.props.link}><img src={img} /></Link></li>
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
                    <div className="col-sm-4"><Panel title="今日探测MAC次数" body={this.state.commData.discovermac} linkText=""></Panel></div>
                    <div className="col-sm-4"><Panel title="今日探测人数" body={this.state.commData.people} linkText=""></Panel></div>
                    <div className="col-sm-4"><Panel title="探测器数" body={apCount} linkText=""></Panel></div>
                </div>
                <div className="row">
                    <div className="col-sm-6"><MyChart title="今日探测MAC数" chartId="chart1" data={data1}></MyChart></div>
                    <div className="col-sm-6"><MyChart title="在线设备数" chartId="chart2" data={data2}></MyChart></div>
                </div>
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

var infoWindow = new AMap.InfoWindow({offset: new AMap.Pixel(0, -30)});
function markerClick(e) {
    console.log("markerClick", e.target)
    infoWindow.setContent(e.target.content);
    infoWindow.open(e.target.my_map, e.target.getPosition());
}





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

var Page = React.createClass({
    render:function () {
        var username = Comm.getCookie("username")
        console.log("username:" + username)
        if (username == "") {
            return (
                <LoginPage />
            )
        } else {
            var group = Comm.getCookie("group")
            console.log("group:" + group)
            var groupList = group.split("_")
            var pageItems = []
            Comm.PageItems.forEach(function (e) {
                groupList.forEach(function (group) {
                    if (group == e.group) {
                        pageItems.push(e)
                        console.log("pageItem add", group)
                        return;
                    }
                })
            })
            return (
                <div>
                    <TopNavbar items={[{text:'首页',link:"#"},{text:'下载手机版',link:"apk/app.apk"}]} username={username}></TopNavbar>
                    <div className="container-fluid page-container">
                        <div className="row">
                            <div className="col-sm-2">
                                <LeftNavbar changePageHandler={this.changePageHandler} items={pageItems} />
                            </div>
                            <div className="col-sm-10 right-content">
                                {this.props.children}
                            </div>
                        </div>
                    </div>
                    <ModalBox title="影像" boxId="pictureModal" body={<PictureList pictures={pictures}/>} />
                    <TraceReplayBox />
                    <div id="waiting_box" className="query_hint" style={{display:"none"}}>
                        <img src="res/waiting.gif" />正在查询，请稍等．．．
                    </div>
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
            <Route path="detector_conf" component={DetectorConfPage}  />
        </Route>
    </Router>,
    document.getElementById("warpper")
);
