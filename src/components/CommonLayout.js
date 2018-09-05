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
        props.match.path.replace(/\/(\d+)$/, (w, p1) => {
            this.entityId = parseInt(p1, 10);
            store.setEntityId(this.entityId);
        });
        try{
            let obj=JSON.parse(props.defaultQueryObj);
            store.setDefaultQueryObj(obj);
        }catch (e){}


    }

    async componentWillMount(){
        const store=this.props.rootStore.commonStore;
        await store.loadAllEntitys();
        await store.loadAllDictionary();
        await store.loadAllColumns();
        await store.loadAllMonyToMony();
        store.setshouldRender(true);
    }

    render() {
        const store = this.props.rootStore.commonStore;
        if(!store.shouldRender){
            return <div></div>
        }
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
                        <Content style={{height: "100%"}}>
                            <QueryFrom/>
                            <CommonTable style={{height: "100%"}}/>
                        </Content>
                    </Layout>
                </Content>
            </Layout>
        );
    }

}

export default CommonLayout;