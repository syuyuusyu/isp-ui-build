import React, { Component } from 'react';
import Topology from '../topology';

class SummaryTopology extends Component {
  componentDidMount () {
    const { data } = this.props;
    // 加载节点图标
    loadImages([
      {
        name : 'pc',
        src : require('../assets/images/icon_pc.png'),
      },
      {
        name : 'vpc',
        src : require('../assets/images/icon_vpc.png'),
      },
      {
        name : 'cloud',
        src : require('../assets/images/icon_cloud.png'),
      }
    ]).then((imgSources) => {
      const canvas = document.getElementById('summaryTPCanvas');
      this.topology = new Topology({
        canvas : canvas,
        topologyData : data,
        imgSources : imgSources,
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
      })
    })
  }
  updateTopology (data) {
    this.topology.updateData(data);
  }
  render () {
    const { width, height } = this.props;
    return (
      <div id="summaryTopology" style={{ width, height }}>
        <canvas id="summaryTPCanvas" />
      </div>
    )
  }
}

const loadImages = (sourceList) => {
  return new Promise((resolve, reject) => {
    let numWaiting = sourceList.length;
    let sources = {};

    const load = (img, name) => {
      sources[name] = img;
      numWaiting--;
      if (numWaiting === 0) {
        resolve(sources)
      }
    };
    for (let i = 0; i < sourceList.length; i++) {
      let source = sourceList[i];
      let img = document.createElement('img');
      img.onload = function () {
        load(img, source.name);
      };
      img.src = source.src;
    }
  });
};

export default SummaryTopology

