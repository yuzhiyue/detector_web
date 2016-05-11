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
        this.props.link()
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
                <nav className="navbar navbar-default navbar-fixed-top top-bar">
                    <div className="container">
                        <ul className="nav navbar-nav">{menu}</ul>
                        <ul className="nav navbar-nav navbar-right">
                            <li>当前用户：{this.props.username}</li>
                            <li><a className="btn btn-default" href="." onClick={this.handleClick}>注销</a></li>
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

var Home = React.createClass({
    render: function () {
        apCount = this.props.commData.detector_list.length
        today_mac_count = this.props.commData.today_mac_count
        return (
            <div className="container-fluid page-content">
                <div className="row">
                    <div className="col-sm-3"><Panel title="今日探测MAC数" body={today_mac_count} linkText="查看列表"></Panel></div>
                    <div className="col-sm-3"><Panel title="探测MAC总数" body={today_mac_count} linkText="查看列表"></Panel></div>
                    <div className="col-sm-3"><Panel title="探测器数" body={apCount} linkText="查看列表"></Panel></div>
                    <div className="col-sm-3"><Panel title="今日探测MAC数" body=""></Panel></div>
                </div>
            </div>
        );
    }
});

var TraceRow = React.createClass({
    render: function() {
        return (
            <tr>
                <td>{this.props.longitude},{this.props.latitude}</td>
                <td>{this.props.time}</td>
            </tr>
        );
    }
});

