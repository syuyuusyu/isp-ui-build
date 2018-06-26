import React, {Component} from 'react';
import {Row, Col} from 'antd';
import {inject, observer} from 'mobx-react';
import ReactEchartsCore from 'echarts-for-react/lib/core';
import echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/pie';
import 'echarts/lib/chart/bar';
import 'echarts/lib/component/title';
import {getPieOption, getBarOption, getSingleBarOption} from './tools';
import './index.less';
import {convertGigaFormat, baseUrl} from '../util';

const colorIndex = ['#2deb7d', '#4c96df', '#f8c32f', '#ff294c', '#8e3ef2'];
const colorGray = '#e8e8e8';

@inject('rootStore')
@observer
class Home extends Component {

    componentDidMount() {
        this.props.rootStore.homeStore.initHomeData();
        this.props.rootStore.homeStore.loadCloud();
        this.props.rootStore.treeStore.loadCurrentRoleSys();
        this.isAdmin = 'admin' === JSON.parse(sessionStorage.getItem("user")).user_name;

        const autoRefresh = () => {
            this.timerAutoRefresh = setTimeout(() => {
                autoRefresh();
            }, 15000);
            this.props.rootStore.summaryStoreBD.initSummaryData();
            if (this.isAdmin) {
                this.props.rootStore.summaryStoreCM.initSummaryData();
            }
        };
        autoRefresh();
    }

    componentWillUpdate() {

    }


    componentWillUnmount() {
        clearTimeout(this.timerAutoRefresh)
    }

    targrt = (url) => (() => {
        if (url) {
            window.open(url);
        }
    });

