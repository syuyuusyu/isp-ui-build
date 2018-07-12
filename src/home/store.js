import {observable,action,runInAction,configure} from 'mobx';
import {baseUrl, get, post} from '../util';

configure({ enforceActions: true });

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
          let a=json.UserSourceMsg;
          runInAction(()=>{
              let data = [
                { type: 'CPU', unit: '个', values: [a.totalCores, a.coreUsed] },
                { type: '内存', unit: 'MB', values: [a.totalRAMSize, a.ramused] },
                { type: '存储', unit: 'GB', values: [a.totalVolumeStorage, a.volumeStorageUsed] }
              ];
              if (!isAdmin) {
                data.push({ type: '实例', unit: '个', values: [a.totalInstances, a.instanceUsed] })
              }
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
              { name: 'Oracle', value: json['type_2']['oracle']['table_numbers'] },
              { name: 'MySQL', value: json['type_2']['mysql']['table_numbers'] },
              { name: 'Mongo', value: json['type_2']['mongo']['table_numbers'] },
              { name: 'HBase', value: json['type_2']['hbase']['table_numbers'] }
            ]
          });
      }
  };

  @action
  loadSlicePics = async () => {
    let json=await post(`${baseUrl}/screen/picture`);
    if (json) {
      runInAction(() => {
        this.slicePics = json.list
      })
    }
  }
}
