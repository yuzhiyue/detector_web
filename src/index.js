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
        return  {detector_list:[{mac:"111111111"}]};
    },
    componentDidMount: function() {
        console.log("componentDidMount")
        this.loadDetectorsFromServer();
        //setInterval(this.loadDetectorsFromServer, this.props.pollInterval);

    },
    render: function () {
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
                <ol>{nodes}</ol>
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
                <a>{this.props.mac}</a>
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
                    <ol>{nodes}</ol>
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
            <table>
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
                <a onClick={this.handleClick} >查询</a>
            </form>
        );
    }
});

var SearchPage = React.createClass({
    /*traceTable: <TraceTable />,*/
    handleSearch :function (value) {
        console.log("handleSearch:" + value)
        console.log("loadTraceFromServer")
        url = 'http://112.74.90.113:8080/trace?request={"mac":"'+ value +'","query_type":"01","start_time":1}'
        $.ajax({
            url: url,
            dataType: 'json',
            cache: false,
            success: function(rsp) {
                console.log("loadTraceFromServer response", rsp)
                this.setState({rsp:rsp});
            }.bind(this),
            error: function(xhr, status, err) {
                console.error(url, status, err.toString());
            }.bind(this)
        });
    },
    getInitialState: function() {
        console.log("getInitialState")
        return  {rsp:{trace:[]}};
    },
    render: function () {
        return(
            <div className="right_inner">
                <SearchBar handleSearch={this.handleSearch}></SearchBar>
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
            <div>
                <ul>{menu}</ul>
            </div>
        );
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
    <div>
        <SearchPage></SearchPage>
    </div>,
    document.getElementById('search_trace')
);

React.render(
    <div>
        <SearchPage></SearchPage>
    </div>,
    document.getElementById('similar_trace')
);

showDetectorPage = function () {
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
}

React.render(
    <Menu items={[
    {text:'探针信息',link:showDetectorPage},
    {text:'轨迹查询',link:showSearchPage},
    {text:'相似轨迹',link:showSimilarPage}
  ]}>
    </Menu>,
    document.getElementById('menu')
);