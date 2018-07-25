import {observable, configure,action,runInAction,} from 'mobx';
import {notification} from 'antd';
import {baseUrl, get, del, post} from '../util';


configure({ enforceActions: true });

export class InvokeOpStore{

    @observable
    currentSys={};

    @observable
    selectRow={};

    @observable
    fromVisible=false;

    @observable
    currentOperations=[];

    @observable
    invokePromissFormVisible=false;

    @observable
    allSystem=[];

    @observable
    targetKeys=[];

    @observable
    selectedKeys=[];

    @observable
    display=true;

    @observable
    loading = false;

    @observable
    loadingMessage='';

    @action
    toggleInvokePromissFormVisible=()=>{
        this.invokePromissFormVisible=!this.invokePromissFormVisible;
    };

    @action
    loadOperationById=async (id)=>{
        let json=await get(`${baseUrl}/op/invokeOperations/${id}`);
        runInAction(()=>{
            this.currentOperations=json;
        });
    };

    @action
    loadCurrentSys=async(sysId)=>{
        let json=await get(`${baseUrl}/sys/currentSys/${sysId}`);
        runInAction(()=>{
            this.currentSys=json[0];
        });
    };

    @action
    toggleFormVisible=()=>{
        this.fromVisible=!this.fromVisible;
    };

    @action
    showForm=(record)=>(()=>{
        runInAction(()=>{
            this.selectRow=record;
        });
        this.toggleFormVisible();
    });

    delete=(id)=>(async ()=>{
        let json=await del(`${baseUrl}/op/delete/${id}`);
        if(json.success){
            notification.success({
                message:'删除成功',
            })
        }else{
            notification.error({
                message:'后台错误，请联系管理员',
            })
        }
        this.loadOperationById(this.currentSys.id);
    });

    @action
    showInvokePromiss=(record)=>(()=>{
        runInAction(()=>{
            this.selectRow=record;
        });
        this.toggleInvokePromissFormVisible();
    });

    @action
    initAllsystem=async ()=>{
        let json=await get(`${baseUrl}/sys/allSystem`);
        runInAction(()=>{
            this.allSystem=json;
        })
    };

    saveInvokePromiss=async ()=>{
        let json=await post(`${baseUrl}/op/saveInvokePromiss`,{operationId:this.selectRow.id,sysIds:this.targetKeys});
        if(json.success){
            notification.success({
                message:'保存成功',
            })
        }else{
            notification.error({
                message:'后台错误，请联系管理员',
            })
        }
        this.toggleInvokePromissFormVisible();
    };

    @action
    loadCurrentInvokePromiss=async ()=>{
        let json=await get(`${baseUrl}/op/invokePromiss/${this.selectRow.id}`) ;
        runInAction(()=>{
            this.targetKeys=json.map(r=>r.system_id);
        });
    };

    @action
    handleChange = (nextTargetKeys, direction, moveKeys) => {
        console.log('handleChange');
        this.targetKeys=nextTargetKeys;

    };

    @action
    handleSelectChange = (sourceSelectedKeys, targetSelectedKeys) => {
        console.log('handleSelectChange');
        this.selectedKeys=[...sourceSelectedKeys, ...targetSelectedKeys];
    };

    @action
    handleScroll = (direction, e) => {
        console.log('direction:', direction);
        console.log('target:', e.target);
    };

    @action
    synInterfaces=async (sysId)=>{
      let interfaceName='';
      let interfaceConfig=await get(`${baseUrl}/interfaceConfig/1`);
      for(let i of interfaceConfig){
        if(i.systemId===sysId){
          interfaceName=i.interfaceName;
          let json = await post(`${baseUrl}/invoke/${interfaceName}`);
          let result=await post(`${baseUrl}/interfaces`,JSON.stringify(json));
          break;
        }
      }
    };

  @action
  manuSynInterfaces=(sysId)=>(
    async ()=>{
      runInAction(()=>{
        this.loading = true;
        this.loadingMessage = '正在同步接口信息...';
      });
      let interfaceName='';
      let interfaceConfig=await get(`${baseUrl}/interfaceConfig/1`);
      for(let i of interfaceConfig){
        if(i.systemId===sysId){
          interfaceName=i.interfaceName;
          let json = await post(`${baseUrl}/invoke/${interfaceName}`);
          if(json===undefined){
            notification.error({
              message:'获取接口信息失败,请尝试刷新页面或联系管理员',
            });
            runInAction(()=>{
              this.loading=false;
            });
            break;
          }
          let result=await post(`${baseUrl}/interfaces`,JSON.stringify(json));
          if(result===undefined){
            notification.error({
              message:'同步失败,请尝试刷新页面或联系管理员',
            });
            runInAction(()=>{
              this.loading=false;
            });
          }else if(result.status==='801'){
            notification.success({
              message:'同步成功',
            });
           runInAction(()=>{
             this.loading=false;
           })
          }else if(result.status==='806'){
            notification.error({
              message:'同步失败，请尝试刷新页面或联系管理员',
            });
            runInAction(()=>{
              this.loading=false;
            })
          }
          break;
        }
      }
    }
  )

}
