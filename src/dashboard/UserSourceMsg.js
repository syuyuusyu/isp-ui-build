import React from 'react';
import {inject, observer} from 'mobx-react';
import echarts from 'echarts';
import {convertGigaFormat} from '../util';

@inject('rootStore')
@observer
class UserSourceMsg extends React.Component {

    componentDidMount() {
        const store = this.props.rootStore.dashBoardStore;
        let dev = document.getElementById('UserSourceMsg');
        console.log(dev.clientWidth, dev.parentNode.clientHeight);
        let canvas = document.createElement(`div`);
        canvas.setAttribute('style', `width: ${dev.clientWidth}px;height:${dev.parentNode.clientHeight}px;`);
        dev.appendChild(canvas);

        store.once('UserSourceMsg', data => {
            console.log(data);
            //实列 vcpu 内存 卷储蓄
            var myChart = echarts.init(canvas);
            myChart.setOption({
                title: [
                    {
                        text: '用户总资源池',
                        subtext: '',
                        x: 'center'
                    },
                    {
                        text: '实列',
                        textStyle: {
                            fontWeight: 'normal'
                        },
                        subtext: `使用${data.instanceUsed}\n共(${data.totalInstances})`,
                        x: '20%',
                        y: '75%',
                        textAlign: 'center'
                    }, {
                        text: `${((data.instanceUsed / data.totalInstances) * 100).toFixed(2)}%`,
                        textStyle: {
                            fontWeight: 'lighter',
                            fontSize: 14
                        },
                        x: '20%',
                        y: '48%',
                        textAlign: 'center',

                    }, {
                        text: 'VCPU',
                        textStyle: {
                            fontWeight: 'normal'
                        },
                        subtext: `使用${data.coreUsed}\n共(${data.totalCores})`,
                        x: '40%',
                        y: '75%',
                        textAlign: 'center'
                    }, {
                        text: `${((data.coreUsed / data.totalCores) * 100).toFixed(2)}%`,
                        textStyle: {
                            fontWeight: 'lighter',
                            fontSize: 14
                        },
                        x: '40%',
                        y: '48%',
                        textAlign: 'center',


                    }, {
                        text: '内存',
                        textStyle: {
                            fontWeight: 'normal'
                        },
                        subtext: `使用${convertGigaFormat(data.ramused * 1024)}\n共(${convertGigaFormat(data.totalRAMSize * 1024)})`,
                        x: '60%',
                        y: '75%',
                        textAlign: 'center'
                    }, {
                        text: `${((data.ramused / data.totalRAMSize) * 100).toFixed(2)}%`,
                        textStyle: {
                            fontWeight: 'lighter',
                            fontSize: 14
                        },
                        x: '60%',
                        y: '48%',
                        textAlign: 'center',

                    }, {
                        text: '卷储存',
                        textStyle: {
                            fontWeight: 'normal'
                        },
                        subtext: `使用${convertGigaFormat(data.volumeStorageUsed * 1024 * 1024)}\n共(${convertGigaFormat(data.totalVolumeStorage * 1024 * 1024)})`,
                        x: '80%',
                        y: '75%',
                        textAlign: 'center'
                    }, {
                        text: `${((data.volumeStorageUsed / data.totalVolumeStorage) * 100).toFixed(2)}%`,
                        textStyle: {
                            fontWeight: 'lighter',
                            fontSize: 14
                        },
                        x: '80%',
                        y: '48%',
                        textAlign: 'center',
                    }
                ],
                calculable: true,
                series: [
                    {
                        name: '实列',
                        type: 'pie',
                        radius: [30, 50],
                        center: ['20%', '50%'],
                        data: [
                            {value: data.instanceUsed,},
                            {value: data.totalInstances - data.instanceUsed,},
                        ]
                    },
                    {
                        name: 'VCPU',
                        type: 'pie',
                        radius: [30, 50],
                        center: ['40%', '50%'],
                        data: [
                            {value: data.coreUsed,},
                            {value: data.totalCores - data.coreUsed,},
                        ]
                    },
                    {
                        name: '内存',
                        type: 'pie',
                        radius: [30, 50],
                        center: ['60%', '50%'],
                        data: [

                            {value: data.ramused,},
                            {value: data.totalRAMSize - data.ramused,},
                        ]
                    },
                    {
                        name: '卷储存',
                        type: 'pie',
                        radius: [30, 50],
                        center: ['80%', '50%'],
                        data: [
                            {value: data.volumeStorageUsed,},
                            {value: data.totalVolumeStorage - data.volumeStorageUsed,},
                        ]
                    }
                ]
            });
        });


    }







    render() {
        return (
            <div id='UserSourceMsg'></div>
        );
    }

}

export default UserSourceMsg;