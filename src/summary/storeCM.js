import {observable, action, runInAction, configure} from 'mobx';
import {Message} from 'antd';
import {baseUrl, get, post} from '../util';

configure({enforceActions: true});

export default class SummaryStoreCM {
    constructor(rootStore) {
        this.rootStore = rootStore;
    }

    @observable
    currentActiveTable = 0;

    @observable
    cloudManage = {
        instance: {total: 0, used: 0},
        cpu: {total: 0, used: 0},
        ram: {total: 0, used: 0},
        storage: {total: 0, used: 0},
    };

    @observable
    personalSource = [
        {type: 'CPU', values: [1, 0], unit: '个'},
        {type: '内存', values: [1, 0], unit: 'MB'},
        {type: '存储', values: [1, 0], unit: 'GB'},
        {type: '实例', values: [1, 0], unit: '个'},
    ];

    @observable
    totalSource = [
        {type: 'CPU', values: [1, 0], unit: '个'},
        {type: '内存', values: [1, 0], unit: 'GB'},
        {type: '存储', values: [1, 0], unit: 'TB'},
    ];

    @observable
    cpuState = [];

    @observable
    cloudServer = [
        {type: '网络代理', total: 1, used: 0, unit: '个'},
        {type: '块存储', total: 1, used: 0, unit: '个'},
        {type: '镜像服务', total: 1, used: 0, unit: '个'},
        {type: '网络服务', total: 1, used: 0, unit: '个'},
        {type: '计算服务', total: 1, used: 0, unit: '个'},
    ];

    @observable
    topologyData = [];

    @observable
    tpUpdateMark = 0;

    @action
    initSummaryData = async () => {
        const {UserSourceMsg, CloudSource, getCpuInfo, getTopology, getSysMsg} = await post(`${baseUrl}/invoke/cloud_monitor`);
        runInAction(() => {
            if (UserSourceMsg && UserSourceMsg.ok !== false) {
                this.personalSource = [
                    {type: 'CPU', values: [UserSourceMsg.totalCores, UserSourceMsg.coreUsed], unit: '个'},
                    {type: '内存', values: [UserSourceMsg.totalRAMSize, UserSourceMsg.ramused], unit: 'MB'},
                    {
                        type: '存储',
                        values: [UserSourceMsg.totalVolumeStorage, UserSourceMsg.volumeStorageUsed],
                        unit: 'GB'
                    },
                    {type: '实例', values: [UserSourceMsg.totalInstances, UserSourceMsg.instanceUsed], unit: '个'},
                ];
                this.cloudManage={
                    instance: { total: UserSourceMsg.totalInstances, used: UserSourceMsg.instanceUsed },
                    cpu: { total: UserSourceMsg.totalCores, used: UserSourceMsg.coreUsed },
                    ram: { total: UserSourceMsg.totalRAMSize, used: UserSourceMsg.ramused },
                    storage: { total: UserSourceMsg.totalVolumeStorage, used: UserSourceMsg.volumeStorageUsed },
                }
            }
            if (CloudSource && CloudSource.ok !== false) {
                this.totalSource = [
                    {type: 'CPU', values: [CloudSource.vcpus, CloudSource.vcpus_used], unit: '个'},
                    {
                        type: '内存',
                        values: [Math.round(CloudSource.memory_mb / 1024), Math.round(CloudSource.memory_mb_used / 1024)],
                        unit: 'GB'
                    },
                    {
                        type: '存储',
                        values: [(CloudSource.local_gb / 1024).toFixed(2), (CloudSource.local_gb_used / 1024).toFixed(2)],
                        unit: 'TB'
                    },
                ];
            }
            if (getCpuInfo && getCpuInfo.ok !== false) {
                this.cpuState = (() => {
                    let result = [];
                    getCpuInfo.forEach((item) => {
                        result.push({
                            type: item.name,
                            values: (({data, time}) => {
                                let values = [];
                                data.forEach((value, index) => {
                                    if (value !== 'NaN') {
                                        values.push([time[index], value]);
                                    }
                                });
                                return values
                            })(item),
                        })
                    });
                    return result
                })();
            }
            if (getTopology && getTopology.entity !== undefined) {
                this.topologyData = getTopology.entity
            }
            if (getSysMsg && getSysMsg.ok !== false) {
                const {agent, blockStorage, compute, image, network} = getSysMsg;
                const total = agent + blockStorage + compute + image + network;
                this.cloudServer = [
                    {type: '网络代理', total, used: agent, unit: '个'},
                    {type: '块存储', total, used: blockStorage, unit: '个'},
                    {type: '镜像服务', total, used: image, unit: '个'},
                    {type: '网络服务', total, used: network, unit: '个'},
                    {type: '计算服务', total, used: compute, unit: '个'},
                ];
            }
            this.tpUpdateMark += 1;
        });
    };

    @action
    toggleTable = (target) => {
        if (this.currentActiveTable === target) return;
        this.currentActiveTable = target;
    };
}
