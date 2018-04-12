import {observable, useStrict,action,runInAction,} from 'mobx';
import {baseUrl,get,post} from '../util';

useStrict(true);

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




}