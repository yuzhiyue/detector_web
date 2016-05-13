/**
 * Created by Cosine on 2016/5/7.
 */

function addCookie(name,value,expiresHours){
    var cookieString=name+"="+escape(value);
//判断是否设置过期时间
    if(expiresHours>0){
        var date=new Date();
        date.setTime(date.getTime+expiresHours*3600*1000);
        cookieString=cookieString+"; expires="+date.toGMTString();
    }
    document.cookie=cookieString;
}

function getCookie(name){
    var strCookie=document.cookie;
    var arrCookie=strCookie.split("; ");
    for(var i=0;i<arrCookie.length;i++){
        var arr=arrCookie[i].split("=");
        if(arr[0]==name)return arr[1];
    }
    return "";
}

function deleteCookie(name){
    var date=new Date();
    date.setTime(date.getTime()-10000);
    document.cookie=name+"=v; expires="+date.toGMTString();
}

var TopNavbarItem = React.createClass({
    handleClick:function () {
    },
    render: function () {
        return (
            <li onClick={this.handleClick}><a>{this.props.children}</a></li>
        );
    }
});

var TopNavbar = React.createClass({
    handleClick:function () {
        deleteCookie("username")
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
        changePageHandler = this.props.changePageHandler
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
            <li onClick={this.handleClick}><a>{this.props.children}</a></li>
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
    render: function () {
        apCount = this.props.commData.detector_list.length
        today_mac_count = this.props.commData.people
        total_mac_count = this.props.commData.discovermac
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
                    label : "在线探针数量",
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
                    <div className="col-sm-4"><Panel title="今日探测MAC次数" body={today_mac_count} linkText="查看列表"></Panel></div>
                    <div className="col-sm-4"><Panel title="今日探测人数" body={total_mac_count} linkText="查看列表"></Panel></div>
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

var TraceTable = React.createClass({
    render: function() {
        var rows = [];
        var mac = this.props.mac
        if (mac == null) {
            mac = ""
        }
        this.props.trace.forEach(function(point) {
            var time = point.enter_time
            if (time == null) {
                time = point.time
            }
            date = new Date()
            date.setTime(time * 1000)
            dateString = date.toLocaleString()
            if (point.mac == null) {
                point.mac = mac
            }
            rows.push(<TraceRow mac={point.mac} longitude={point.longitude} latitude={point.latitude} time={dateString} />);
        });
        return (
            <div data-spy="scroll" >
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
        );
    }
});

var ModalBox = React.createClass({
    render: function() {
        var bodyCompont = this.props.body
        return (
            <div className="modal fade" id={this.props.boxId}>
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                            <h4 className="modal-title">{this.props.title}</h4>
                        </div>
                        <div className="modal-body">
                            {bodyCompont}
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-default" data-dismiss="modal">Close</button>
                            <button type="button" className="btn btn-primary">Save changes</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
});

var SearchBar = React.createClass({
    handleChange: function (e) {
        console.log("handleChange:"+e.target.value)
        this.setState({input:e.target.value});
    },
    handleClick:function () {
        this.props.handleSearch(this.state.input)
    },
    getInitialState: function() {
        console.log("getInitialState")
        return  {input:"246968653c74"};
    },
    render: function() {
        return (
            <div>
                <div className="input-group">
                    <input type="text" className="form-control" placeholder="246968653c74"  onChange={this.handleChange} />
                    <span className="input-group-btn">
                        <button className="btn btn-default" type="button" onClick={this.handleClick} >查询</button>
                    </span>
                </div>
                <div className="button-group" role="group">
                    <input type="button" className="button" value="开始动画" id={this.props.startId}/>
                    <input type="button" className="button" value="停止动画" id={this.props.stopId}/>
                </div>
            </div>
        );
    }
});
var marker;
var lineArr=[];

// 地图图块加载完毕后执行函数
function drawPath(myMap){
    console.log("drawPath", lineArr)
    if (lineArr.length == 0)
    {
        return;
    }
    marker = new AMap.Marker({
        map: myMap,
        position: lineArr[0],
        icon: "http://webapi.amap.com/images/car.png",
        offset: new AMap.Pixel(-26, -13),
        autoRotation: true
    });

    // 绘制轨迹
    var polyline = new AMap.Polyline({
        map: myMap,
        path: lineArr,
        strokeColor: "#00A",  //线颜色
        strokeOpacity: 1,     //线透明度
        strokeWeight: 3,      //线宽
        strokeStyle: "solid"  //线样式
    });
    myMap.setFitView();
    myMap.setZoomAndCenter(14, lineArr[0]);
}

var SearchPage = React.createClass({
    /*traceTable: <TraceTable />,*/
    handleSearch: function (value) {
        this.search_value = value
        console.log("handleSearch:" + value)
        console.log("loadTraceFromServer")
        url = 'http://112.74.90.113:8080/trace?request={"mac":"' + value + '","query_type":"01","start_time":1}'
        $.ajax({
            url: url,
            dataType: 'json',
            cache: false,
            success: function (rsp) {
                console.log("loadTraceFromServer response", rsp)
                lineArr = []
                rsp.trace.forEach(function (e) {
                    lineArr.push([e.longitude, e.latitude])
                })
                drawPath(this.myMap)
                this.setState({rsp: rsp});
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(url, status, err.toString());
            }.bind(this)
        });
    },
    getInitialState: function () {
        console.log("getInitialState")
        return {rsp: {trace: []}};
    },
    componentDidMount: function () {
        var myMap = new AMap.Map('map_search', {
            resizeEnable: true,
            zoom:14,
            center: [116.109095,24.296806]

        });
        this.myMap = myMap
        myMap.plugin(["AMap.ToolBar"], function() {
            myMap.addControl(new AMap.ToolBar());
        });
        start_id = "start"+this.props.No;
        stop_id = "stop"+this.props.No
        AMap.event.addDomListener(document.getElementById(start_id), 'click', function () {
            console.log("start draw", lineArr)
            marker.moveAlong(lineArr, 1000);
        }, false);
        AMap.event.addDomListener(document.getElementById(stop_id), 'click', function () {
            marker.stopMove();
        }, false);
    },
    render: function () {
        start_id = "start"+this.props.No;
        stop_id = "stop"+this.props.No
        return(
            <div className="container-fluid page-content">
                <div className="row">
                    <SearchBar handleSearch={this.handleSearch} startId={start_id} stopId={stop_id}></SearchBar>
                </div>
                <div className="row">
                    <div className="col-sm-8">
                        <div className="panel panel-primary">
                            <div className="panel-heading">轨迹分布</div>
                            <div id="map_search" className="map" />
                        </div>
                    </div>
                    <div className="col-sm-4">
                        <div className="panel panel-primary">
                            <div className="panel-heading">轨迹查询结果</div>
                            <TraceTable mac={this.search_value} trace={this.state.rsp.trace}></TraceTable>
                        </div>

                    </div>
                </div>
            </div>
        );
    }
});

var PictureList = React.createClass({
    render: function () {
        return (
            <div className="modal fade" id="pictureModal">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                            <h4 className="modal-title">影像</h4>
                        </div>
                        <div className="modal-body">
                            <div id="myCarousel" className="carousel slide">

                                <ol className="carousel-indicators">
                                    <li data-target="#myCarousel" data-slide-to="0"></li>
                                    <li data-target="#myCarousel" data-slide-to="1"></li>
                                    <li data-target="#myCarousel" data-slide-to="2"></li>
                                    <li data-target="#myCarousel" data-slide-to="3"></li>
                                    <li data-target="#myCarousel" data-slide-to="4"></li>
                                    <li data-target="#myCarousel" data-slide-to="5"></li>
                                    <li data-target="#myCarousel" data-slide-to="6"></li>
                                    <li data-target="#myCarousel" data-slide-to="7"></li>
                                    <li data-target="#myCarousel" data-slide-to="8"></li>
                                    <li data-target="#myCarousel" data-slide-to="9"></li>
                                </ol>

                                <div className="carousel-inner">
                                    <div className="item active"><img src="./video/1.jpg"/></div>
                                    <div className="item"><img src="./video/1.jpg"/></div>
                                    <div className="item"><img src="./video/2.jpg"/></div>
                                    <div className="item"><img src="./video/3.jpg"/></div>
                                    <div className="item"><img src="./video/4.jpg"/></div>
                                    <div className="item"><img src="./video/5.jpg"/></div>
                                    <div className="item"><img src="./video/6.jpg"/></div>
                                    <div className="item"><img src="./video/7.jpg"/></div>
                                    <div className="item"><img src="./video/8.jpg"/></div>
                                    <div className="item"><img src="./video/9.jpg"/></div>
                                </div>

                                <a className="carousel-control left" href="#myCarousel"
                                   data-slide="prev">&lsaquo;</a>
                                <a className="carousel-control right" href="#myCarousel"
                                   data-slide="next">&rsaquo;</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
});

var DetectorPage = React.createClass({
    componentDidMount: function() {
        var myMap = new AMap.Map('map_detector', {
            resizeEnable: true,
            zoom:14,
            center: [116.109095,24.296806]

        });
        myMap.plugin(["AMap.ToolBar"], function() {
            myMap.addControl(new AMap.ToolBar());
        });

        var idx = 1;
        this.props.commData.detector_list.forEach(function (e) {
            var text = '<div class="marker-route marker-marker-bus-from"><b>探:'+ idx.toString() +'号</b></div>'
            new AMap.Marker({
                map: myMap,
                position: [e.longitude, e.latitude],
                offset: new AMap.Pixel(-17, -42), //相对于基点的偏移位置
                draggable: false,  //是否可拖动
                content: text
            });
            idx = idx + 1
        })
    },
    showDeviceListBox: function (apMac) {
        url = 'http://112.74.90.113:8080/detector_info?request={"mac":"' + apMac + '","start_time":1}'
        $.ajax({
            url: url,
            dataType: 'json',
            cache: false,
            success: function(rsp) {
                console.log("loadDetectorInfoFromServer response", rsp)
                this.setState({deviceList: rsp});
            }.bind(this),
            error: function(xhr, status, err) {
                console.error(url, status, err.toString());
            }.bind(this)
        });
    },
    getInitialState: function() {
        return  {deviceList:{"device_list":[]}}
    },
    render: function () {
        var modalBody = <TraceTable trace={this.state.deviceList.device_list}/>
        var thirdNum = this.props.commData.third_part_detector_list.length
        return(
            <div className="container-fluid page-content">
                <div className="row">
                    <div className="col-sm-8">
                        <div className="panel panel-primary">
                            <div className="panel-heading">探针分布</div>
                            <div id="map_detector" className="map"/>
                        </div>
                    </div>
                    <div className="col-sm-4">
                        <div className="panel panel-primary">
                            <div className="panel-heading">今日探测MAC总量：{this.props.commData.discovermac}</div>
                            <DetectorList data={this.props.commData.detector_list}  showBoxHandler={this.showDeviceListBox}/>
                        </div>
                        <div className="panel panel-primary">
                            <div className="panel-heading">第三方探测器数量：{thirdNum}</div>
                            <DetectorList data={this.props.commData.third_part_detector_list}  showBoxHandler={this.showDeviceListBox}/>
                        </div>
                    </div>
                </div>
                <ModalBox boxId="device_list_box" body={modalBody} title="探测到的设备"/>
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
        this.props.showBoxHandler(this.props.data.mac)
    },
    render: function () {
        state = this.props.data.status === "01" ? "在线" : "离线";
        div_class = this.props.data.status === "01" ? "online" : "offline";
        mac_count = 0;
        if (this.props.data.today_mac_count != null) {
            mac_count = this.props.data.today_mac_count;
        }
        company = "广晟"
        if(this.props.data.company == "02") {
            company = "百米"
        }
        return (
            <a className="list-group-item" onClick={this.handleClick} data-toggle="modal" data-target="#device_list_box">
                <span className="badge">{mac_count}</span>
                <div>{this.props.idx}号 {company}</div>
                <div>{this.props.data.mac}</div>
                <div className={div_class}><b>状态：</b>{state}</div>
            </a>
        );
    }
});

var LoginPage = React.createClass({
    handleChange:function (e) {
        this.username = e.target.value
    },
    handleClick: function () {
        console.log("input:" + this.username)
        addCookie("username", this.username)
    },
    render:function () {
        return(
            <div className="container" style={{width:"400px"}}>
                <form className="form-signin" role="form">
                    <h2 className="form-signin-heading">请登陆</h2>
                    <input type="text" className="form-control" placeholder="用户名" onChange={this.handleChange} required autofocus></input>
                    <input type="password" className="form-control" placeholder="密码" required></input>
                    <label className="checkbox">
                        <input type="checkbox" value="remember-me"> Remember me</input>
                    </label>
                    <button className="btn btn-lg btn-primary btn-block" type="submit" onClick={this.handleClick}>登陆</button>
                </form>
            </div>
        );
    }
});

var Page = React.createClass({
    loadDetectorsFromServer: function() {
        //console.log("loadDetectorsFromServer")
        $.ajax({
            url: "http://112.74.90.113:8080/detector_list?request={}",
            dataType: 'json',
            cache: false,
            success: function(rsp) {
                rsp.detector_list.sort(function (a, b) {
                    return a.mac > b.mac
                })
                this.setState({commData:rsp});
            }.bind(this),
            error: function(xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },
    componentDidMount: function() {
        console.log("componentDidMount")
        this.loadDetectorsFromServer();
        setInterval(this.loadDetectorsFromServer, 5000);
    },
    changePageHandler : function (dst) {
        this.setState({page:dst})
    },
    getInitialState: function() {
        return  {page:Home,commData:{today_mac_count:0 ,detector_list:[{mac:""}]}};
    },
    render:function () {
        Child = this.state.page
        username = getCookie("username")
        console.log("username:" + username)
        if (username == "") {
            return (
                <LoginPage />
            )
        } else {
            return (
                <div>
                    <TopNavbar items={[{text:'首页',link:""}]} username={username}></TopNavbar>
                    <div className="container-fluid page-container">
                        <div className="row">
                            <div className="col-sm-2">
                                <LeftNavbar changePageHandler={this.changePageHandler} items={[{text:'概览',link:Home},{text:'探测器信息',link:DetectorPage},{text:'轨迹查询',link:SearchPage}, {text:'相似轨迹',link:SearchPage}]} />
                            </div>
                            <div className="col-sm-10">
                                <Child commData={this.state.commData}/>
                            </div>
                        </div>
                    </div>
                    <PictureList />
                </div>
            );
        }
    }
});

React.render(
    <Page></Page>,
    document.getElementById("warpper")
);