import React from 'react';
import {inject, observer} from 'mobx-react';
import echarts from 'echarts';
import {convertGigaFormat} from '../util';


@inject('rootStore')
@observer
class CloudSource extends React.Component {

    componentDidMount() {
        const store = this.props.rootStore.dashBoardStore;
        let dev = document.getElementById('CloudSource');
        console.log(dev.clientWidth, dev.parentNode.clientHeight);
        let canvas = document.createElement(`div`);
        canvas.setAttribute('style', `width: ${dev.clientWidth}px;height:${dev.parentNode.clientHeight}px;`);
        dev.appendChild(canvas);

        store.once('CloudSource', data => {
            console.log(data);
            // vcpu 内存 卷储蓄
            var myChart = echarts.init(canvas);
            myChart.setOption({
                title: [{
                    text: '云区总资源池',
                    subtext: '',
                    x: 'center'
                }, {
                    text: 'VCPU',
                    textStyle: {
                        fontWeight: 'normal'
                    },
                    subtext: `使用${data.vcpus_used}\n共(${data.vcpus})`,
                    x: '25%',
                    y: '75%',
                    textAlign: 'center'
                }, {
                    text: `${((data.vcpus_used/data.vcpus)*100).toFixed(2)}%`,
                    textStyle: {
                        fontWeight: 'lighter',
                        fontSize:14
                    },
                    x: '25%',
                    y: '48%',
                    textAlign: 'center',


                }, {
                    text: '内存',
                    textStyle: {
                        fontWeight: 'normal'
                    },
                    subtext: `使用${convertGigaFormat(data.memory_mb_used * 1024)}\n共(${convertGigaFormat(data.memory_mb * 1024)})`,
                    x: '50%',
                    y: '75%',
                    textAlign: 'center'
                }, {
                    text: `${((data.memory_mb_used/data.memory_mb)*100).toFixed(2)}%`,
                    textStyle: {
                        fontWeight: 'lighter',
                        fontSize:14
                    },
                    x: '50%',
                    y: '48%',
                    textAlign: 'center',

                }, {
                    text: '卷储存',
                    textStyle: {
                        fontWeight: 'normal'
                    },
                    subtext: `使用${convertGigaFormat(data.local_gb_used * 1024 * 1024)}\n共(${convertGigaFormat(data.local_gb * 1024 * 1024)})`,
                    x: '75%',
                    y: '75%',
                    textAlign: 'center'
                } ,{
                    text: `${((data.local_gb_used/data.local_gb)*100).toFixed(2)}%`,
                    textStyle: {
                        fontWeight: 'lighter',
                        fontSize:14
                    },
                    x: '75%',
                    y: '48%',
                    textAlign: 'center',
                }
                ],
                calculable: true,
                series: [
                    {
                        name: 'VCPU',
                        type: 'pie',
                        radius: [30, 50],
                        center: ['25%', '50%'],
                        data: [
                            {value: data.vcpus_used,},
                            {value: data.vcpus - data.vcpus_used,},
                        ]
                    },
                    {
                        name: '内存',
                        type: 'pie',
                        radius: [30, 50],
                        center: ['50%', '50%'],
                        data: [

                            {value: data.memory_mb_used, },
                            {value: data.memory_mb - data.memory_mb_used, },
                        ]
                    },
                    {
                        name: '卷储存',
                        type: 'pie',
                        radius: [30, 50],
                        center: ['75%', '50%'],
                        data: [
                            {value: data.local_gb_used, },
                            {value: data.local_gb - data.local_gb_used, },
                        ]
                    }
                ]
            });
        });
    }


    render() {
        return (
            <div id='CloudSource'></div>
        );
    }

}

export default CloudSource;