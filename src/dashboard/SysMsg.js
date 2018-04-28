import React from 'react';
import {inject, observer} from 'mobx-react';
import echarts from 'echarts';

@inject('rootStore')
@observer
class SysMsg extends React.Component{

    componentDidMount(){
        const store = this.props.rootStore.dashBoardStore;
        let dev=document.getElementById('SysMsg');
        let canvas=document.createElement(`div`);
        canvas.setAttribute('style',`width: ${dev.clientWidth}px;height:${dev.parentNode.clientHeight}px;`)
        dev.appendChild(canvas);
        store.once('SysMsg',data=>{
            console.log(data);

            var myChart = echarts.init(canvas);
            // { compute: 0, blockStorage: 0, network: 0, image: 0, agent: 0 }
            myChart.setOption( {
                title: {
                    text: '系统服务统计',
                    subtext: ''
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'shadow'
                    }
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis: {
                    type: 'value',
                    boundaryGap: [0, 1]
                },
                yAxis: {
                    type: 'category',
                    data: ['计算服务', '块服务', '网络服务', '镜像','网络代理']
                },
                series: [
                    {
                        type: 'bar',
                        name: '系统信息',
                        data: [data.compute, data.blockStorage, data.network, data.agent]
                    }
                ]
            });
        })
    }

    render(){
        return <div id='SysMsg'></div>
    }

}

export default SysMsg;