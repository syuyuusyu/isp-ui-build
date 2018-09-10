import React, {Component} from 'react';
import {Form,Layout, Divider, Popconfirm, Table, Modal, Row, Col, Button, Drawer, Select, notification} from 'antd';
import {inject, observer} from 'mobx-react';
import {baseUrl, dateFtt, get} from '../util';
import CommonTree from './commonTree';
import CommonTable from './commonTable';
import QueryFrom from './queryForm';

const {Header, Footer, Sider, Content} = Layout;


const Option = Select.Option;

const EnhancedQueryFrom =  Form.create()(QueryFrom);

//import {SysOperationStore} from "./store";

//const TreeNode = Tree.TreeNode;
//const {Content, Sider} = Layout;

@inject('rootStore')
@observer
class CommonLayout extends Component {

    constructor(props) {
        super(props);
        //const store = this.props.rootStore.commonStore;

    }

    async componentWillMount(){
        console.log('componentWillMount',  this.props.match.path);

        const store = this.props.rootStore.commonStore;
        let entityId=this.props.match.path.replace(/\/\w+\/(\d+)$/, (w, p1) => {
            return p1;
        });
        store.setEntityId(parseInt(entityId,10));
        try{
            let obj=JSON.parse(this.props.defaultQueryObj);
            store.setDefaultQueryObj(obj);
        }catch (e){}
        await store.loadAllEntitys();
        await store.loadAllDictionary();
        await store.loadAllColumns();
        await store.loadAllMonyToMony();
        await store.loadAllOperations();
        store.setshouldRender(true);


    }

    componentWillUnmount(){
        console.log('componentWillUnmount',  this.props.match.path);

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
                        <Sider width={300}  style={{ background: '#fff',overflowY: 'auto', height: "100%" }}>
                            <CommonTree commonStore={store}/>
                        </Sider>
                        :
                        ''
                }
                <Content style={{height: "100%"}}>
                    <Layout style={{height: "100%"}}>
                        <Content style={{height: "100%"}}>
                            <EnhancedQueryFrom  commonStore={store} wrappedComponentRef={(form)=>{store.refQueryForm(form?form.wrappedInstance:null)}}/>
                            <CommonTable style={{height: "100%"}} commonStore={store}/>
                        </Content>
                    </Layout>
                </Content>
            </Layout>
        );
    }

}

export default CommonLayout;