import React, {Component} from "react";
import {inject, observer} from "mobx-react";
import {Popover, notification,Tooltip} from "antd";
import ReactEchartsCore from "echarts-for-react/lib/core";
import echarts from "echarts/lib/echarts";
import "echarts/lib/chart/pie";
import "echarts/lib/chart/bar";
import "echarts/lib/component/title";
import Gallery from "../components/Gallery";
import {getPieOption, getSingleBarOption} from "./tools";
import "./index.less";
import {convertGigaFormat, baseUrl, isGov} from "../util";
//import Stomp  from 'stompjs';

const colorIndex = ["#2deb7d", "#4c96df", "#f8c32f", "#ff294c", "#8e3ef2"];
const colorGray = "#e8e8e8";

/**
 * 获取外链node节点
 * @param isAdmin{boolean} 是否为admin用户
 * @param currentRoleSys{array}
 * @param eClick{function} 点击事件
 * @returns {{linkNum: *, linksLess: Array, linksMore: Array}}
 */
const getLinks = (isAdmin=true, currentRoleSys, eClick) => {
    const length = currentRoleSys.length;
    //const linkNum = isAdmin ? length + 1 : length;
    const linkNum =  length+3;
    let linksLess = [];
    let linksMore = [];
    const isOut = linkNum>=6;

    for (let i = 0; i < length; i++) {
        const {name, icon, token, operations} = currentRoleSys[i];
        const url =
            currentRoleSys[i]["isGov"] === "0"
                ? currentRoleSys[i]["url"]
                : currentRoleSys[i][isGov ? "govUrl" : "url"];
        const usableOpe = operations.filter(o => o.type == 1);
        let base = `${url}${usableOpe[0] ? usableOpe[0].path : ""}`;
        let _mack = base.indexOf("?") == -1 ? "?" : "&";
        const href = `${url}${
            usableOpe[0] ? usableOpe[0].path : ""
            }${_mack}ispToken=${token}`;

        let displayName=name.split('');
        let blankArr = [];
        if(isOut) {
            let inserIndex, deletlength, addstr = '', blanklength = 0;
            if (displayName.length > 5) {
                if (displayName.length == 7) {
                    inserIndex = 6, deletlength = 1, addstr = '.';
                }
                inserIndex = 6, deletlength = displayName.length - 6, addstr = '..';
            } else {
                blanklength = 8 - displayName.length;
                inserIndex = 0, deletlength = 0
            }

            for (let j = 0; j < blanklength; j++) {
                blankArr.push(<span key={j}>&nbsp;</span>);
            }
            displayName.splice(inserIndex, deletlength, addstr);
        }
        const node = (
            <div key={i} className={`link ${icon}`} data-href={href} onClick={eClick}>
                <Tooltip title={name}>
                    <span className="text">{blankArr.map(_=>_)}{displayName.join('')}</span>
                </Tooltip>
            </div>
        );
        if (i < 6)  {
            linksLess.push(node);
        } else {
            const node2 = (
                <div key={i} className={`link ${icon}`} data-href={href} onClick={eClick}>
                        <span className="text">{name}</span>
                </div>
            );
            linksMore.push(node2);
        }
    }

    if(linksLess.length<6){
        linksLess.push(
            <div
                key={100}
                className={`link qilinqu`}
                data-href={"http://10.10.50.15:8088/acp"}
                onClick={eClick}
            >
                {
                    isOut?
                        <Tooltip title="智能化信息提取系统">
                            <span className="text">智能化信息提..</span>
                        </Tooltip>
                        :
                        <span className="text">智能化信息提取系统</span>
                }

            </div>
        );
    }
    else{
        linksMore.push(
            <div key={100} className={`link qilinqu`} data-href={"http://10.10.50.15:8088/acp"} onClick={eClick}>
                <span className="text">智能化信息提取系统</span>
            </div>
        )
    }

    if(linksLess.length<6){
        linksLess.push(
            <div
                key={101}
                className={`link qilinqu`}
                data-href={isGov?
                    "http://59.216.201.50:8081/lqptserver/app/index.html"
                    :"http://10.10.50.56:8080/lqptserver/app/index.html"
                }
                onClick={eClick}
            >
                {
                    isOut?
                        <Tooltip title="云南省两区综合管理平台">
                            <span className="text">云南省两区综..</span>
                        </Tooltip>
                        :
                        <span className="text">云南省两区综合管理平台</span>
                }

            </div>
        );
    }
    else{
        linksMore.push(
            <div key={101}
                 className={`link qilinqu`}
                 data-href={isGov?
                     "http://59.216.201.50:8081/lqptserver/app/index.html"
                     :"http://10.10.50.56:8080/lqptserver/app/index.html"
                 }
                 onClick={eClick}>
                <span className="text">云南省两区综合管理平台</span>
            </div>
        )
    }

    if(linksLess.length<6){
        linksLess.push(
            <div
                key={102}
                className={`link qilinqu`}
                data-href={
                    isGov
                        ? "http://59.216.201.50:8089/gds/ol4/template/monitor/monitor.html?ztid=a22f0eec-a538-4d7d-b17c-7750366dea94"
                        : "http://10.10.50.39:8080/gds/ol4/template/monitor/monitor.html?ztid=a22f0eec-a538-4d7d-b17c-7750366dea94"
                }
                onClick={eClick}
            >
                {
                    isOut?
                        <Tooltip title="城市综合管理PAD端">
                            <span className="text">城市综合管理..</span>
                        </Tooltip>
                        :
                        <span className="text">城市综合管理PAD端</span>
                }

            </div>
        );
    }
    else{
        linksMore.push(
            <div key={101}
                 className={`link qilinqu`}
                 data-href={
                     isGov
                         ? "http://59.216.201.50:8089/gds/ol4/template/monitor/monitor.html?ztid=a22f0eec-a538-4d7d-b17c-7750366dea94"
                         : "http://10.10.50.39:8080/gds/ol4/template/monitor/monitor.html?ztid=a22f0eec-a538-4d7d-b17c-7750366dea94"
                 }
                 onClick={eClick}>
                <span className="text">城市综合管理PAD端</span>
            </div>
        )
    }






    return {
        linkNum,
        linksLess,
        linksMore: <div className="links-more">{linksMore}</div>
    };
};

