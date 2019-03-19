import {observable, action, runInAction, configure, computed} from 'mobx';
import {baseUrl, get, post,isGov} from '../util';
import {notification} from 'antd';


configure({enforceActions: true});

export class HomeStore {
    constructor(rootStore) {
        this.rootStore = rootStore;
    }


    @observable
    dataBD = [
        {name: 'Oracle', value: 0},
        {name: 'MySQL', value: 0},
        {name: 'Mongo', value: 0},
        {name: 'HBase', value: 0}
    ];

    @observable
    dataCM = [
        {type: 'CPU', unit: '个', values: [0, 0]},
        {type: '内存', unit: 'MB', values: [0, 0]},
        {type: '存储', unit: 'GB', values: [0, 0]},
        {type: 'CPU', unit: '个', values: [0, 0]},
    ];


    @action
    loadCMData = async (isAdmin) => {
        let json = await post(`${baseUrl}/invoke/cloud_monitor`);
        if (json.UserSourceMsg && json.UserSourceMsg.totalCores !== undefined) {
            let data;
            if (isAdmin) {
                let a = json.CloudSource;
                data = [
                    {type: 'CPU', unit: '个', values: [a.vcpus, a.vcpus_used]},
                    {type: '内存', unit: 'MB', values: [a.memory_mb, a.memory_mb_used]},
                    {type: '存储', unit: 'GB', values: [a.local_gb, a.local_gb_used]}
                ]
            } else {
                let a = json.UserSourceMsg;
                data = [
                    {type: 'CPU', unit: '个', values: [a.totalCores, a.coreUsed]},
                    {type: '内存', unit: 'MB', values: [a.totalRAMSize, a.ramused]},
                    {type: '存储', unit: 'GB', values: [a.totalVolumeStorage, a.volumeStorageUsed]},
                    {type: '实例', unit: '个', values: [a.totalInstances, a.instanceUsed]}
                ]
            }
            runInAction(() => {
                this.dataCM = data
            });
        }
    };


    @action
    loadBDData = async () => {
        let json = await post(`${baseUrl}/invoke/data_monitor`);
        if (json['type_2']) {
            runInAction(() => {
                this.dataBD = [
                    {name: 'MySQL', value: json['type_2']['mysql']['table_numbers']},
                    {name: 'Oracle', value: json['type_2']['oracle']['table_numbers']},
                    {name: 'Mongo', value: json['type_2']['mongo']['table_numbers']},
                    {name: 'HBase', value: json['type_2']['hbase']['table_numbers']}
                ]
            });
        }
    };


    slicePics = null;

    smapslicePics = null;

    @observable
    actityTable = 0;

    setActityTable = (v) => action(() => {
        this.actityTable = v
    });



    @action
    loadSlicePics = async () => {
        //替换成中地发布的接口
        //let json = await get(`${baseUrl}/screen/picture`);
        let json = await post(`${baseUrl}/invoke/zdServiceInfo_api`);
        if (json) {
            runInAction(()=>{
                this.slicePics = json.list.map(arr=>{
                    if(isGov){
                        arr[0]=arr[0].replace('10.10.50.5','59.216.201.50');
                        arr[2]=arr[2].replace('10.10.50.5','59.216.201.50');
                    }
                    return arr;
                })
            });

        } else {
            runInAction(()=>{
                this.slicePics = null;
            });


        }
        this.setActityTable(1);
    };


    @action
    loadSmapSlicePics = async () => {
        //超图地图服务
        let json = await post(`${baseUrl}/invoke/services_rjson_api`);
        if (json) {
            runInAction(()=>{
                this.smapslicePics = json.list.map(arr=>{
                    if(isGov){
                        arr[0]=arr[0].replace('10.10.50.21:8090','59.216.201.50:3087');
                        arr[2]=arr[2].replace('10.10.50.21:8090','59.216.201.50:3087');
                    }
                    return arr;
                });
                this.smapslicePics = json.list
            });

        } else {
            runInAction(()=>{
                this.smapslicePics = null;
            });

        }
        this.setActityTable(0);
    };


    //自监控数据
    @observable
    selfMonitor = [];

    @observable
    isLoadingMonitor = false;

    @action
    loadSelfMonitor = async () => {
        runInAction(() => {
            this.isLoadingMonitor = true;
        });
        let json = await post(`${baseUrl}/invoke/self_monitor_list_api`, {});
        runInAction(() => {
            this.selfMonitor = json;
            if (json[0].status) {
                this.selfMonitor = [];
                notification.error({
                    message: `云平台权限认证失败,请刷新重试!`
                });
            }
            this.isLoadingMonitor = false;
        });
    };
}


