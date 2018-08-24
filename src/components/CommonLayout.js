import React, {Component} from 'react';
import {Layout, Divider, Popconfirm, Table, Modal, Row, Col,Button,Drawer,Select,notification} from 'antd';
import {inject, observer} from 'mobx-react';
import {baseUrl, dateFtt, get} from '../util';
import CommonTree from './commonTree';
import CommonTable from './CommonTable';
import QueryFrom from './queryForm';
const { Header, Footer, Sider, Content } = Layout;



const Option=Select.Option;

//import {SysOperationStore} from "./store";

//const TreeNode = Tree.TreeNode;
//const {Content, Sider} = Layout;

@inject('rootStore')
@observer
class CommonTable extends Component{

    componentWillMount(){
        const store=this.props.rootStore.commonStore;
        store.loadAllEntitys();
        store.loadAllDictionary();
        store.loadAllColumns();
        this.entity=store.allEntitys.filter(d=>d.id===this.props.entityId)[0];
    }

    render(){

        return (
                <Layout>
                    <Sider>
                        {
                            this.entity.parentEntityId?
                                <CommonTree  entityId={this.props.entityId}/>
                                :
                                ''
                        }
                    </Sider>
                    <Content>
                        <Layout>
                            <Header>
                                <QueryFrom entityId={this.props.entityId}/>
                            </Header>
                            <Content>
                                <CommonTable entityId={this.props.entityId}/>
                            </Content>
                        </Layout>
                    </Content>
                </Layout>
        );
    }

}

export default CommonTable;