@inject("rootStore")
@observer
class Home extends Component {
    componentWillMount() {
        /* 请求数据加载 */
        this.props.rootStore.treeStore.loadCurrentRoleSys();
        this.isAdmin =
            "admin" === JSON.parse(sessionStorage.getItem("user")).user_name;
        this.props.rootStore.homeStore.loadCMData(this.isAdmin);
        this.props.rootStore.homeStore.loadBDData();
        this.props.rootStore.homeStore.loadSlicePics();
        this.props.rootStore.homeStore.loadSmapSlicePics();

        const {
            winWidth,
            winHeight,
            headerHeight,
            menuHeight,
            footerHeight
        } = this.props.rootStore.treeStore;
        const linksHeight = 60;
        const marginOut = 16;
        const marginInner = 16;
        const blockTitleHeight = 32;
        const pieInfoHeight = 40;
        const hasScrollBar = winHeight < 678;
        const scrollBarWidth = 17;
        const blockHeight = Math.max(
            Math.floor(
                (winHeight -
                    headerHeight -
                    menuHeight -
                    footerHeight -
                    linksHeight -
                    marginOut * 3) /
                2
            ),
            205
        );
        this.mainHeight = winHeight - headerHeight - menuHeight - footerHeight;
        this.linksHeight = linksHeight;
        /* A块尺寸 */
        this.blockASize = {
            width: !hasScrollBar
                ? Math.floor((winWidth - marginOut * 3) / 2)
                : Math.floor((winWidth - marginOut * 3 - scrollBarWidth) / 2),
            height: blockHeight - 16
        };
        /* B块尺寸 */
        this.blockBSize = this.blockASize;
        /* C块尺寸 */
        this.blockCSize = {
            width: !hasScrollBar
                ? Math.floor(winWidth - marginOut * 2)
                : Math.floor(winWidth - marginOut * 2 - scrollBarWidth),
            height: blockHeight
        };
        /* 饼图尺寸 */
        this.pieSize = {
            width: Math.floor((this.blockASize.width - marginInner * 5) / 4),
            height:
            this.blockASize.height -
            blockTitleHeight -
            pieInfoHeight -
            marginInner * 2
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

        //需要引入两个包 "net": "^1.0.2","stompjs": "^2.3.3"
        //import Stomp  from 'stompjs';
        // if(this.isAdmin){
        //     //let ws = new WebSocket('ws://127.0.0.1:15674/ws');
        //     let ws = new WebSocket('ws://10.10.50.10:15674/ws');
        //     let client = Stomp.over(ws);
        //
        //     var on_connect = function() {
        //         var sub = client.subscribe('loginMessage', function(message) {
        //             //这里是收到消息的回调函数
        //             let body=JSON.parse(message.body);
        //             //body包含两个信息,type:'1 登录':'0 退出',name:用户名
        //             let msg=body.type==1?'登录':'退出';
        //             notification.info({
        //                 message:`${body.name}${msg}`
        //             })
        //
        //         });
        //     };
        //     var on_error =  function() {
        //         console.log('error');
        //     };
        //     //client.connect('guest', 'guest', on_connect, on_error, '/');
        //     client.connect('admin', '123456', on_connect, on_error, '/');
        // }
    }

    linkClick(e) {
        const href = e.currentTarget.getAttribute("data-href");
        window.open(href);
        this.props.rootStore.treeStore.loadCurrentRoleSys.defer()(5000);
    }

    createGallery = () => {
        const {
            slicePics,
            smapslicePics,
            actityTable
        } = this.props.rootStore.homeStore;
        if (
            (actityTable === 0 && !smapslicePics) ||
            (actityTable === 1 && !slicePics)
        ) {
            return <div>获取信息失败!!</div>;
        }
        if (actityTable === 0) {
            return (
                <Gallery
                    key={"supermap"}
                    size={this.gallerySize}
                    pictures={smapslicePics.filter(d => d)}
                    duration={4000}
                />
            );
        } else {
            return (
                <Gallery
                    key={"zd"}
                    size={this.gallerySize}
                    pictures={slicePics.filter(d => d)}
                    duration={4000}
                />
            );
        }
    };

    render() {
        const {
            isAdmin,
            mainHeight,
            linksHeight,
            blockASize,
            blockBSize,
            blockCSize,
            pieSize,
            barSize,
            gallerySize
        } = this;
        /* 外链入口 */
        const {currentRoleSys} = this.props.rootStore.treeStore;
        const {linkNum, linksLess, linksMore} = getLinks(
            true,
            currentRoleSys,
            this.linkClick.bind(this)
        );
        /* 可视化数据 */
        const {
            dataCM,
            dataBD,
            slicePics,
            smapslicePics,
            actityTable,
            setActityTable,
            pics
        } = this.props.rootStore.homeStore;
        return (
            <div id="homePage" style={{height: mainHeight}}>
                <div id="linksBox" style={{height: linksHeight}}>
                    {linksLess}
                    {linkNum > 5 ? (
                        <Popover placement="bottom" content={linksMore} trigger="click">
                            <div className="link more">
                                <span className="text">更多</span>
                            </div>
                        </Popover>
                    ) : (
                        ""
                    )}
                </div>
                <div className="home-content">
                    <div className="float-box" style={{width: blockCSize.width}}>
                        <div className="block left" style={blockASize}>
                            <div className="title">云管理平台概况</div>
                            <div className="pies-box">
                                {dataCM[0].values
                                    ? dataCM.map((item, index) => (
                                        <div className="pie-container" key={index}>
                                            <ReactEchartsCore
                                                echarts={echarts}
                                                option={getPieOption(
                                                    {
                                                        total: item.values[0],
                                                        used: item.values[1]
                                                    },
                                                    [colorIndex[index], colorGray]
                                                )}
                                                style={pieSize}
                                            />
                                            <div className="pie-info">
                                                <div className="name">{item.type}</div>
                                                <div className="num">
                                                    {item.values[1]}
                                                    {item.unit}&nbsp;(共{item.values[0]}
                                                    {item.unit})
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                    : ""}
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
                    </div>

                    <div
                        className="block bottom"
                        style={{...blockCSize, paddingTop: 0}}
                    >
                        <div className="block tab-box" style={blockASize}>
                            <div
                                className="tab-title"
                                style={{
                                    height: "30px",
                                    lineHeight: "30px",
                                    marginBottom: "10px",
                                    marginTop: "-10px"
                                }}
                            >
                                <div
                                    className={`title${actityTable === 0 ? " active" : ""}`}
                                    onClick={setActityTable(0)}
                                >
                                    超图地图服务
                                </div>
                                <div
                                    className={`title${actityTable === 1 ? " active" : ""}`}
                                    onClick={setActityTable(1)}
                                >
                                    中地地图服务
                                </div>
                            </div>
                            <div className="tab-content">{this.createGallery()}</div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Home;
