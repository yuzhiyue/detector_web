/**
 * Created by Cosine on 2016/5/3.
 */

/*showDetectorPage = function () {
    style="display: none;"
    document.getElementById("detector").style.display="";
    document.getElementById("search_trace").style.display="none";
    document.getElementById("similar_trace").style.display="none";
}

showSearchPage = function () {
    style="display: none;"
    document.getElementById("search_trace").style.display="";
    document.getElementById("detector").style.display="none";
    document.getElementById("similar_trace").style.display="none";
}

showSimilarPage = function () {
    style="display: none;"
    document.getElementById("search_trace").style.display="none";
    document.getElementById("detector").style.display="none";
    document.getElementById("similar_trace").style.display="";
}*/

var DetectorBox = React.createClass({
    loadDetectorsFromServer: function() {
        //console.log("loadDetectorsFromServer")
        $.ajax({
            url: this.props.url,
            dataType: 'json',
            cache: false,
            success: function(rsp) {
                //console.log("loadDetectorsFromServer response", rsp)
                var idx = 1;
                rsp.detector_list.forEach(function (e) {
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
                this.setState(rsp);
            }.bind(this),
            error: function(xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },
    getInitialState: function() {
        console.log("getInitialState")
        return  {today_mac_count:0 ,detector_list:[{mac:"111111111"}]};
    },
    componentDidMount: function() {
        console.log("componentDidMount")
        this.loadDetectorsFromServer();
        //setInterval(this.loadDetectorsFromServer, this.props.pollInterval);

    },
    render: function () {
        return(
            <div className="container-fluid">
                <div className="col-sm-6">
                    <h5>今日探测MAC总量：{this.state.today_mac_count}</h5>
                    <DetectorList data={this.state.detector_list} />
                </div>
                <div className="col-sm-6" id="detector_detail"></div>
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
            <div className="right_inner">
                <SearchBar handleSearch={this.handleSearch}></SearchBar>
                <div class="button-group">
                    <input type="button" class="button" value="开始动画" id={start_id}/>
                    <input type="button" class="button" value="停止动画" id={stop_id}/>
                </div>
                <TraceTable trace={this.state.rsp.trace}></TraceTable>
            </div>

        );
    }
});

var MenuItem = React.createClass({
    handleClick:function () {
        this.props.link()
    },
    render: function () {
        return (
            <li className="menu_item" onClick={this.handleClick}><a>{this.props.children}</a></li>
        );
    }
});

var Menu = React.createClass({
    render: function(){
        var menu = this.props.items.map(function(item){
            return (
                <MenuItem link={item.link}>{item.text}</MenuItem>
            )
        });
        return (
            <nav className="navbar navbar-inverse navbar-fixed-top">
                <div className="container">
                    <ul className="nav navbar-nav">{menu}</ul>
                </div>
            </nav>
        );
    }
});

var LeftNavbar = React.createClass({
    render: function () {
        var items = this.props.items.map(function(item){
            return (
                <LeftNavbarItem link={item.link}>{item.text}</LeftNavbarItem>
            )
        });
        return (
            <nav className="narbar navbar-inverse navbar-left">
                <ul className="nav navbar-nav"> {items} </ul>
            </nav>
        )
    }
});

var LeftNavbarItem = React.createClass({
    handleClick:function () {
        this.props.link()
    },
    render: function () {
        return (
            <li className="menu_item" onClick={this.handleClick}><a>{this.props.children}</a></li>
        );
    }
});

var Page = React.createClass({
    render:function () {
        return (
            <div>
                <Menu items={[{text:'探针信息',link:""},{text:'轨迹查询',link:""},{text:'相似轨迹',link:""}]} ></Menu>
                /*<div className="container-fluid">
                    <div class="row content">
                        <div class="col-sm-3">
                            <LeftNavbar
                                items={[{text:'探针信息',link:""},{text:'轨迹查询',link:""},{text:'相似轨迹',link:""}]}></LeftNavbar>
                        </div>
                        <div class="col-sm-9">
                            <div id="detector" class="right_div"></div>
                            <div id="search_trace" class="right_div" style="display: none;"></div>
                            <div id="similar_trace" class="right_div" style="display: none;"></div>
                        </div>
                    </div>
                </div>*/
            </div>
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

React.render(
    <Page></Page>,
    document.getElementById("warpper")
);

// React.render(
//     <DetectorBox url="http://112.74.90.113:8080/detector_list?request={}" pollInterval={5000} />,
//     document.getElementById('detector')
// );
// React.render(
//     <div>
//         <SearchPage No="1"></SearchPage>
//     </div>,
//     document.getElementById('search_trace')
// );
//
// React.render(
//     <div>
//         <SearchPage No="2"></SearchPage>
//     </div>,
//     document.getElementById('similar_trace')
// );


