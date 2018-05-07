import React from 'react';
import {inject, observer} from 'mobx-react';
import Topology from '../topology';



@inject('rootStore')
@observer
class CloudTopology extends React.Component {

    componentDidMount() {
        const store = this.props.rootStore.dashBoardStore;
        store.on('topo', (topology) => {
            loadImages([ {
                name : 'pc',
                src : require('../assets/images/icon_pc.png')
            }, {
                name : 'vpc',
                src : require('../assets/images/icon_vpc.png')
            }, {
                name : 'cloud',
                src : require('../assets/images/icon_cloud.png')
            } ], function(sources) {
                // 加载完成，开始绘制拓扑图
                var canvas = document.getElementById('layer0');
                new Topology({
                    canvas : canvas,
                    topologyData : topology.entity,
                    imgSources : sources,
                    nodeStyle : {
                        width : 80,
                        height : 48,
                        horizontalMargin : 8,
                        verticalMargin : 40,
                        border : false,
                        borderWidth : 1,
                        borderColor : '#aaa',
                        borderRadius : 0
                    },
                    lineStyle : {
                        width : 2,
                        color : '#4c96dd'
                    },
                    nodeLabel : true,
                    event : {
                        // nodeClick : function nodeClick(node, e) {
                        //     console.log(node, e);
                        // },
                        // nodeHoverIn : function nodeHoverIn(node) {
                        //     console.log('hoverIn', node);
                        // },
                        // nodeHoverOut : function nodeHoverOut(node) {
                        //     console.log('hoverOut', node);
                        // }
                    }
                });
            });
        });
    }

    render() {
        return <div  id='cloudTopology'><canvas id='layer0'></canvas></div>
    }

}

function loadImages(sourceList, callback) {
    var numWaiting = sourceList.length;
    var sources = {};

    var load = function (img, name) {
        sources[name] = img;
        numWaiting--;
        if (numWaiting === 0) {
            callback(sources);
        }
    };

    for (var i = 0; i < sourceList.length; i++) {
        (function (index) {
            var source = sourceList[index];
            var img = document.createElement('img');
            img.onload = function () {
                load(img, source.name);
            };
            img.src = source.src;
        })(i);
    }
};


export default CloudTopology;