import React, {Component} from 'react';
import { Divider, Popconfirm, Table, Modal, Row, Col,Button,Drawer,Select,notification} from 'antd';
import {inject, observer} from 'mobx-react';
import {baseUrl, dateFtt, get} from '../util';



const Option=Select.Option;

//import {SysOperationStore} from "./store";

//const TreeNode = Tree.TreeNode;
//const {Content, Sider} = Layout;

@inject('rootStore')
@observer
class CommonTable extends Component{

    componentWillMount(){
        const store=this.props.rootStore.commonStore;
        this.columns=[];
        store.allColumns.filter(d=>d.entityId===this.props.entityId && d.hidden!=='1')
            .forEach(c=>{
                let column={
                    dataIndex:c.columnName,
                    title:c.text?c.text:c.columnName,
                    width:c.width?c.width:100
                };
                //TODO
                this.columns.push(column);
            })

    }

    componentDidMount(){
        this.props.rootStore.commonStore.queryTable();
    }

    render(){
        const store=this.props.rootStore.commonStore;
        return (
            <div>
                <Table columns={store.columns}
                       rowKey={record => record[store.currentEntity.idField]}
                       dataSource={store.tableRows.filter(d => d)}
                       rowSelection={null}
                       size="small"
                       scroll={{y: 800,}}
                       pagination={this.state.pagination}
                       loading={this.state.loading}
                />
            </div>
        );
    }

}

export default CommonTable;