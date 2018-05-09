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
      this.cloudManage = json.cloudManage;
      this.bigData = json.bigData;
    })
  }
}
