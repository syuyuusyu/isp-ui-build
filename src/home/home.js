import React, { Component } from 'react';
import { Row, Col } from 'antd';
import {inject,observer} from 'mobx-react';
import ReactEchartsCore from 'echarts-for-react/lib/core';
import echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/pie';
import 'echarts/lib/chart/bar';
import 'echarts/lib/component/title';
import { getPieOption, getBarOption } from './tools';
import './index.less';

@inject('rootStore')
@observer
class Home extends Component{

  componentDidMount () {
    this.props.rootStore.homeStore.initHomeData();
    this.props.rootStore.treeStore.loadCurrentRoleSys();
  }
  componentWillUpdate () {

  }
  render () {
      console.log(this.props.rootStore.treeStore.currentRoleSys.filter(d=>d));
    const { winWidth, winHeight, headerHeight, menuHeight, footerHeight } = this.props.rootStore.treeStore;
    const linksHeight = winHeight < 700 ? 100 : 180;
    const marginOut = 16;
    const marginInner = 16;
    const blockTitleHeight = 48;
    let blockSize = {};
    blockSize.width = Math.floor((winWidth - marginOut * 3) / 2);
    blockSize.height = Math.floor(winHeight - headerHeight - menuHeight - footerHeight - linksHeight - marginOut * 2);
    let pieSize = {};
    pieSize.width = Math.floor(((winWidth - marginOut * 3) / 2 - marginInner * 3) / 2);
    pieSize.height = Math.floor((blockSize.height - marginInner * 3 - blockTitleHeight) / 2) - 40;
    let barSize = {};
    barSize.width = Math.floor((winWidth - marginOut * 3) / 2 - marginInner * 2);
    barSize.height = blockSize.height - marginInner * 3 - blockTitleHeight - 70;
    const { cloudManage: { instance, cpu, ram, storage }, bigData } = this.props.rootStore.homeStore;
    return (
      <div id="homePage" style={{ height: winHeight - headerHeight - menuHeight - footerHeight }}>
        <div id="linksBox" style={{ height: linksHeight }}>
          <div className="bg-box" />
          <div className="title">基础支撑平台</div>
          <div className="links">

            <div className="link ygl">
              <span className="text">云管理平台</span>
            </div>
            <div className="link dsj">
              <span className="text">大数据平台</span>
            </div>
            <div className="link yaq">
              <span className="text">云安全平台</span>
            </div>
            <div className="link yw">
              <span className="text">运维平台</span>
            </div>

          </div>
        </div>
        <div className="home-content">
          <div className="block left" style={blockSize}>
            <div className="title">云管理平台概况</div>
            <div className="more">查看详情 ></div>
            <div className="pie-container left">
              <ReactEchartsCore
                echarts={echarts}
                option={getPieOption(instance, ['#2deb7d', '#e8e8e8'])}
                style={pieSize}
              />
              <div className="info-box">
                <div className="name">实例</div>
                <div className="num">使用5个，共10个</div>
              </div>
            </div>
            <div className="pie-container">
              <ReactEchartsCore
                echarts={echarts}
                option={getPieOption(cpu, ['#4c96df', '#e8e8e8'])}
                style={pieSize}
              />
              <div className="info-box">
                <div className="name">实例</div>
                <div className="num">使用5个，共10个</div>
              </div>
            </div>
            <div className="pie-container left bottom">
              <ReactEchartsCore
                echarts={echarts}
                option={getPieOption(ram, ['#f8c32f', '#e8e8e8'])}
                style={pieSize}
              />
              <div className="info-box">
                <div className="name">实例</div>
                <div className="num">使用5个，共10个</div>
              </div>
            </div>
            <div className="pie-container bottom">
              <ReactEchartsCore
                echarts={echarts}
                option={getPieOption(storage, ['#ff294c', '#e8e8e8'])}
                style={pieSize}
              />
              <div className="info-box">
                <div className="name">实例</div>
                <div className="num">使用5个，共10个</div>
              </div>
            </div>
          </div>
          <div className="block right" style={blockSize}>
            <div className="title">大数据平台概况</div>
            <div className="more">查看详情 ></div>
            <ReactEchartsCore
              echarts={echarts}
              option={((option) => {
                option.grid.width = barSize.width - 30;
                option.grid.height = barSize.height - 60;
                return option
              })(getBarOption(bigData.instance))}
              style={barSize}
            />
            <div className="horizontal-bar-container">
              <div className="title">HDFS(GB)</div>
              <div className="horizontal-bar">
                <div className="bar" style={{ width: '48%' }}>
                  <span className="text-center">48%</span>
                </div>
              </div>
              <span className="right">共17.07W，已使用8.32W</span>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default Home;
