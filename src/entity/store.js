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

    //----------------------
    //entityTable
    allDictionary=[];

    @observable
    entitys=[];

    @action
    loadEntitys=async ()=> {
        get(`${baseUrl}/entity/allDictionary`).then(json=>this.allDictionary=json);
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
    })






}