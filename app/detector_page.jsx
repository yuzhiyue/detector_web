import React from 'react';
import Comm from './comm.jsx'

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

var TraceRow = React.createClass({
    render: function() {
        return (
            <tr>
                <td>{this.props.mac}</td>
                <td>{Comm.formatLngLat(this.props.longitude)},{Comm.formatLngLat(this.props.latitude)}</td>
                <td>{this.props.time}</td>
                <td><div><button type="button" disabled="disabled" className="btn btn-primary btn-sm" data-toggle="modal" data-target="#pictureModal">查看影像</button></div></td>
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
        var date = new Date()
        date.setTime(this.props.last_report_time * 1000)
        var lastReportTime = Comm.formatDate(date)
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
            var date = new Date()
            date.setTime(time * 1000)
            var dateString = Comm.formatDate(date)
            if (point.mac == null) {
                point.mac = mac
            }
            rows.push(<TraceRow mac={point.mac} longitude={point.longitude} latitude={point.latitude} time={dateString} />);
        });
        var date = new Date()
        date.setTime(this.props.detector.last_login_time * 1000)
        var dateString = Comm.formatDate(date)
        var scanConf = "默认配置"
        if (this.props.detector.scan_conf != null) {
            scanConf = ""
            this.props.detector.scan_conf.map(function (e) {
                scanConf = scanConf + e.channel + ":" + e.interval + ","
            })
        }
        return (
            <div className="container-fluid page-content">
                <div className="row">
                    <div className="col-sm-12">
                        <div className="panel panel-default">
                            <div className="panel-heading">探测器属性</div>
                            <table className="table table-striped table-hover">
                                <thead><tr><th>设备MAC</th><th>经纬</th><th>扫描配置</th><th>最近登录时间</th><th>周边设备数</th></tr></thead>
                                <tbody><tr>
                                    <td>{this.props.detector.mac}</td>
                                    <td>{Comm.formatLngLat(this.props.detector.longitude)},{Comm.formatLngLat(this.props.detector.latitude)}</td>
                                    <td>{scanConf}</td>
                                    <td>{dateString}</td>
                                    <td>{this.props.distinct_device_num}</td>
                                </tr></tbody>
                            </table>
                            <div><button type="button" className="btn btn-primary btn-sm" data-toggle="modal" data-target="#video_analyser">视频联动分析</button></div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-sm-12">
                        <div className="panel panel-default">
                            <div className="panel-heading">周边设备 最近探测时间：{lastReportTime}</div>
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
            var dateString = Comm.formatDate(date)
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

function markerContent(detector) {
    var date = new Date()
    date.setTime(detector.last_report_time * 1000)
    var lastReportTime = Comm.formatDate(date)
    date.setTime(detector.last_login_time * 1000)
    var lastLoginTime = Comm.formatDate(date)

    var state = detector.status === "01" ? "在线" : "离线";
    var content = "MAC：" + detector.mac + "\n" +
        "位置：" + Comm.formatLngLat(detector.longitude) + ", " + Comm.formatLngLat(detector.latitude) + "\n" +
        "状态：" + state + "\n" +
        "最近登陆时间：" + lastLoginTime

    return content
}

var DetectorPage = React.createClass({
    loadDetectorsFromServer: function() {
        //console.log("loadDetectorsFromServer")
        $.ajax({
            url: Comm.server_addr + "/detector_list?request={}",
            dataType: 'json',
            cache: false,
            success: function(rsp) {
                if (this.isMounted()) {
                    console.log("detector list", rsp)
                    var idx = 1;
                    var lnglatArr = []
                    rsp.detector_list.forEach(function (e) {
                        if(e.longitude == 0 || e.latitude == 0) {
                            return
                        }
                        lnglatArr.push(new AMap.LngLat(e.longitude, e.latitude))
                        AMap.convertFrom(new AMap.LngLat(e.longitude, e.latitude), "gps", function (status, result) {
                            console.log("convert geo", e, status, result)
                        })
                    })
                    AMap.convertFrom(lnglatArr, "gps", function (status, result) {
                        console.log("convert geo", status, result)
                        self.myMap.remove(self.markers)
                        self.markers = []
                        var detector_list = []
                        var today_mac_count = 0
                        if (result.locations != null) {
                            result.locations.forEach(function (pos) {
                                var detector = rsp.detector_list[idx - 1]
                                var contains = this.detectorFilter(pos.getLng(), pos.getLat())
                                console.log("contains", contains)
                                if (contains){
                                    detector_list.push(detector)
                                    today_mac_count = today_mac_count + detector.today_mac_count
                                } else {
                                    idx = idx + 1
                                    return
                                }
                                var text = '<div class="marker-route marker-marker-bus-from">'+ detector.no.toString() +'号</div>'
                                var marker = new AMap.Marker({
                                    map: self.myMap,
                                    position: [pos.getLng(), pos.getLat()],
                                    offset: new AMap.Pixel(-10, -20), //相对于基点的偏移位置
                                    draggable: false,  //是否可拖动
                                    title: markerContent(detector),
                                    content: text
                                });
                                // marker.content = markerContent(detector)
                                // marker.my_map = self.myMap,
                                // marker.on('click', markerClick);
                                // marker.emit('click', {target: marker});
                                self.markers.push(marker)
                                idx = idx + 1
                            }.bind(this))
                        }
                        this.setState({commData:{detector_list:detector_list, today_mac_count:today_mac_count}});
                    }.bind(this))
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

        self.markers = []
        this.initPolygons()
        setInterval(this.loadDetectorsFromServer, 20000);
    },
    showDeviceListBox: function (apData) {
        var url = Comm.server_addr + '/detector_info?request={"mac":"' + apData.mac + '"}'
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
        var area = decodeURI(Comm.getCookie("area"))
        area = decodeURI(area)
        console.log("area cookies", area)
        var areaList = area.split("_")
        var areaItems = []
        var unlimit = false
        Comm.AreaItems.forEach(function (e) {
            areaList.forEach(function (area) {
                console.log(e, area)
                if (area=="不限制") {
                    unlimit = true
                }
                if (area == e) {
                    areaItems.push(area)
                    console.log("area add", area)
                    return;
                }
            })
        })
        if (unlimit) {
            areaItems = Comm.AreaItems
        }
        console.log(areaItems)
        return  {unlimit:unlimit, areaItems:areaItems, polygons:[], deviceList:{device_list:[], last_report_time:0, distinct_device_num:0}, current_detector:{mac:"", scan_conf:[] ,longitude:0, latitude:0,last_login_time:0},commData:{today_mac_count:0, detector_list:[]}}
    },
    onDistrictChange: function (e) {
        var value = e.target.value
        console.log("onDistrictChange", value)
        if (value == "全部") {
            this.initPolygons()
            return
        }
        AMap.service('AMap.DistrictSearch', function() {
            var opts = {
                subdistrict: 1,   //返回下一级行政区
                extensions: 'all',  //返回行政区边界坐标组等具体信息
                level: 'city'  //查询行政级别为 市
            };
            //实例化DistrictSearch
            var district = new AMap.DistrictSearch(opts);
            district.setLevel('district');
            //行政区查询
            district.search(value, function (status, result) {
                if (result.districtList == null) {
                    return;
                }
                var bounds = result.districtList[0].boundaries;
                this.cleanPolygonsFromMap()
                var polygons = []
                if (bounds) {
                    for (var i = 0, l = bounds.length; i < l; i++) {
                        //生成行政区划polygon
                        var polygon = new AMap.Polygon({
                            map: self.myMap,
                            strokeWeight: 1,
                            path: bounds[i],
                            fillOpacity: 0.1,
                            fillColor: '#CCF3FF',
                            strokeColor: '#CC66CC'
                        });
                        polygons.push(polygon);
                    }
                    self.myMap.setCity(value);
                    this.setState({polygons:polygons})
                    //self.myMap.setFitView();//地图自适应
                    this.loadDetectorsFromServer()
                }
            }.bind(this));
        }.bind(this))
    },
    initPolygons: function () {
        this.cleanPolygonsFromMap()
        if (this.state.unlimit) {
            this.setState({polygons:[]})
            self.myMap.setCity("梅州市");
            this.loadDetectorsFromServer()
            return
        }
        AMap.service('AMap.DistrictSearch', function() {
            var opts = {
                subdistrict: 1,   //返回下一级行政区
                extensions: 'all',  //返回行政区边界坐标组等具体信息
                level: 'city'  //查询行政级别为 市
            };
            //实例化DistrictSearch
            var district = new AMap.DistrictSearch(opts);
            district.setLevel('district');
            //行政区查询
            this.state.areaItems.forEach(function (area) {
                if(area=="全部") return
                district.search(area, function (status, result) {
                    var bounds = result.districtList[0].boundaries;
                    if (bounds) {
                        for (var i = 0, l = bounds.length; i < l; i++) {
                            //生成行政区划polygon
                            var polygon = new AMap.Polygon({
                                map: self.myMap,
                                strokeWeight: 1,
                                path: bounds[i],
                                fillOpacity: 0.1,
                                fillColor: '#CCF3FF',
                                strokeColor: '#CC66CC'
                            });
                            var polygons = this.state.polygons
                            polygons.push(polygon);
                            this.setState({polygons:polygons})
                            this.loadDetectorsFromServer()
                        }
                    }
                }.bind(this));
            }.bind(this))
        }.bind(this))
    },
    cleanPolygonsFromMap: function () {
        this.state.polygons.forEach(function (e) {
            self.myMap.remove(e)
        })
    },
    detectorFilter: function (lng, lat) {
        if (this.state.polygons.length == 0) {
            if (this.state.unlimit) {
                return true
            }
        }
        var contains = false;
        this.state.polygons.forEach(function (e) {
            if(e.contains([lng, lat])) {
                contains = true
            }
        })
        return contains
    },
    render: function () {
        var selectItems = []
        this.state.areaItems.forEach(function (e) {
            selectItems.push(<option value={e}>{e}</option>)
        })
        var modalBody =  <DetectorDetailBox trace={this.state.deviceList.device_list} detector={this.state.current_detector} distinct_device_num={this.state.deviceList.distinct_device_num} last_report_time={this.state.deviceList.last_report_time}/>
        return(
            <div className="container-fluid page-content">
                <div className="row">
                    <div className="col-sm-8">
                        辖区：
                        <select id='district' style={{width:"200px"}} onChange={this.onDistrictChange}>
                            <option value="全部">全部</option>
                            {selectItems}
                        </select>
                    </div>
                </div>
                <div className="row" style={{marginTop:"10px"}}>
                    <div className="col-sm-8">
                        <div className="panel panel-primary">
                            <div className="panel-heading">探测器列表</div>
                            <DetectorList data={this.state.commData.detector_list}  showBoxHandler={this.showDeviceListBox}/>
                        </div>
                    </div>
                    <div className="col-sm-4">
                        <div className="panel panel-primary">
                            <div className="panel-heading">探测器分布</div>
                            <div id="map_detector" className="map"/>
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
        var showBoxHandler = this.props.showBoxHandler
        var nodes = this.props.data.map(function (detector) {
                return (
                    <DetectorItem key={detector.no} data={detector} showBoxHandler={showBoxHandler}></DetectorItem>
                );
            }
        );
        return (
            // <div className="detector_list">
            //     <ul className="list-group">{nodes}</ul>
            // </div>
            <table className="table table-striped table-condensed">
                <thead>
                    <tr>
                    <th>编号</th>
                    <th>机构</th>
                    <th>MAC</th>
                    <th>安装地址</th>
                    <th>状态</th>
                    <th>探测设备数</th>
                    </tr>
                </thead>
                <tbody>{nodes}</tbody>
            </table>
        );
    }
});

var DetectorItem = React.createClass({
    handleClick: function(event) {
        console.log("click on " + this.props.data.mac)
        this.props.showBoxHandler(this.props.data)
    },
    getInitialState: function() {
        return {address:""}
    },
    componentDidMount: function() {
        AMap.convertFrom(new AMap.LngLat(this.props.data.longitude, this.props.data.latitude), "gps", function (status, result) {
            console.log("convert detector geo", status, result)
            if(result.locations == null) {
                return
            }
            var gd_pos = result.locations[0]
            AMap.service('AMap.Geocoder',function() {
                var geocoder = new AMap.Geocoder({
                    city: "010"//城市，默认：“全国”
                });
                geocoder.getAddress([gd_pos.getLng(), gd_pos.getLat()], function(status, result) {
                    if (status === 'complete' && result.info === 'OK') {
                        this.setState({address:result.regeocode.formattedAddress})
                    }
                }.bind(this))
            }.bind(this))
        }.bind(this))
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
            // <a className="list-group-item" onClick={this.handleClick} href="#" data-toggle="modal" data-target="#device_list_box">
            //     <span className="badge">{mac_count}</span>
            //     <div>{this.props.data.no}号 {company}  {this.props.data.mac}</div>
            //     <div>{this.state.address}</div>
            //     <div className={div_class}><b>状态：</b>{state}</div>
            // </a>
            <tr onClick={this.handleClick} href="#" data-toggle="modal" data-target="#device_list_box" >
                <td>{this.props.data.no}</td>
                <td>{company}</td>
                <td>{this.props.data.mac}</td>
                <td>{this.state.address}</td>
                <td><div className={div_class}>{state}</div></td>
                <td><span className="badge">{mac_count}</span></td>
            </tr>
        );
    }
});

var DetectorRow = React.createClass({
    render: function () {
        var date = new Date()
        date.setTime(this.props.last_login_time * 1000)
        var dateString = Comm.formatDate(date)
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

module.exports = DetectorPage;