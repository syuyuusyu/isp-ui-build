import React from 'react';
import {observable, configure, action, runInAction,} from 'mobx';
import {Icon,notification,Button,Divider,Popconfirm} from 'antd';
import moment from 'moment';
import 'moment/locale/zh-cn';
import {activitiUrl, get, post, del, baseUrl,evil,getPathById} from '../util';

const antd=require('antd');

configure({enforceActions: true});

export class CommonStore {

    constructor(rootStore) {
        this.rootStore = rootStore;
    }

    @observable
    shouldRender=false;

    @action
    setshouldRender=(flag)=>{
        this.shouldRender=flag;
    };

    //@observable
    allDictionary=[];

    //@observable
    allColumns=[];

    //@observable
    allEntitys=[];

    allMonyToMony=[];

    currentEntity={};

    currentParentEntity={};

    entityId=0;

    @observable
    hasParent=false;

    isParentSame=false;

    setEntityId=(entityId)=>{
        this.entityId=entityId;
    };

    @action
    setCurrentEntity=()=>{
        this.currentEntity = this.allEntitys.filter(d => d.id === this.entityId)[0];
        if(this.currentEntity.parentEntityId){
            this.hasParent=true;
            this.currentParentEntity=this.allEntitys.filter(d => d.id === this.currentEntity.parentEntityId)[0];
            if(this.currentEntity.parentEntityId==this.currentEntity.id){
                this.isParentSame=true;
            }
        }
    };

    loadAllDictionary=async ()=>{
        let json=await get(`${baseUrl}/dictionary/dictionary/0`);
        this.allDictionary=json;
    };

    loadAllColumns=async ()=>{
        let json=await get(`${baseUrl}/entity/columns/0`);
        this.allColumns=json;
    };

    loadAllEntitys=async ()=>{
        let json=await get(`${baseUrl}/entity/entitys`);
        this.allEntitys=json;
        this.setCurrentEntity();
    };

    loadAllMonyToMony=async ()=>{
        let json=await get(`${baseUrl}/entity/monyToMonys`);
        this.allMonyToMony=json;
    };

    @action
    loadCache=async ()=>{
        let dictionary=await get(`${baseUrl}/dictionary/dictionary/0`);
        let columns=await get(`${baseUrl}/entity/columns/0`);
        let entitys=await get(`${baseUrl}/entity/entitys`);
        runInAction(()=>{
            this.allDictionary=dictionary;
            this.allColumns=columns;
            this.allEntitys=entitys;
            this.setCurrentEntity();
        });
    };

    //table
    //--------------------

    @observable
    tableRows=[];

    @observable
    loading=false;

    @observable
    columns=[];

    queryObj={};

    defaultQueryObj={};

    setDefaultQueryObj=(o)=>{
        this.defaultQueryObj=o;
    };

    @observable
    pagination={
        current:1,
        total:0,
        size:'small',
        pageSize:10,
        showTotal:(total, range) => `${range[0]}-${range[1]} of ${total} items`,
        onChange:this.pageChange
    };

    @action
    loadColumns=async ()=>{
        let json=await get(`${baseUrl}/entity/columns/${this.entityId}`);

        runInAction(()=>{

            this.columns=json.filter(c=>c.hidden!='1' && c.columnType!=='text').map(c=>{
                const column={
                    dataIndex:c.columnName,
                    title:c.text?c.text:c.columnName,
                    width:c.width?c.width:100
                };
                if(c.columnType==='timestamp'){
                    column.render=(value,record)=>moment(value).format('YYYY-MM-DD HH:mm:ss');
                }
                if(c.render){
                    column.render=eval('('+c.render+')').callInstance({React,antd});
                }
                if(c.dicGroupId){
                    const currentDictionary=this.allDictionary.filter(d=>d.groupId===c.dicGroupId);
                    column.render=(value,record)=>{
                        return currentDictionary.filter(d=>d.value===value).length===1?
                            currentDictionary.filter(d=>d.value===value)[0].text:value;
                    }
                }
                if(c.foreignKeyId){
                    const foreginNameCol=this.allColumns.find(_=>_.id===c.foreignKeyNameId);
                    const foreginEntityCode=this.allEntitys.find(_=>_.id===foreginNameCol.entityId).entityCode;
                    column.render=(value,record)=>record[`${foreginEntityCode}_${foreginNameCol.columnName}`];
                }
                return column;
            });
            this.columns.push({
                title:'操作',
                width:200,
                render:(text,record)=>{
                    return (
                        <span >
                            <Button icon="edit" onClick={this.showCreateForm(record,true)} size='small'>修改</Button>
                            <Divider type="vertical"/>
                            <Popconfirm onConfirm={this.deleteRow(record[this.currentEntity.idField])} title="确认删除?">
                                <Button icon="delete" onClick={null} size='small'>删除</Button>
                            </Popconfirm>
                        </span>
                    )
                }
            });



        });
    };

