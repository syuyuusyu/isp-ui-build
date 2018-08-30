import React, {Component} from 'react';
import {Layout, Divider, Popconfirm, Table, Modal, Row, Col, Button, Drawer, Select, notification} from 'antd';
import {inject, observer} from 'mobx-react';
import {baseUrl, dateFtt, get} from '../util';
import CommonTree from './commonTree';
import CommonTable from './CommonTable';
import QueryFrom from './queryForm';

const {Header, Footer, Sider, Content} = Layout;


const Option = Select.Option;

//import {SysOperationStore} from "./store";

//const TreeNode = Tree.TreeNode;
//const {Content, Sider} = Layout;

@inject('rootStore')
@observer
class CommonLayout extends Component {

    constructor(props) {
        super(props);
        const store = this.props.rootStore.commonStore;
        this.props.match.path.replace(/\/(\d+)$/, (w, p1) => {
            this.entityId = parseInt(p1, 10);
            store.setEntityId(this.entityId);
        });
        store.loadAllEntitys();
        store.loadAllDictionary();
        store.loadAllColumns();
    }

    render() {
        const store = this.props.rootStore.commonStore;
        return (
            <Layout style={{height: "100%"}}>
                {
                    store.hasParent ?
                        <Sider width={200}  style={{ background: '#fff',overflowY: 'auto', height: "100%" }}>
                            <CommonTree/>
                        </Sider>
                        :
                        ''
                }
                <Content style={{height: "100%"}}>
                    <Layout style={{height: "100%"}}>
                        <Header>
                            <QueryFrom/>
                        </Header>
                        <Content style={{height: "100%"}}>
                            <CommonTable/>
                        </Content>
                    </Layout>
                </Content>
            </Layout>
        );
    }

}

export default CommonLayout;