    render() {
        // console.log(this.props.rootStore.treeStore.currentRoleSys.filter(d=>d));
        const {winWidth, winHeight, headerHeight, menuHeight, footerHeight} = this.props.rootStore.treeStore;
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
        const {cloudManage: {instance, cpu, ram, storage}, bigData} = this.props.rootStore.homeStore;
        const {tableInfo, mianhdfsInfo} = this.props.rootStore.summaryStoreBD;
        const {totalSource} = this.props.rootStore.summaryStoreCM;
        return (
            <div id="homePage" style={{height: winHeight - headerHeight - menuHeight - footerHeight}}>
                <div id="linksBox" style={{height: linksHeight}}>
                    <div className="bg-box"/>
                    <div className="title">基础支撑平台</div>
                    <div className="links">
                        {
                            this.isAdmin ?
                                <div className={`link ygl`} key='map'>
                        <span className="text">
                          <a target='_blank' href={`${baseUrl}/map`}>地图服务示范应用</a>
                        </span>
                                </div>
                                : ''
                        }

                        {
                            this.props.rootStore.treeStore.currentRoleSys.filter(d => d).map(sys => {
                                return (
                                    <div className={`link ${sys.icon}`} key={sys.id}>

                    <span className="text" onClick={this.targrt(sys.operations.filter(o => o.type === 1).length > 0
                        ? `${sys.url}${sys.operations.filter(o => o.type === 1).map(o => o.path)[0]}?ispToken=${sys.token}`
                        : null)}>
                      {
                          sys.name
                      }
                    </span>
                                    </div>
                                );
                            })
                        }

                    </div>
                </div>
                <div className="home-content">

                    {
                        this.isAdmin?
                            <div className="block left" style={blockSize}>
                                <div className="title">云管理平台概况</div>

                                <div className="pie-container left">
                                    <ReactEchartsCore
                                        echarts={echarts}
                                        option={getPieOption({ total: totalSource[0].values[0], used: totalSource[0].values[1] }, ['#2deb7d', '#e8e8e8'])}
                                        style={pieSize}
                                    />
                                    <div className="info-box">
                                        <div className="name">CPU</div>
                                        <div className="num">使用{totalSource[0].values[1]}个，共{totalSource[0].values[0]}个</div>
                                    </div>
                                </div>

                                <div className="pie-container">
                                    <ReactEchartsCore
                                        echarts={echarts}
                                        option={getPieOption({ total: totalSource[1].values[0], used: totalSource[1].values[1] }, ['#4c96df', '#e8e8e8'])}
                                        style={pieSize}
                                    />
                                    <div className="info-box">
                                        <div className="name">内存</div>
                                        <div className="num">使用{totalSource[1].values[1]}G，共{totalSource[1].values[0]}G</div>
                                    </div>
                                </div>

                                <div className="pie-container left button">
                                    <ReactEchartsCore
                                        echarts={echarts}
                                        option={getPieOption({ total: totalSource[2].values[0], used: totalSource[2].values[1] }, ['#4c96df', '#e8e8e8'])}
                                        style={pieSize}
                                    />
                                    <div className="info-box">
                                        <div className="name">内存</div>
                                        <div className="num">使用{totalSource[2].values[1]}T，共{totalSource[2].values[0]}T</div>
                                    </div>
                                </div>


                            </div>
                            :
                            <div className="block left" style={blockSize}>
                                <div className="title">云管理平台概况</div>
                                <div className="pie-container left">
                                    <ReactEchartsCore
                                        echarts={echarts}
                                        option={getPieOption(instance, ['#2deb7d', '#e8e8e8'])}
                                        style={pieSize}
                                    />
                                    <div className="info-box">
                                        <div className="name">实例</div>
                                        <div className="num">使用{instance.used}个，共{instance.total}个</div>
                                    </div>
                                </div>

                                <div className="pie-container">
                                    <ReactEchartsCore
                                        echarts={echarts}
                                        option={getPieOption(cpu, ['#4c96df', '#e8e8e8'])}
                                        style={pieSize}
                                    />
                                    <div className="info-box">
                                        <div className="name">CPU</div>
                                        <div className="num">使用{cpu.used}个，共{cpu.total}个</div>
                                    </div>
                                </div>

                                <div className="pie-container left bottom">
                                    <ReactEchartsCore
                                        echarts={echarts}
                                        option={getPieOption(ram, ['#f8c32f', '#e8e8e8'])}
                                        style={pieSize}
                                    />
                                    <div className="info-box">
                                        <div className="name">内存</div>
                                        <div
                                            className="num">使用{convertGigaFormat(ram.used * 1024 * 1024)},共{convertGigaFormat(ram.total * 1024 * 1024)}</div>
                                    </div>
                                </div>

                                <div className="pie-container bottom">
                                    <ReactEchartsCore
                                        echarts={echarts}
                                        option={getPieOption(storage, ['#ff294c', '#e8e8e8'])}
                                        style={pieSize}
                                    />
                                    <div className="info-box">
                                        <div className="name">硬盘</div>
                                        <div
                                            className="num">使用{convertGigaFormat(storage.used * 1024 * 1024 * 1024)},共{convertGigaFormat(storage.total * 1024 * 1024 * 1024)}</div>
                                    </div>
                                </div>

                            </div>
                    }



                    <div className="block right" style={blockSize}>
                        <div className="title">大数据平台概况</div>
                        {/*<div className="more">查看详情 ></div>*/}
                        <ReactEchartsCore
                            echarts={echarts}
                            option={((option) => {
                                option.grid.width = barSize.width - 30;
                                option.grid.height = barSize.height - 60;
                                return option
                            })(getSingleBarOption(tableInfo, colorIndex))}
                            style={barSize}
                        />

                        <div className="horizontal-bar-container">
                            <div className="title">HDFS(GB)</div>
                            <div className="horizontal-bar">
                                <div className="bar"
                                     style={{width: `${mianhdfsInfo.used / mianhdfsInfo.total * 100}%`}}>
                                    <span
                                        className="text-center">{(mianhdfsInfo.used / mianhdfsInfo.total * 100).toFixed(2)}%</span>
                                </div>
                            </div>
                            <span className="right">共{mianhdfsInfo.total}G，已使用{mianhdfsInfo.used}G</span>
                        </div>

                    </div>
                </div>
            </div>
        );
    }
}

export default Home;

