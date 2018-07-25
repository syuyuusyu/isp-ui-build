import {observable,action,runInAction,configure} from 'mobx';
import {notification} from 'antd';
import {baseUrl,get,post} from '../util';

configure({ enforceActions: true });

export class MonitorLogStore{
  constructor(rootStore){
    this.rootStore=rootStore;
  }
  @observable
  allMonitorLog=[];

  @observable
  logTotal='';

  @observable
  detailMonitorLog=false;

  @observable
  logRecord=[];

  @observable
  allInstanceName=[];

  @observable
  instanceName='';

  @action
  initAllMonitorLog=async ()=>{
    let json=await get(`${baseUrl}/monitorLog/allMonitorLog`);
    runInAction(()=>{
        this.allMonitorLog=json;
        this.logTotal=json.length;
      }
    );
  };

  @action
  toggleDetailLog=()=>{
    this.detailMonitorLog=!this.detailMonitorLog;
  };

  @action
  loadDtailMonitorLog=(record)=>{
    const logDate=new Date(record.operate_date);
    const Y=logDate.getFullYear()+'-';
    const M=(logDate.getMonth()+1 < 10 ? '0'+(logDate.getMonth()+1) : logDate.getMonth()+1) + '-';
    const D=(logDate.getDate()<10? '0'+(logDate.getDate()):logDate.getDate())+' ';
    const h=(logDate.getHours()<10? '0'+(logDate.getHours()):logDate.getHours())+':';
    const m=(logDate.getMinutes()<10? '0'+(logDate.getMinutes()):logDate.getMinutes())+':';
    const s=(logDate.getSeconds()<10? '0'+(logDate.getSeconds()):logDate.getSeconds());
    const date=Y+M+D+h+m+s;
    record.operate_date=date;
    this.logRecord=record;
    this.toggleDetailLog();
  };

  @action
  initAllInstanceName=async ()=>{
    let json=await get(`${baseUrl}/monitorLog/allInstanceName`);
    runInAction(()=>{
        this.allInstanceName=json;
      }
    );
  };

  @action
  setInstanceName=(instanceName)=>{
    this.instanceName=instanceName;
  }
}