    deleteRow=(id)=>(async ()=>{
        let json=await get(`${baseUrl}/entity/deleteEntity/${this.currentEntity.id}/${id}`);
        console.log(json);
        if(json.success){
            notification.info({
                message:'删除成功'});
        }else{
            notification.error({
                message:'删除失败'});
        }
        this.queryTable();
    });


    pageChange=(page, pageSize)=>{
        let start=(page-1)*pageSize;
        this.queryObj={...this.queryObj,page,start,pageSize};
        this.queryTable()
    };

    @action
    queryTable=async ()=>{
        runInAction(()=>{
            this.loading=true;
        });
        let json=await post(`${baseUrl}/entity/query/${this.entityId}`,{...this.defaultQueryObj,...this.queryObj});
        runInAction(()=>{
            this.tableRows=json.data;
            this.pagination={
                ...this.pagination,
                current:this.queryObj?this.queryObj.page:1,
                total:json.total,
            };
            this.loading=false;
        });
    };

    //tree
    //---------------------
    @observable
    treeData=[];

    @action
    initTree=async ()=>{
        let {topParentId}=await get(`${baseUrl}/entity/topParentId/${this.currentParentEntity.parentEntityId}`);
        //this.queryObj={[this.currentEntity.pidField]:topParentId};
        let json=await post(`${baseUrl}/entity/query/${this.currentParentEntity.id}`,{[this.currentParentEntity.idField]:topParentId});
        runInAction(()=>{
            this.treeData=json.data;
        });
    };


    @action
    onLoadTreeData=async(treeNode)=>{
        const parentId=treeNode.props.dataRef[this.currentParentEntity.idField];
        let json=await post(`${baseUrl}/entity/query/${this.currentParentEntity.parentEntityId}`,{[this.currentParentEntity.pidField]:parentId});
        runInAction(()=>{
            treeNode.props.dataRef.children=json.data;
            this.treeData=[...this.treeData];
        })
    };


    treeSelectObj={};
    @observable
    currentRoute=[];

    @action
    treeSelect=(selectedKeys,e)=>{
        let id=e.node.props.dataRef[this.currentParentEntity.idField];
        this.treeSelectObj={[this.currentEntity.pidField]:id};
        this.treeData.filter(d=>d).forEach(data=>{
            getPathById(e.node.props.dataRef[[this.currentParentEntity.idField]],Object.create(data),(result)=>{
                runInAction(()=>{
                    this.currentRoute=result.map(r=>({id:r[this.currentParentEntity.idField],text:r[this.currentParentEntity.nameField]}));
                });
            },this.currentParentEntity.idField)
        });
        this.queryObj={start:0,pageSize:this.pagination.pageSize,page:1,...this.treeSelectObj};
        this.queryTable();

    };

    //createForm
    //---------------------
    @observable
    createFormVisible=false;

    isFormUpdate=false;

    currentTableRow={};

    @action
    toggleCreateFormVisible=()=>{
        this.createFormVisible=!this.createFormVisible;
    };

    showCreateForm=(record,isUpdate)=>(()=>{
        this.isFormUpdate=isUpdate;
        this.currentTableRow=record;
        if(this.hasParent){
            if(!this.treeSelectObj[this.currentEntity.pidField]){
                notification.info({
                    message: '先选中对应父节点'
                });
                return;
            }
        }
        this.toggleCreateFormVisible();
    });


}

