import {observable, configure,action,runInAction,} from 'mobx';
import {baseUrl,post,getPathById} from '../util';
import {notification} from 'antd';


configure({ enforceActions: true });

export class SpecialtyMetdataStore{

    @observable
    treeData=[];

    @observable
    currentMetdata=[];


    @observable
    currentTreeName='';

    @observable
    isLoading=false;

    @observable
    loadingTree=false;

    @observable
    currentRoute=[];

    @action
    loadTree=async ()=>{
        this.loadingTree=true;
        let json=await post(`${baseUrl}/invoke/specialty_metdata_dir_api`,{});
        runInAction(()=>{
            this.treeData=json;
            this.loadingTree=false;
        });
    };

    @action
    treeSelect=async (selectedKeys,e)=>{
        this.treeData.filter(d=>d).forEach(data=>{
            getPathById(e.node.props.dataRef.ID,Object.create(data),(result)=>{
                runInAction(()=>{
                    this.currentRoute=result;
                    console.log(result);
                });
            },'ID')
        });
        this.currentTreeName=e.node.props.dataRef.NAME;
        if(e.node.props.dataRef['LX']==='1'){
            this.isLoading=true;
            try{
                let json=await post(`${baseUrl}/invoke/specialty_metdata_api`,{id:e.node.props.dataRef.ID});
                runInAction(()=>{
                    this.currentMetdata=json;
                    this.isLoading=false;
                })
            }catch (e){
                runInAction(()=>{
                    this.currentMetdata=[];
                    this.isLoading=false;
                });
                notification.error({
                    message:'调用专业数据库管理系统接口错误!'});
            }

        }else{
            this.currentMetdata=[];
            notification.info({
                message:'当前节点下没有对应的元数据'});
        }


    };

}