import {observable,action,runInAction,configure} from 'mobx';
import {baseUrl,get,post} from '../util';

configure({ enforceActions: true });

export class HomeStore{
  constructor(rootStore){
    this.rootStore=rootStore;
  }
  @observable
  cloudManage = {
    instance: { total: 0, used: 0 },
    cpu: { total: 0, used: 0 },
    ram: { total: 0, used: 0 },
    storage: { total: 0, used: 0 },
  };

  @observable
  bigData = {
    hdfs: { total: 0, used: 0 },
    instance: [],
  };

  @action
  loadCloud=async()=>{
      let json=await post(`${baseUrl}/invoke/cloud_monitor`);
      if(json.UserSourceMsg && json.UserSourceMsg.totalInstances){
          let a=json.UserSourceMsg;
          runInAction(()=>{
              this.cloudManage={
                  instance: { total: a.totalInstances, used: a.instanceUsed },
                  cpu: { total: a.totalCores, used: a.coreUsed },
                  ram: { total: a.totalRAMSize, used: a.ramused },
                  storage: { total: a.totalVolumeStorage, used: a.volumeStorageUsed },
              }
          });
      }
  };

  @action
  loadData=async()=>{
      let json=await post(`${baseUrl}/invoke/data_monitor`);
      if(json['type_1'] && json['type_2']){
          runInAction(()=>{
              this.bigData= {
                  hdfs: {
                      total: json['type_2'].hdfs.schema_info.map(d=>d.value).reduce((a,b)=>a+b),
                      used: json['type_2'].hdfs.schema_info.filter(d=>d.name==='hdfs_use').map(d=>d.value)[0] },
                  instance: [
                      { type: '数据清洗', total: 12, success: 8, used: 0 },
                      { type: '数据接入', total: 16, success: 15, used: 0 },
                      { type: '工作流', total: 7, success: 6, used: 3 },
                      { type: '任务调度', total: 4, success: 4, used: 0 },
                  ],
              }
          });
      }
  };

  @action
  initHomeData = async ()=>{
    let json = await new Promise((resolve => {
      setTimeout(() => {
        // 首页数据
        resolve({
          success: true,
          cloudManage: {
            instance: { total: 10, used: 5 },
            cpu: { total: 1, used: 0.36 },
            ram: { total: 64, used: 22.2 },
            storage: { total: 10240, used: 4780 },
          },
          bigData: {
            hdfs: { total: 18, used: 7.62 },
            instance: [
              { type: '数据清洗', total: 12, success: 8, used: 0 },
              { type: '数据接入', total: 16, success: 15, used: 0 },
              { type: '工作流', total: 7, success: 6, used: 3 },
              { type: '任务调度', total: 4, success: 4, used: 0 },
            ],
          },
        })
      }, 1000);
    }));
    runInAction(()=>{
      //this.cloudManage = json.cloudManage;
      this.bigData = json.bigData;
    })
  }
}
