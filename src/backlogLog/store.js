import {observable,action,runInAction,} from 'mobx';
import {notification} from 'antd';
import {baseUrl,get,post} from '../util';

export class BacklogLogStore{
  constructor(rootStore){
    this.rootStore=rootStore;
  }
  @observable
  allBacklogLog=[];

  @observable
  logTotal='';

  @observable
  loginName='';

  @observable
  backlogStatus='';

  @observable
  allLoginName=[];

  @observable
  allBacklogStatus=[];

  @observable
  detailBacklogLog=false;

  @observable
  logRecord=[];

  @action
  initAllBacklogLog=async ()=>{
    let json=await get(`${baseUrl}/backlogLog/getAllBacklogLog`);
    runInAction(()=>{
        this.allBacklogLog=json;
        this.logTotal=json.length;
      }
    )
  };

  @action
  getRefreshBacklogLog=async ()=>{
    this.initAllBacklogLog();
    notification.success({
      message:'刷新成功'})
  };

  @action
  setLoginName=(loginName)=>{
    this.loginName=loginName;
  };

  @action
  setBacklogStatus=(BacklogStatus)=>{
    this.backlogStatus=BacklogStatus;
  };

  @action
  initAllLoginName=async ()=>{
    let json=await get(`${baseUrl}/backlogLog/getAllLoginName`);
    runInAction(()=>{
        this.allLoginName=json;
      }
    );
  };

  @action
  initBacklogStatus=async ()=>{
    let json=await get(`${baseUrl}/backlogLog/getBacklogStatus`);
    runInAction(()=>{
        this.allBacklogStatus=json;
      }
    );
  };

  @action
  loadQuerySystemLog=async ()=>{
    let json=await post(`${baseUrl}/backlogLog/queryBacklogLog`,{
      loginName:this.loginName,
      backlogStatus:this.backlogStatus
    });
    runInAction(()=>{
        this.allBacklogLog=json;
        this.logTotal=json.length;
      }
    );
    if(json.length>=0){
      notification.success({
        message:'查询成功'})
    }else{
      notification.error({
        message:'后台错误，请联系管理员'
      })
    }
  };

  @action
  toggleBacklogSystemLog=()=>{
    this.detailBacklogLog=!this.detailBacklogLog;
  };

  @action
  loadDetailBacklogLog=(record)=>{
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
    this. toggleBacklogSystemLog();
  }
}
