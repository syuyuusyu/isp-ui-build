import React, {Component} from 'react';
import {Form, Divider, Popconfirm, Table, Modal, Row, Col,Button,Drawer,Select,notification,Card} from 'antd';
import {inject, observer} from 'mobx-react';
import {baseUrl, dateFtt, format, get} from '../util';
import CreateForm from './createForm';


const EnhancedCreateFrom=Form.create()(CreateForm);
const Option=Select.Option;

//import {SysOperationStore} from "./store";

//const TreeNode = Tree.TreeNode;
//const {Content, Sider} = Layout;

@inject('rootStore')
@observer
class CommonTable extends Component{

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
                <Table style={{height: "100%"}}
                       columns={store.columns.filter(d=>d)}
                       rowKey={record => record[store.currentEntity.idField]}
                       dataSource={store.tableRows.filter(d => d)}
                       rowSelection={null}
                       size="small"
                       scroll={{y: 800,x:1440}}
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