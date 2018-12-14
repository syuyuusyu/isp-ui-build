import React, {Component} from 'react';
import {Form, Divider, Popconfirm, Table, Modal, Row, Col,Button,Drawer,Select,notification,Card} from 'antd';
import {inject, observer} from 'mobx-react';
import {baseUrl, dateFtt, format, get} from '../util';
import CreateForm from './createForm';
import CommonTransfer from './commonTransfer';
import RelevantTree from './relevantTree';


const EnhancedCreateFrom=Form.create()(CreateForm);
const Option=Select.Option;

//import {SysOperationStore} from "./store";

//const TreeNode = Tree.TreeNode;
//const {Content, Sider} = Layout;
@inject('rootStore')
@observer
class CommonTable extends Component{

    state={
        modalWidth:400
    };

    componentWillMount(){
        const store=this.props.rootStore.commonStore;
        store.loadColumns();
        //this.entityColumns=store.allColumns.filter(c=>c.entityId===store.currentEntity.id && c.hidden!=='1');
        this.textColumns=store.allColumns.filter(c=>c.entityId===store.currentEntity.id && c.hidden!=='1')
            .filter(c=>c.columnType==='text');
        this.textColumnsLen=this.textColumns.length;
        if(this.textColumnsLen===1){
            this.matrix=[[]];
        }else if(this.textColumnsLen>1){
            this.matrix=[[],[]];
        }
        this.textColumns.forEach((col,index)=>{
            this.matrix[index%(this.textColumnsLen>1?2:1)].push(col);
        });
    }

    componentDidMount(){
        this.props.rootStore.commonStore.queryTable();
    }


    expandedRowRender=(record)=>(
        <div className="box-code-card" style={{ background: '#ECECEC', padding: '1px' }}>
            {
                this.matrix.map((row,index)=>
                    <Row type="flex" justify="center" align="top" gutter={8} key={index}>
                        {
                            row.map(col=>
                                <Col span={this.textColumnsLen>1?12:24} key={col.id}>
                                    <Card  title={col.text?col.columnName+'-'+col.text:col.columnName}
                                           bordered={false}><pre>{format(record[col.columnName])}</pre></Card>
                                </Col>
                            )
                        }
                    </Row>
                )
            }
        </div>
    );

    createOperationPage=(op)=>{
        const store=this.props.rootStore.commonStore;
        if(op.type==='1'){
            let monyTomony=store.allMonyToMony.find(m=>m.id===op.monyToMonyId);
            let relevantEntity;
            if(monyTomony.firstTable===store.currentEntity.tableName){
                relevantEntity=store.allEntitys.find(e=>e.tableName===monyTomony.secondTable);
            }else if(monyTomony.secondTable===store.currentEntity.tableName){
                relevantEntity=store.allEntitys.find(e=>e.tableName===monyTomony.firstTable);
            }
            if(relevantEntity){
                store.relevantEntity=relevantEntity;
                if(!relevantEntity.parentEntityId){
                    return (
                        <Modal visible={store.operationVisible[op.id]}
                               key={op.id}
                               width={900}
                               title={op.name}
                               footer={null}
                               onCancel={store.toggleOperationVisible(op.id)}
                               maskClosable={false}
                               destroyOnClose={true}
                        >
                            <CommonTransfer monyTomony={monyTomony} operationId={op.id}/>
                        </Modal>
                    );
                }else if(store.relevantEntity.id===relevantEntity.parentEntityId){
                    return (
                        <Modal visible={store.operationVisible[op.id]}
                               key={op.id}
                               width={400}
                               title={op.name}
                               footer={null}
                               onCancel={store.toggleOperationVisible(op.id)}
                               maskClosable={false}
                               destroyOnClose={true}
                        >
                            <RelevantTree monyTomony={monyTomony} operationId={op.id}/>
                        </Modal>
                    );
                }
            }
        }
        if(op.type==='2'){
            return (
                <Modal visible={store.operationVisible[op.id]}
                       key={op.id}
                       width={900}
                       title={op.name}
                       footer={null}
                       onCancel={store.toggleOperationVisible(op.id)}
                       maskClosable={false}
                       destroyOnClose={true}
                >
                    {React.createElement(require('../' + op.pagePath)[op.pageClass],{operationId:op.id})}
                </Modal>
            );

        }
    };

    render(){
        const store=this.props.rootStore.commonStore;
        return (
            <div style={{height: "100%"}}>
                <Modal visible={store.createFormVisible}
                       width={800}
                       title="新建"
                       footer={null}
                       onCancel={store.toggleCreateFormVisible}
                       maskClosable={false}
                       destroyOnClose={true}
                >
                    <EnhancedCreateFrom wrappedComponentRef={(form)=>{store.refCreateForm(form?form.wrappedInstance:null)}}/>
                </Modal>
                {
                    store.operations.filter(o=>o.type!=='3').map(o=>this.createOperationPage(o))
                }
                <Table style={{height: "100%"}}
                       columns={store.columns.filter(d=>d)}
                       rowKey={record => record[store.currentEntity.idField]}
                       dataSource={store.tableRows.filter(d => d)}
                       rowSelection={this.props.canSelectRows?{selectedRowKeys:store.selectedRowKeys,onChange:store.onSelectRows}:null}
                       size="small"
                       scroll={{y: 800,x:store.hasParent?1080:1340}}
                       pagination={store.pagination}
                       loading={store.loading}
                       expandedRowRender={store.allColumns.filter(c=>c.entityId===store.currentEntity.id && c.columnType==='text').length>0?
                           this.expandedRowRender:null}
                />
            </div>
        );
    }

}

export default CommonTable;