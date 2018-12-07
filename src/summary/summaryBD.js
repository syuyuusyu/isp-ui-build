import React, { Component } from 'react';
import { Row, Col } from 'antd';
import {inject,observer} from 'mobx-react';
import ReactEchartsCore from 'echarts-for-react/lib/core';
import echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/pie';
import 'echarts/lib/chart/bar';
import 'echarts/lib/chart/line';
import 'echarts/lib/component/title';
import { getSankeyOption, getItemsPieOption, getSingleBarOption } from './tools';
import Topology from './Topology';
import HorizontalBar from './HorizontalBar';
import './index.less';

const colorIndex = ['#2deb7d', '#4c96df', '#f8c32f', '#ff294c', '#8e3ef2'];
const colorGray = '#e8e8e8';

@inject('rootStore')
@observer
class SummaryBD extends Component{
  componentDidMount () {
    const autoRefresh = () => {
      this.timerAutoRefresh = setTimeout(() => {
        autoRefresh();
      }, 1000*60*10);
      this.props.rootStore.summaryStoreBD.initSummaryData();
    };
    autoRefresh();
  }
  componentWillUpdate () {
  }
  componentWillUnmount () {
    clearTimeout(this.timerAutoRefresh)
  }
  render () {
    const { winWidth, winHeight, headerHeight, menuHeight, footerHeight } = this.props.rootStore.treeStore;
    const marginOut = 16;
    const marginInner = 16;
    const blockASize = {
      width: Math.floor((winWidth - 4 * marginOut) / 2),
      height: Math.floor((winHeight - headerHeight - menuHeight - footerHeight - 2 * marginOut) / 5 * 3),
    };
    const blockBSize = {
      width: Math.floor((winWidth - 4 * marginOut) / 4),
      height: blockASize.height,
    };
    const blockCSize = {
      width: Math.floor((winWidth - 5 * marginOut) / 4),
      height: Math.floor((winHeight - headerHeight - menuHeight - footerHeight - 2 * marginOut) / 5 * 2),
    };
    const blockTitleHeight = 32;
    const sankeySize = {
      width: blockASize.width - marginInner * 2,
      height: blockASize.height - marginInner * 2 - blockTitleHeight,
    };
    const bPieSize = {
      width: blockBSize.width - marginInner * 2,
      height: blockBSize.height - marginInner * 2 - blockTitleHeight,
    };
    const cChartSize = {
      width: blockCSize.width - marginInner * 2,
      height: blockCSize.height - marginInner * 2 - blockTitleHeight,
    };
    const { clusterInfo, sparkInfo, mapReduceInfo, tableInfo, oracleInfo, mySQLInfo, hdfsInfo } = this.props.rootStore.summaryStoreBD;
    return (
      <div id="summaryBox">
        <div className="block" style={blockASize}>
          <div className="title">大数据集群</div>
          <ReactEchartsCore
            echarts={echarts}
            option={getSankeyOption(clusterInfo.data, clusterInfo.links, colorIndex)}
            style={sankeySize}
          />
        </div>
        <div className="block right" style={blockBSize}>
          <div className="title">Oracle</div>
          <ReactEchartsCore
            echarts={echarts}
            option={getItemsPieOption(oracleInfo, bPieSize, colorIndex)}
            style={bPieSize}
          />
        </div>
        <div className="block right" style={blockBSize}>
          <div className="title">MySQL</div>
          <ReactEchartsCore
            echarts={echarts}
            option={getItemsPieOption(mySQLInfo, bPieSize, colorIndex)}
            style={bPieSize}
          />
        </div>
        <div className="block bottom" style={blockCSize}>
          <div className="title">Spark</div>
          <ReactEchartsCore
            echarts={echarts}
            option={getItemsPieOption(sparkInfo, cChartSize, [colorIndex[0], colorIndex[3], colorIndex[2]])}
            style={cChartSize}
          />
        </div>
        <div className="block bottom right" style={blockCSize}>
          <div className="title">MapReduce</div>
          <ReactEchartsCore
            echarts={echarts}
            option={getItemsPieOption(mapReduceInfo, cChartSize, [colorIndex[0], colorIndex[3], colorIndex[2]])}
            style={cChartSize}
          />
        </div>
        <div className="block bottom right" style={blockCSize}>
          <div className="title">HDFS</div>
          <ReactEchartsCore
            echarts={echarts}
            option={getItemsPieOption(hdfsInfo, cChartSize, colorIndex)}
            style={cChartSize}
          />
        </div>
        <div className="block bottom right" style={blockCSize}>
          <div className="title">数据库表(张)</div>
          <ReactEchartsCore
            echarts={echarts}
            option={((option) => {
              option.grid.height = cChartSize.height - 32;
              return option
            })(getSingleBarOption(tableInfo, colorIndex))}
            style={cChartSize}
          />
        </div>
      </div>
    );
  }
}
export default SummaryBD;