var TraceTable = React.createClass({
    render: function() {
        var rows = [];
        this.props.trace.forEach(function(point) {
            date = new Date()
            date.setTime(point.enter_time * 1000)
            dateString = date.toLocaleString()
            rows.push(<TraceRow longitude={point.longitude} latitude={point.latitude} time={dateString} />);
        });
        return (
            <table className="table table-striped table-hover">
                <thead>
                <tr>
                    <th>经纬</th>
                    <th>时间</th>
                </tr>
                </thead>
                <tbody>{rows}</tbody>
            </table>
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
        return  {input:"5c514f733633"};
    },
    render: function() {
        return (
            <form>
                <input type="text" placeholder="5c514f733633" onChange={this.handleChange}/>
                <input type="button" class="button" value="查询" onClick={this.handleClick} ></input>
            </form>
        );
    }
});
var marker;
var lineArr=[];

// 地图图块加载完毕后执行函数
function drawPath(){
    console.log("drawPath", lineArr)
    if (lineArr.length == 0)
    {
        return;
    }
    marker = new AMap.Marker({
        map: map,
        position: lineArr[0],
        icon: "http://webapi.amap.com/images/car.png",
        offset: new AMap.Pixel(-26, -13),
        autoRotation: true
    });

    // 绘制轨迹
    var polyline = new AMap.Polyline({
        map: map,
        path: lineArr,
        strokeColor: "#00A",  //线颜色
        strokeOpacity: 1,     //线透明度
        strokeWeight: 3,      //线宽
        strokeStyle: "solid"  //线样式
    });
    map.setFitView();
    map.setZoomAndCenter(14, lineArr[0]);
}

var SearchPage = React.createClass({
    /*traceTable: <TraceTable />,*/
    handleSearch: function (value) {
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
                drawPath()
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
        var map = new AMap.Map('map_search', {
            resizeEnable: true,
            zoom:14,
            center: [116.109095,24.296806]

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
                    <SearchBar handleSearch={this.handleSearch}></SearchBar>
                    <div class="button-group">
                        <input type="button" class="button" value="开始动画" id={start_id}/>
                        <input type="button" class="button" value="停止动画" id={stop_id}/>
                    </div>
                </div>
                <div className="row">
                    <div className="col-sm-8">
                        <div id="map_search" className="map" />
                    </div>
                    <div className="col-sm-4">
                        <TraceTable trace={this.state.rsp.trace}></TraceTable>
                    </div>
                </div>
            </div>
        );
    }
});

var DetectorPage = React.createClass({
    componentDidMount: function() {
        var map = new AMap.Map('map_detector', {
            resizeEnable: true,
            zoom:14,
            center: [116.109095,24.296806]

        });
        var idx = 1;
        this.props.commData.detector_list.forEach(function (e) {
            var text = '<div class="marker-route marker-marker-bus-from"><b>探:'+ idx.toString() +'号</b></div>'
            new AMap.Marker({
                map: map,
                position: [e.longitude, e.latitude],
                offset: new AMap.Pixel(-17, -42), //相对于基点的偏移位置
                draggable: false,  //是否可拖动
                content: text
            });
            idx = idx + 1
        })
    },
    render: function () {
        return(
            <div className="container-fluid page-content">
                <div className="row">
                    <div className="col-sm-7">
                        <div id="map_detector" className="map"/>
                    </div>
                    <div className="col-sm-2">
                                <h5>今日探测MAC总量：{this.props.commData.today_mac_count}</h5>
                                <DetectorList data={this.props.commData.detector_list} />
                    </div>
                    <div className="col-sm-3" id="detector_detail"></div>
                </div>
            </div>
        );
    }
});

var DetectorList = React.createClass({
    render: function () {
        var idx = 0;
        var nodes = this.props.data.map(function (detector) {
                idx += 1;
                return (
                    <DetectorItem data={detector} idx={idx}></DetectorItem>
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
        var detector = <DetectorInfo mac={this.props.data.mac} pollInterval={5000} />
        React.render(
            detector,
            document.getElementById('detector_detail')
        );
    },
    render: function () {
        state = this.props.data.status === "01" ? "在线" : "离线";
        div_class = this.props.data.status === "01" ? "online" : "offline";
        mac_count = 0;
        if (this.props.data.today_mac_count != null) {
            mac_count = this.props.data.today_mac_count;
        }
        return (
            <a className="list-group-item" onClick={this.handleClick}>
                <span className="badge">{mac_count}</span>
                <div><b>{this.props.idx}.</b> {this.props.data.mac}</div>
                <div className={div_class}><b>状态：</b>{state}</div>
            </a>
        );
    }
});

var DeviceItem = React.createClass({
    render: function () {
        date = new Date()
        date.setTime(this.props.data.time * 1000)
        dateString = date.toLocaleString()
        return (
            <li className="list-group-item">
                <div><b>设备MAC：</b> {this.props.data.mac}</div>
                <div><b>经纬度：</b> {this.props.data.longitude}, {this.props.data.latitude}</div>
                <div><b>时间：</b> {dateString}</div>
            </li>
        )
    }
})

var DetectorInfo = React.createClass({
    loadDetectorInfoFromServer: function() {
        console.log("loadDetectorInfoFromServer")
        url = 'http://112.74.90.113:8080/detector_info?request={"mac":"' + this.props.mac + '","start_time":1}'
        $.ajax({
            url: url,
            dataType: 'json',
            cache: false,
            success: function(rsp) {
                console.log("loadDetectorInfoFromServer response", rsp)
                this.setState(rsp);
            }.bind(this),
            error: function(xhr, status, err) {
                console.error(url, status, err.toString());
            }.bind(this)
        });
    },
    getInitialState: function() {
        console.log("getInitialState")
        return  {"device_list":[]}
    },
    componentDidMount: function() {
        console.log("DetectorInfo componentDidMount")
        this.loadDetectorInfoFromServer();

    },
    componentDidUpdate : function( prevProps,  prevState) {
        if (prevProps.mac !== this.props.mac) {
            this.loadDetectorInfoFromServer()
        }
        return true;
    },
    render: function () {
        var nodes = this.state.device_list.map(function (device) {
                return (
                    <DeviceItem data={device}>
                    </DeviceItem>
                );
            }
        );

        return (
            <div>
                <h5>探针{this.props.mac}详情：</h5>
                <div>
                    <h6>周边设备</h6>
                    <ul className="list-group">{nodes}</ul>
                </div>
            </div>
        )
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
        console.log("change page", dst)
        this.setState({page:dst})
    },
    getInitialState: function() {
        return  {page:Home,commData:{today_mac_count:0 ,detector_list:[{mac:""}]}};
    },
    render:function () {
        let Child = this.state.page
        username = getCookie("username")
        console.log("username:" + username)
        if (username == "") {
            return (
                <LoginPage />
            )
        } else {
            return (
                <div>
                    <TopNavbar items={[{text:'概览',link:Home},{text:'轨迹查询',link:SearchPage},{text:'相似轨迹',link:""}]} username={username}></TopNavbar>
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
                </div>
            );
        }
    }
});

React.render(
    <Page></Page>,
    document.getElementById("warpper")
);