import {observable,action,runInAction,configure} from 'mobx';
import {baseUrl, get, post} from '../util';
import {notification} from 'antd';

configure({enforceActions: true});

export class HomeStore{
  constructor(rootStore){
    this.rootStore = rootStore;
  }


  @observable
  dataBD = [
    { name: 'Oracle', value: 0 },
    { name: 'MySQL', value: 0 },
    { name: 'Mongo', value: 0 },
    { name: 'HBase', value: 0 }
  ];

  @observable
  dataCM = [
    { type: 'CPU', unit: '个', values: [0, 0] },
    { type: '内存', unit: 'MB', values: [0, 0] },
    { type: '存储', unit: 'GB', values: [0, 0] },
    { type: 'CPU', unit: '个', values: [0, 0] },
  ];

  @observable
  slicePics = null;

    @action
    loadCMData = async (isAdmin) => {
        let json = await post(`${baseUrl}/invoke/cloud_monitor`);
        if(json.UserSourceMsg && json.UserSourceMsg.totalCores !== undefined){
            let data;
            if (isAdmin) {
                let a = json.CloudSource;
                data = [
                    { type: 'CPU', unit: '个', values: [a.vcpus, a.vcpus_used] },
                    { type: '内存', unit: 'MB', values: [a.memory_mb, a.memory_mb_used] },
                    { type: '存储', unit: 'GB', values: [a.local_gb, a.local_gb_used] }
                ]
            } else {
                let a=json.UserSourceMsg;
                data = [
                    { type: 'CPU', unit: '个', values: [a.totalCores, a.coreUsed] },
                    { type: '内存', unit: 'MB', values: [a.totalRAMSize, a.ramused] },
                    { type: '存储', unit: 'GB', values: [a.totalVolumeStorage, a.volumeStorageUsed] },
                    { type: '实例', unit: '个', values: [a.totalInstances, a.instanceUsed] }
                ]
            }
            runInAction(()=>{
                this.dataCM = data
            });
        }
    };


  @action
  loadBDData = async () => {
      let json=await post(`${baseUrl}/invoke/data_monitor`);
      if(json['type_2']){
          runInAction(()=> {
            this.dataBD = [
              { name: 'MySQL', value: json['type_2']['mysql']['table_numbers'] },
              { name: 'Oracle', value: json['type_2']['oracle']['table_numbers'] },
              { name: 'Mongo', value: json['type_2']['mongo']['table_numbers'] },
              { name: 'HBase', value: json['type_2']['hbase']['table_numbers'] }
            ]
          });
      }
  };

  @action
  loadSlicePics = async () => {
    let json=await get(`${baseUrl}/screen/picture`);
    if (json) {
      runInAction(() => {
        this.slicePics = json.list
      })
    }
  }

    //自监控数据
    @observable
    selfMonitor=[];

    @observable
    isLoadingMonitor=false;

    @action
    loadSelfMonitor=async ()=>{
        runInAction(()=>{
            this.isLoadingMonitor=true;
        });
        let json=await post(`${baseUrl}/invoke/self_monitor_list_api`,{});
        runInAction(()=>{
            this.selfMonitor=json;
            if(json[0].status){
                this.selfMonitor=[];
                notification.error({
                    message: `云平台权限认证失败,请刷新重试!`
                });
            }
            this.isLoadingMonitor=false;
        });
    };
}
