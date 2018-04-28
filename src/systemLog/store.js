import {observable,action,runInAction,configure} from 'mobx';
import {notification} from 'antd';
import {baseUrl,get,post} from '../util';

configure({ enforceActions: true });

export class SystemLogStore{
  constructor(rootStore){
    this.rootStore=rootStore;
  }
  @observable
  allSystemLog=[];

  @observable
  logTotal='';

  @observable
  loginName='';

  @observable
  operateType='';

  @observable
  allLoginName=[];

  @observable
  allOperateType=[];

  @observable
  detailSystemLog=false;

  @observable
  logRecord=[];

  @action
  initAllSystemLog=async ()=>{
    let json=await get(`${baseUrl}/systyemLog/getAllSystemLog`);
    runInAction(()=>{
        this.allSystemLog=json;
        this.logTotal=json.length;
      }
      )
  }

  @action
  getRefreshSystemLog=async ()=>{
    this.initAllSystemLog();
    notification.success({
      message:'刷新成功'})
  }

   @action
  setLoginName=(loginName)=>{
    this.loginName=loginName;
  }

  @action
  setOperateType=(operateName)=>{
    this.operateType=operateName;
  }

  @action
  initAllLoginName=async ()=>{
    let json=await get(`${baseUrl}/systyemLog/getAllLoginName`);
    runInAction(()=>{
        this.allLoginName=json;
      }
    );
  }

  @action
  initOperateType=async ()=>{
    let json=await get(`${baseUrl}/systyemLog/getAllOperateType`)
    runInAction(()=>{
        this.allOperateType=json;
      }
    );
  }

  @action
  loadQuerySystemLog=async ()=>{
    let json=await post(`${baseUrl}/systyemLog/querySystemLog`,{
      loginName:this.loginName,
      operateType:this.operateType
    });
    runInAction(()=>{
      this.allSystemLog=json;
      this.logTotal=json.length;
      }
    );
  }

  @action
  toggleDetailSystemLog=()=>{
    this.detailSystemLog=!this.detailSystemLog;
  }

  @action
  loadDetailSystemLog=(record)=>{
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
    this.toggleDetailSystemLog();
  }



}
