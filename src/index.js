/**
 * Created by Cosine on 2016/5/3.
 */


var DetectorBox = React.createClass({
    loadDetectorsFromServer: function() {
        //console.log("loadDetectorsFromServer")
        $.ajax({
            url: this.props.url,
            dataType: 'json',
            cache: false,
            success: function(rsp) {
                //console.log("loadDetectorsFromServer response", rsp)
                rsp.detector_list.forEach(function (e) {
                    new AMap.Marker({
                        map: map,
                        position: [e.longitude, e.latitude],
                        icon: new AMap.Icon({
                            size: new AMap.Size(40, 50),  //图标大小
                            image: "http://webapi.amap.com/theme/v1.3/images/newpc/way_btn2.png",
                            imageOffset: new AMap.Pixel(0, -60)
                        })
                    });
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
        return  {detector_list:[{mac:"111111111"}]};
    },
    componentDidMount: function() {
        console.log("componentDidMount")
        this.loadDetectorsFromServer();
        setInterval(this.loadDetectorsFromServer, this.props.pollInterval);

    },
    render: function () {
        console.log("render")
        return(
            <div className="detector_box">
                <h1>探针列表</h1>
                <DetectorList data={this.state.detector_list} />
            </div>
        );
    }
});

var DetectorList = React.createClass({
    render: function () {
        var nodes = this.props.data.map(function (detector) {
                return (
                    <DetectorItem mac={detector.mac}></DetectorItem>
                );
            }
        );
        return (
            <div className="detector_list">
                <lo>{nodes}</lo>
            </div>
        );
    }
});

var DetectorItem = React.createClass({
    handleClick: function(event) {
        console.log("click on " + this.props.mac)
        var detector = <DetectorInfo mac={this.props.mac} pollInterval={5000} />
        React.render(
            detector,
            document.getElementById('detector_detail')
        );
    },
    render: function () {
        return (
            <li className="detector_item" onClick={this.handleClick}>
                <a><h3>{this.props.mac}</h3></a>
            </li>
        );
    }
});

var DeviceItem = React.createClass({
    render: function () {
        return (
            <li>
                <div><b>设备MAC：</b> {this.props.data.mac}</div>
                <div><b>经纬度：</b> {this.props.data.longitude}, {this.props.data.latitude}</div>
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
        //setInterval(this.loadDetectorInfoFromServer, this.props.pollInterval);

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
                <h3>探针{this.props.mac}详情：</h3>
                <div>
                    <h3>周边设备</h3>
                    <lo>{nodes}</lo>
                </div>
            </div>
        )
    }
})

var MenuItem = React.createClass({
    render: function () {
        return (
            <li className="menu_item"><a href={this.props.link}>{this.props.children}</a></li>
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
            <div>
                <ul>{menu}</ul>
            </div>
        )
    }
});


React.render(
    <div>
        <DetectorBox url="http://112.74.90.113:8080/detector_list?request={}" pollInterval={5000} />
        <div id="detector_detail"></div>
    </div>,
    document.getElementById('detector')
);

React.render(
    <Menu items={[
    {text:'探针信息',link:'/'},
    {text:'轨迹查询',link:'/blogs'},
    {text:'设备信息查询',link:'artive'}
  ]}>
    </Menu>,
    document.getElementById('menu')
);