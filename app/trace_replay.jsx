import React from 'react';
import Comm from './comm.jsx'

var marker;
var map;

// 地图图块加载完毕后执行函数
function drawPath(lineArr){
    map = new AMap.Map('map_replay', {
        resizeEnable: true,
        zoom:14,
        center: [116.109095,24.296806]

    });
    map.plugin(["AMap.ToolBar"], function() {
        map.addControl(new AMap.ToolBar());
    });
    console.log("drawPath", lineArr)
    if (lineArr.length == 0) {
        return;
    }
    // marker = new AMap.Marker({
    //     map: map,
    //     position: lineArr[0],
    //     icon: "http://webapi.amap.com/images/car.png",
    //     offset: new AMap.Pixel(-26, -13),
    //     autoRotation: true
    // });
    var line = []
    var idx = 1;
    lineArr.forEach(function (pos) {
        var title = "序号：" + idx + "\n位置：" + pos.gws84[0] + "," + pos.gws84[1] + "\n时间："  + Comm.formatDate(new Date(pos.time * 1000)) + "\n停留：" +  pos.duration + "秒";
        var iconUrl = "http://webapi.amap.com/theme/v1.3/markers/n/mid.png"
        var zIndex = 1
        if (idx == 1) {
            iconUrl = "http://webapi.amap.com/theme/v1.3/markers/n/start.png"
            zIndex = 10
        } else if (idx == lineArr.length) {
            iconUrl = "http://webapi.amap.com/theme/v1.3/markers/n/end.png"
            zIndex = 10
        }
        else if (pos.org_code == null || pos.org_code == "0") {
            iconUrl = "http://webapi.amap.com/theme/v1.3/markers/n/mid.png"
            zIndex = 9
        }
        var marker = new AMap.Marker({
            map: map,
            title: title,
            position: pos.gd_pos,
            offset: new AMap.Pixel(-9, -31), //相对于基点的偏移位置
            draggable: false,  //是否可拖动
            icon: iconUrl,
            zIndex: zIndex
        });
        line.push(pos.gd_pos)
        idx = idx + 1
    })

    // 绘制轨迹
    var polyline = new AMap.Polyline({
        map: map,
        path: line,
        strokeColor: "#3366FF", //线颜色
        strokeOpacity: 1,       //线透明度
        strokeWeight: 5,        //线宽
        strokeStyle: "solid",   //线样式
        strokeDasharray: [10, 5] //补充线样式
    });
    //map.setZoomAndCenter(14, lineArr[lineArr.length - 1]);
    //map.setFitView();

}

var TraceReplayBox = React.createClass({
    componentDidMount: function() {
    },
    render:function () {
        return(
        <div className="modal fade" id="map_replay_box">
            <div className="modal-dialog modal-lg">
                <div className="modal-content">
                    <div className="modal-header">
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                        <h4 className="modal-title">轨迹绘制</h4>
                    </div>
                    <div className="modal-body">
                        <div id="map_replay" className="map"/>
                    </div>
                    <div className="modal-footer">
                    </div>
                </div>
            </div>
        </div>
        )
    }
})

module.exports.drawPath = drawPath;
module.exports.TraceReplayBox = TraceReplayBox;