import {observable,action,runInAction,} from 'mobx';
import {notification} from 'antd';
import {baseUrl,get,post} from '../util';

export class DaibanLogStore{
  constructor(rootStore){
    this.rootStore=rootStore;
  }
  @observable
  allDaibanLog=[];

  @observable
  logTotal='';

  @observable
  loginName='';

  @observable
  daibanStatus='';

  @observable
  allLoginName=[];

  @observable
  allDaibanStatus=[];

  @observable
  detailDaibanLog=false;

  @observable
  logRecord=[];

  @action
  initAllDaibanLog=async ()=>{
    let json=await get(`${baseUrl}/daibanLog/getAllDaibanLog`);
    runInAction(()=>{
        this.allDaibanLog=json;
        this.logTotal=json.length;
      }
    )
  }

  @action
  getRefreshDaibanLog=async ()=>{
    this.initAllDaibanLog();
    notification.success({
      message:'刷新成功'})
  }

  @action
  setLoginName=(loginName)=>{
    this.loginName=loginName;
  }

  @action
  setDaibanStatus=(daibanStatus)=>{
    this.daibanStatus=daibanStatus;
  }

  @action
  initAllLoginName=async ()=>{
    let json=await get(`${baseUrl}/daibanLog/getAllLoginName`);
    runInAction(()=>{
        this.allLoginName=json;
      }
    );
  }

  @action
  initDaibanStatus=async ()=>{
    let json=await get(`${baseUrl}/daibanLog/getDaibanStatus`);
    runInAction(()=>{
        this.allDaibanStatus=json;
      }
    );
  }

  @action
  loadQuerySystemLog=async ()=>{
    let json=await post(`${baseUrl}/daibanLog/queryDaibanLog`,{
      loginName:this.loginName,
      daibanStatus:this.daibanStatus
    });
    runInAction(()=>{
        this.allDaibanLog=json;
        this.logTotal=json.length;
      }
    );
  }

  @action
  toggleDetailSystemLog=()=>{
    this.detailDaibanLog=!this.detailDaibanLog;
  }

  @action
  loadDetailDaibanLog=(record)=>{
    const logDate=new Date(record.create_time);
    const Y=logDate.getFullYear()+'-';
    const M=(logDate.getMonth()+1 < 10 ? '0'+(logDate.getMonth()+1) : logDate.getMonth()+1) + '-';
    const D=(logDate.getDate()<10? '0'+(logDate.getDate()):logDate.getDate())+' ';
    const h=(logDate.getHours()<10? '0'+(logDate.getHours()):logDate.getHours())+':';
    const m=(logDate.getMinutes()<10? '0'+(logDate.getMinutes()):logDate.getMinutes())+':';
    const s=(logDate.getSeconds()<10? '0'+(logDate.getSeconds()):logDate.getSeconds());
    const date=Y+M+D+h+m+s;
    record.create_time=date;
    this.logRecord=record;
    this.toggleDetailSystemLog();
  }
}
