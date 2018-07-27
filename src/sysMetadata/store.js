import {observable, configure,action,runInAction,} from 'mobx';
import {baseUrl,get,post} from '../util';
import {notification} from "antd/lib/index";
import {message, Modal} from 'antd';

configure({ enforceActions: true });

export class SysmetadataStore{

    @observable
    metadata=[];

    @observable
    currentMetadata;

    @observable
    currentMetadataFields=[];

    systemId;

    databaseType;

    proType;

    @observable
    allDatabaseType=[];



    @observable
    allProType=[];

    @observable
    metadataType;

    @observable
    allSystems=[];

    @observable
    loading = false;

    @observable
    loadingMessage='';

    @action
    setMetadataType=async (type)=>{
        runInAction(()=>{
            this.metadataType=type;
        });
    };

    setSystemId=(id)=>{
        this.systemId=id;
    };

    setProType=(type)=>{
        this.proType=type;
    };

    setDataBaseType=(type)=>{
      this.databaseType=type;
    };

    @action
    loadMetada=async ()=>{
        let json=await post(`${baseUrl}/metadata/queryMetadata`,{
                  systemId:this.systemId,
                  metadataType:this.metadataType,
                  databaseType:this.databaseType,
                  proType:this.proType
            });
        runInAction(()=>{
            this.metadata=json;
        })
    };

    @action
    loadMetadataFields=async (metadataId)=>{
        let json=await get(`${baseUrl}/metadata/metadataFields/${metadataId}`);
        runInAction(()=>{
            this.currentMetadataFields=json;
        })
    };

    @action
    initAllsystem=async ()=>{
        let json=await get(`${baseUrl}/sys/allSystem`);
        runInAction(()=>{
            this.allSystems=json;
        })
    };

    @action
    initAlldataBaseType=async ()=>{
        let json=await get(`${baseUrl}/dic/getDictionary/1`);
        runInAction(()=>{
            this.allDatabaseType=json;
        })
    };

    @action
    initAllProType=async ()=>{
        let json=await get(`${baseUrl}/dic/getDictionary/2`);
        runInAction(()=>{
            this.allProType=json;
        })
    };

    @action
    synMetadata=async (metadataType)=>{
      if(metadataType==='1'){//系统元数据
        let interfaceConfig=await get(`${baseUrl}/interfaceConfig/2`);
        for(let i of interfaceConfig){
          let json = await post(`${baseUrl}/invoke/${i.interfaceName}`);
          let result=await post(`${baseUrl}/interfaces`,json);
          //console.log("result的值为:",result);
        }
      }else if(metadataType==='2'){//专业元数据
        let interfaceName='';
        let interfaceConfig=await get(`${baseUrl}/interfaceConfig/3`);
        for(let i of interfaceConfig){
          let json = await post(`${baseUrl}/invoke/${i.interfaceName}`);
          let result=await post(`${baseUrl}/interfaces`,json);
          //console.log("result1的值为:",result);
        }
      }
    };

    @action
    manuSynInterfaces=(metadataType)=>(
      async ()=>{
        runInAction(()=>{
          this.loading = true;
          this.loadingMessage = '正在同步元数据信息...';
        });
          let interfaceConfig=await get(`${baseUrl}/interfaceConfig/2`);
          let error1=[];//存调获取元数据接口失败时哪些平台有问题
          let error2=[];//存同步元数据接口失败时哪些平台有问题
          let success=[];//存同步元数据接口成功时哪些平台成功
          for(let i of interfaceConfig){
            let json = await post(`${baseUrl}/invoke/${i.interfaceName}`);
            //console.log("json的值为:",i.systemName,json);
            if(json===undefined){
              error1.push(i.systemName);
            }else if(json.code===500){
              error1.push(i.systemName);
            }else if(json.reqdata.status===404){
              error1.push(i.systemName);
            }

            let result=await post(`${baseUrl}/interfaces`,json);
            //console.log("result的值为:",i.systemName,result);
            if(result===undefined){
              error2.push(i.systemName);
            }else if(result.status==='801'){
              success.push(i.systemName);
            }else if(result.status==='806'){
              error2.push(i.systemName);
            }
          }
          if(success.length===interfaceConfig.length){
            otification.success({
              message:'同步成功',
            });
            runInAction(()=>{
              this.loading=false;
            })
          }else if(error1.length!==0&&error2.length!==0&&success.length!==0){
            Modal.warning({title: `${error1.join(', ')}获取元数据失败;${error2.join(', ')}同步元数据失败;${success.join(', ')}同步元数据成功`},
              );
            runInAction(()=>{
              this.loading=false;
            })
          }else if(error1.length===0&&error2.length!==0&&success.length!==0){
            Modal.warning({title: `${error2.join(', ')}同步元数据失败;${success.join(', ')}同步元数据成功`},
            );
          }else if(error1.length!==0&&error2.length===0&&success.length!==0){
            Modal.warning({title: `${error1.join(', ')}获取元数据失败;${success.join(', ')}同步元数据成功`},
            );
          }
      }
    )
}
