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
        var text = '<span class="glyphicon glyphicon-map-marker" aria-hidden="true"></span>'
        if (pos.org_code == null || pos.org_code == "0") {
            text = '<span class="glyphicon glyphicon-star" aria-hidden="true"></span>'
        }
        var marker = new AMap.Marker({
            map: map,
            title: title,
            position: pos.gd_pos,
            offset: new AMap.Pixel(-7, -14), //相对于基点的偏移位置
            draggable: false,  //是否可拖动
            content: text
        });
        line.push(pos.gd_pos)
        idx = idx + 1
    })

    // 绘制轨迹
    var polyline = new AMap.Polyline({
        map: map,
        path: line,
        strokeColor: "#00A",  //线颜色
        strokeOpacity: 1,     //线透明度
        strokeWeight: 3,      //线宽
        strokeStyle: "solid"  //线样式
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