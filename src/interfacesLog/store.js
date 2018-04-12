import {observable,action,runInAction,} from 'mobx';
import {notification} from 'antd';
import {baseUrl,get,post} from '../util';
//import {useStrict} from "mobx/lib/mobx";

//useStrict(true);
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
  interfacesName='';

  @observable
  allSystems=[];

  @observable
  allInterfaces=[];

  @observable
  queryLog=[];


  @action
  initAllInterfacesLog=async ()=>{
    let json=await get(`${baseUrl}/interfacesLog/getInterfacesLog`);
    runInAction(
      ()=>{
        this.allInterfacesLog=json;
        this.logTotal=json.length;
      }
    )
   console.log("initAllInterfacesLog中logTotal的值为:",this.logTotal);
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
         interfacesName: this.interfacesName
       });
       //console.log("loadQueryLog中json的值为:",json);
       runInAction(() => {
         this.allInterfacesLog = json;
       })
     };

}
