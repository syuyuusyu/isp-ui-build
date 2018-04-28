import React from 'react';
import {inject, observer} from 'mobx-react';
import echarts from 'echarts';
import {dateFtt} from '../util';

@inject('rootStore')
@observer
class CpuInfo extends React.Component{

    componentDidMount(){
        const store = this.props.rootStore.dashBoardStore;
        let dev=document.getElementById('CpuInfo');
        let canvas=document.createElement(`div`);
        canvas.setAttribute('style',`width: ${dev.clientWidth}px;height:${dev.parentNode.clientHeight}px;`)
        dev.appendChild(canvas);
        store.once('CpuInfo',data=>{

            var myChart = echarts.init(canvas);
            myChart.setOption( {
                title: {
                    text: 'CPU使用率',
                    subtext: ''
                },
                legend: {
                    data: data.map(d=>d.name)
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
                yAxis: {
                    type: 'value',
                    boundaryGap: [0, 1]
                },
                xAxis: {
                    type: 'category',
                    data: data[0].time.map(d=>dateFtt("hh:mm:ss",new Date(d)))
                },
                series: data.map(d=>({
                    type:'line',
                    name:d.name,
                    data:d.data
                }))
            });
        })
    }



    render(){
        return <div id='CpuInfo'></div>
    }

}

export default CpuInfo;