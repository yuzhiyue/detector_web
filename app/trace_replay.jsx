import React from 'react';
import Comm from './comm.jsx'

var marker;
var map

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
    map.setZoomAndCenter(14, lineArr[lineArr.length - 1]);
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