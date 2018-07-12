import React, {Component} from 'react';
import {inject, observer} from 'mobx-react';
import ReactEchartsCore from 'echarts-for-react/lib/core';
import echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/pie';
import 'echarts/lib/chart/bar';
import 'echarts/lib/component/title';
import Gallery from '../components/Gallery';
import {getPieOption, getSingleBarOption} from './tools';
import './index.less';
import {convertGigaFormat, baseUrl} from '../util';

const colorIndex = ['#2deb7d', '#4c96df', '#f8c32f', '#ff294c', '#8e3ef2'];
const colorGray = '#e8e8e8';

@inject('rootStore')
@observer
class Home extends Component {

  componentWillMount () {
    /* 请求数据加载 */
    this.props.rootStore.treeStore.loadCurrentRoleSys();
    this.isAdmin = 'admin' === JSON.parse(sessionStorage.getItem("user")).user_name;
    this.props.rootStore.homeStore.loadCMData(this.isAdmin);
    this.props.rootStore.homeStore.loadBDData();
    this.props.rootStore.homeStore.loadSlicePics();

    const {winWidth, winHeight, headerHeight, menuHeight, footerHeight} = this.props.rootStore.treeStore;
    const linksHeight = 60;
    const marginOut = 16;
    const marginInner = 16;
    const blockTitleHeight = 32;
    const pieInfoHeight = 40;
    const hasScrollBar = winHeight < 678;
    const scrollBarWidth = 17;
    const blockHeight = Math.max(Math.floor((winHeight - headerHeight - menuHeight - footerHeight - linksHeight - marginOut * 3) / 2), 205);
    this.mainHeight = winHeight - headerHeight - menuHeight - footerHeight;
    this.linksHeight = linksHeight;
    /* A块尺寸 */
    this.blockASize = {
      width: !hasScrollBar ? Math.floor((winWidth - marginOut * 3) / 2) : Math.floor((winWidth - marginOut * 3 - scrollBarWidth) / 2),
      height: blockHeight
    };
    /* B块尺寸 */
    this.blockBSize = this.blockASize;
    /* C块尺寸 */
    this.blockCSize = {
      width: !hasScrollBar ? Math.floor(winWidth - marginOut * 2) : Math.floor(winWidth - marginOut * 2 - scrollBarWidth),
      height: blockHeight
    };
    /* 饼图尺寸 */
    this.pieSize = {
      width: Math.floor((this.blockASize.width - marginInner * 5) / 4),
      height: this.blockASize.height - blockTitleHeight - pieInfoHeight - marginInner * 2
    };
    /* 柱状图尺寸 */
    this.barSize = {
      width: Math.floor(this.blockBSize.width - marginInner * 2),
      height: this.blockBSize.height - blockTitleHeight - marginInner * 2
    };
    /* 切片廊尺寸 */
    this.gallerySize = {
      width: this.blockCSize.width - marginInner * 2,
      height: this.blockCSize.height - blockTitleHeight - marginInner * 2
    };
  }
    targrt = (url) => (() => {
        if (url) {
            window.open(url);
        }
    });
    render() {
        const {
          mainHeight, linksHeight, blockASize, blockBSize, blockCSize, pieSize, barSize, gallerySize
        } = this;
        const { dataCM, dataBD, slicePics } = this.props.rootStore.homeStore;
        return (
            <div id="homePage" style={{ height: mainHeight }}>
                <div id="linksBox" style={{height: linksHeight}}>
                    <div className="bg-box"/>
                    <div className="links">
                        {this.isAdmin ?
                            <div className={`link qilinqu`} key='map'>
                              <span className="text">
                                <a target='_blank' href={`${baseUrl}/map`}>地图服务示范应用</a>
                              </span>
                            </div>
                        : ''}
                        {this.props.rootStore.treeStore.currentRoleSys.filter(d => d).map(sys => {
                            return (
                                <div className={`link ${sys.icon}`} key={sys.id}>
                                  <span
                                    className="text"
                                    onClick={this.targrt(sys.operations.filter(o => o.type === 1).length > 0
                                      ? `${sys.url}${sys.operations.filter(o => o.type === 1).map(o => o.path)[0]}?ispToken=${sys.token}`
                                      : null)}
                                  >
                                    {sys.name}
                                  </span>
                                </div>
                            );
                        })}
                    </div>
                </div>
                <div className="home-content">
                    <div className="block left" style={blockASize}>
                      <div className="title">云管理平台概况</div>
                      <div className="pies-box">
                        {dataCM[0].values ? dataCM.map((item, index) => (
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
                        )) : ''}
                      </div>
                    </div>
                    <div className="block right" style={blockBSize}>
                      <div className="title">大数据平台概况</div>
                      <ReactEchartsCore
                        echarts={echarts}
                        option={getSingleBarOption(dataBD, colorIndex)}
                        style={barSize}
                      />
                    </div>
                    <div className="block left bottom" style={blockCSize}>
                      <div className="title">切片服务</div>
                      {slicePics ?
                        <Gallery size={gallerySize} pictures={slicePics} duration={4000}  />
                        : ''
                      }
                    </div>
                </div>
            </div>
        );
    }
}

export default Home;

