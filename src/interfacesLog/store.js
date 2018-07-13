import {observable,action,runInAction,configure} from 'mobx';
import {notification} from 'antd';
import {baseUrl,get,post,message} from '../util';

//import {configure} from "mobx/lib/mobx";

configure({ enforceActions: true });

export class InterfacesLogStory{
  constructor(rootStore){
    this.rootStore=rootStore;
  }

  @observable
  allInterfacesLog=[];

  @observable
  logTotal='';

  @observable
  refreshLog=false;

  @observable
  systemName='';

  @observable
  statusName='';

  @observable
  interfacesName='';

  @observable
  allSystems=[];

  @observable
  allStatus=[];

  @observable
  allInterfaces=[];

  @observable
  queryLog=[];

  @observable
  detailLog=false;

  @observable
  logRecord=[];


  @action
  initAllInterfacesLog=async ()=>{
    let json=await get(`${baseUrl}/interfacesLog/getInterfacesLog`);
    runInAction(
      ()=>{
        this.allInterfacesLog=json;
        this.logTotal=json.length;
      }
    )
    console.log("this.allInterfacesLog的值为:",this.allInterfacesLog);
  };

  /*@action
    getLogTotal=async ()=>{
     let json=await get(`${baseUrl}/interfacesLog/logTotal`);
     runInAction(
       ()=>{this.logTotal=json;}
     )
      console.log("logTotal的值为:",this.logTotal);
    };
*/
  @action
  getRefreshLog=async ()=>{
    let json=await get(`${baseUrl}/interfacesLog/refreshLog`);
    if(json.success){
      notification.success({
        message:'刷新成功'})
    }else{
      notification.error({
        message:'后台错误，请联系管理员'
      })
    }
    this.initAllInterfacesLog();
  };

  @action
  setSystemName=(name)=>{
    this.systemName=name;
  };

  @action
  setStatus=(name)=>{
    this.statusName=name;
  };

  @action
  setInterfacesName=(name)=>{
    this.interfacesName=name;
  };


  @action
  initAllsystem=async ()=>{
    let json=await get(`${baseUrl}/interfacesLog/allSystem`);
    runInAction(()=>{
      this.allSystems=json;
    })
  };

  @action
  initAllstatus=async ()=>{
    let json=await get(`${baseUrl}/interfacesLog/allStatus`);
    runInAction(()=>{
      this.allStatus=json;
    })
  };

  @action
  initAllInterfaces=async ()=>{
    let json=await get(`${baseUrl}/interfacesLog/allInterfaces`);
    runInAction(()=>{
      this.allInterfaces=json;
    })
  };

  @action
  loadQueryLog=async ()=> {
    let json = await post(`${baseUrl}/interfacesLog/queryLog`, {
      systemName: this.systemName,
      statusName: this.statusName
    });
    //console.log("loadQueryLog中json的值为:",json);
    runInAction(() => {
      this.allInterfacesLog = json;
      this.logTotal=json.length;
    })
  };

  @action
  loadDtailLog=(record)=>{
    const logDate=new Date(record.invoke_date)
    const Y=logDate.getFullYear()+'-';
    const M=(logDate.getMonth()+1 < 10 ? '0'+(logDate.getMonth()+1) : logDate.getMonth()+1) + '-';
    const D=(logDate.getDate()<10? '0'+(logDate.getDate()):logDate.getDate())+' ';
    const h=(logDate.getHours()<10? '0'+(logDate.getHours()):logDate.getHours())+':';
    const m=(logDate.getMinutes()<10? '0'+(logDate.getMinutes()):logDate.getMinutes())+':';
    const s=(logDate.getSeconds()<10? '0'+(logDate.getSeconds()):logDate.getSeconds());
    const date=Y+M+D+h+m+s;
    record.invoke_date=date;
    this.logRecord=record;
    this.toggleDetailLog();
  };

  @action
  toggleDetailLog=()=>{
    this.detailLog=!this.detailLog;
  }

}
