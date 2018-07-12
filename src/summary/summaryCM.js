import React, { Component } from 'react';
import { Row, Col } from 'antd';
import {inject,observer} from 'mobx-react';
import ReactEchartsCore from 'echarts-for-react/lib/core';
import echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/pie';
import 'echarts/lib/chart/bar';
import 'echarts/lib/chart/line';
import 'echarts/lib/component/title';
import { getPieOption, getLineOption } from './tools';
import Topology from './Topology';
import HorizontalBar from './HorizontalBar';
import './index.less';

const colorIndex = ['#2deb7d', '#4c96df', '#f8c32f', '#ff294c'];
const colorGray = '#e8e8e8';

@inject('rootStore')
@observer
class SummaryCM extends Component{
  componentWillMount () {
    this.tpUpdateMark = 0;
  }
  componentDidMount () {
    const autoRefresh = () => {
      this.timerAutoRefresh = setTimeout(() => {
        autoRefresh();
      }, 1000*60*10);
      this.props.rootStore.summaryStoreCM.initSummaryData();
    };
    autoRefresh();
  }
  componentWillUpdate () {
    if (this.tpUpdateMark !== this.props.rootStore.summaryStoreCM.tpUpdateMark) {
      this.tpUpdateMark = this.props.rootStore.summaryStoreCM.tpUpdateMark;
      this.refs.topology.updateTopology(this.props.rootStore.summaryStoreCM.topologyData);
    }
  }
  componentWillUnmount () {
    clearTimeout(this.timerAutoRefresh);
  }
  render () {
    const { winWidth, winHeight, headerHeight, menuHeight, footerHeight } = this.props.rootStore.treeStore;
    const linksHeight = winHeight < 700 ? 100 : 180;
    const marginOut = 16;
    const marginInner = 16;
    const blockASize = {
      width: Math.floor((winWidth - 3 * marginOut) / 2),
      height: Math.floor((winHeight - headerHeight - menuHeight - footerHeight - 2 * marginOut) / 2),
    };
    const blockCSize = {
      width: Math.floor((winWidth - 3 * marginOut) / 3 * 2),
      height: blockASize.height,
    };
    const blockDSize = {
      width: Math.floor((winWidth - 3 * marginOut) / 3),
      height: blockASize.height,
    };
    const pieInfoHeight = 40;
    const tabTitleHeight = 40;
    const blockTitleHeight = 32;
    const pieSize = {
      width: Math.floor((blockASize.width - 32) / 4),
      height: blockASize.height - tabTitleHeight - pieInfoHeight,
    };
    const lineSize = {
      width: blockASize.width - marginInner * 2,
      height: blockASize.height - marginInner * 2 - blockTitleHeight,
    };
    const topologySize = {
      width: blockCSize.width - marginInner * 2,
      height: blockCSize.height - marginInner * 2 - blockTitleHeight,
    };
    const barSize = {
      width: blockDSize.width - 2 * marginInner,
      height: Math.floor((blockDSize.height - marginInner * 2 - blockTitleHeight - 32) / 5),
    };
    const { currentActiveTable, personalSource, totalSource, cpuState, topologyData, cloudServer } = this.props.rootStore.summaryStoreCM;
    const sourceDataShow = currentActiveTable === 0 ? personalSource : totalSource;
    return (
      <div id="summaryBox">

        <div className="block tab-box" style={blockASize}>
          <div className="tab-title">
            <div
              className={`title${currentActiveTable === 0 ? ' active' : ''}`}
              onClick={() => this.props.rootStore.summaryStoreCM.toggleTable(0)}
            >个人资源</div>
            <div
              className={`title${currentActiveTable === 1 ? ' active' : ''}`}
              onClick={() => this.props.rootStore.summaryStoreCM.toggleTable(1)}
            >云区总资源</div>
          </div>
          <div className="tab-content">
            {sourceDataShow.map((item, index) => {
              return (
                <div className="pie-container" key={index}>
                  <ReactEchartsCore
                    echarts={echarts}
                    option={getPieOption({ total: item.values[0], used: item.values[1] }, [colorIndex[index], colorGray])}
                    style={pieSize}
                  />
                  <div className="pie-info">
                    <div className="name">{item.type}</div>
                    <div className="num">{item.values[1]}{item.unit}&nbsp;(共{item.values[0]}{item.unit})</div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>


        <div className="block right" style={blockASize}>
          <div className="title">CPU监控</div>
          <ReactEchartsCore
            echarts={echarts}
            option={((option) => {
              option.grid.width = lineSize.width - 56;
              option.grid.height = lineSize.height - 60;
              return option
            })(getLineOption(cpuState, colorIndex))}
            style={lineSize}
          />
        </div>
        <div className="block bottom" style={blockCSize}>
          <div className="title">拓扑图</div>
          <Topology
            ref="topology"
            {...topologySize}
            data={topologyData}
          />
        </div>
        <div className="block bottom right" style={blockDSize}>
          <div className="title">云服务</div>
          {cloudServer.map(({ type, total, used, unit }, index) => {
            return (
              <HorizontalBar
                key={index}
                total={total}
                value={used}
                name={type}
                width={barSize.width}
                height={barSize.height}
                color={colorIndex[1]}
                unit={unit}
              />
            )
          })}
        </div>
      </div>
    );
  }
}
export default SummaryCM;
