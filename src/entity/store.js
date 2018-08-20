import {observable, configure, action, runInAction,} from 'mobx';
import {notification} from 'antd';
import {activitiUrl, get, post, del, baseUrl} from '../util';
import axios from 'axios';


configure({enforceActions: true});

notification.config({
    placement: 'topLeft',
});

export class EntityStore {

    constructor(rootStore) {
        this.rootStore = rootStore;
    }

    isFormUpdate=false;

    originalColumns=[];

    //----------------------
    //entityTable
    @observable
    allDictionary=[];

    @observable
    entitys=[];

    @action
    loadEntitys=async ()=> {
        get(`${baseUrl}/entity/originalColumns`).then(json=>this.originalColumns=json);
        let json = await get(`${baseUrl}/entity/entitys`);
        runInAction(()=>{
            this.entitys=json;
        })
    };

    //----------------------
    //columnTable
    @observable
    columnTableVisible=false;

    @observable
    currentEntity={};


    @observable
    currentColumns=[];

    @action
    toggleColumnTableVisible=()=>{
      this.columnTableVisible=!this.columnTableVisible;
    };


    @action
    loadColumns=async ()=>{
        let json=await get(`${baseUrl}/entity/columns/${this.currentEntity.id}`);
        runInAction(()=>{
            this.currentColumns=json;
        });
    };

    checkColumn=(record)=>action(()=>{
        this.currentEntity=record;
        this.toggleColumnTableVisible();
    });

    //-----------------------------
    //columnForm
    @observable
    columnFormVisible=false;

    currentColumn;

    @action
    toggleColumnFormVisible=()=>{
        this.columnFormVisible=!this.columnFormVisible;
    };

    showColumnForm=(isUpdate,record)=>(()=>{
        this.currentColumn=record;
        this.isFormUpdate=isUpdate;
        this.toggleColumnFormVisible();
    });


    //entityForm
    //-------------------------
    @observable
    tableNames=[];

    @observable
    entityFormVisible=false;


    @action
    toggleEntityFormVisible=()=>{
        this.entityFormVisible=!this.entityFormVisible;
    };

    @action
    loadTableNames=async()=>{
        let json=await get(`${baseUrl}/entity/tableNames`);

        runInAction(()=>{
            this.tableNames=json.filter(_=>this.entitys.filter(o=>o.tableName===_.tableName).length===0);
        });
    };

    showEntityForm=(isUpdate,record)=>action(()=>{
        this.currentEntity=record;
        this.isFormUpdate=isUpdate;
        this.toggleEntityFormVisible();
    });

    //dictionaryTable
    //-------------------------
    @observable
    addDicVisible=false;

    @observable
    addDicFieldVisible=false;

    selectDic={};

    selectDicField={};

    @action
    toggleAddDicVisible=()=>{
        this.addDicVisible=!this.addDicVisible;
    };

    @action
    toggleAddDicFieldVisible=()=>{
        this.addDicFieldVisible=!this.addDicFieldVisible;
    };

    showAddDicForm=(record,isUpdate)=>{
       this.selectDic=record;
       this.isFormUpdate=isUpdate;
       this.toggleAddDicVisible();
    };

    showAddDicFieldForm=(record,isUpdate)=>{
        this.selectDicField=record;
        this.isFormUpdate=isUpdate;
        this.toggleAddDicFieldVisible();
    };


    @action
    loadallDictionary=async ()=>{
        let json=await get(`${baseUrl}/entity/allDictionary`);
        runInAction(()=>{
            this.allDictionary=json;
        });
    };

    @observable
    dictionaryTableVisible=false;

    @action
    toggleDictionaryTableVisible=()=>{
        this.dictionaryTableVisible=!this.dictionaryTableVisible;
    };


}