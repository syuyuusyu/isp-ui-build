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
        store.loadColumns();

    }

    componentDidMount(){
        this.props.rootStore.commonStore.queryTable();
    }

    render(){
        const store=this.props.rootStore.commonStore;
        return (
            <div>
                <Table columns={store.columns.filter(d=>d)}
                       rowKey={record => record[store.currentEntity.idField]}
                       dataSource={store.tableRows.filter(d => d)}
                       rowSelection={null}
                       size="small"
                       scroll={{y: 800,x:1440}}
                       pagination={store.pagination}
                       loading={store.loading}
                />
            </div>
        );
    }

}

export default CommonTable;