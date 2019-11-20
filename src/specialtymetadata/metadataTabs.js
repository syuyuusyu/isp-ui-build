import React, { Component } from 'react';
import { Layout, Tree,Table,Icon,Modal,Row,Col,Spin,Breadcrumb,Tabs} from 'antd';
import {inject,observer} from 'mobx-react';


const TreeNode = Tree.TreeNode;
const TabPane = Tabs.TabPane;
const { Content, Sider } = Layout;
const antIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;

@inject('rootStore')
@observer
class MetadataTabs extends Component{


    componentDidMount(){
        this.props.rootStore.specialtyMetdataStore.loadTree();
        this.props.rootStore.sysmetadataStore.initAlldataBaseType();
    }

    renderTreeNodes = (data) => {
        return data.map((item) => {
            const title=item.NAME;
            //const title=item.text;
            if (item.children) {
                return (
                    <TreeNode title={title} key={item.ID} dataRef={item}>
                        {this.renderTreeNodes(item.children)}
                    </TreeNode>
                );
            }
            return <TreeNode title={title} key={item.ID} dataRef={item} />;
        });
    };

    createTable=()=>{
        const tables=[];
        const store=this.props.rootStore.specialtyMetdataStore;
        for(let tableName in store.metadataObj.tabName){
            const trs=[];
            for(let key in store.metadataObj[tableName]){
                const tr=(
                    <tr>
                        <td width="50%" style={{textAlign:'center',padding:'5px'}}>{store.metadataObj[tableName][key]}</td>
                        <td style={{textAlign:'center'}}>
                            {
                                store.currentMetdata[tableName]?
                                   store.currentMetdata[tableName][key]
                                    :
                                    ''
                            }
                        </td>
                    </tr>
                );
                trs.push(tr);
            }
            const table=(
                <TabPane tab={store.metadataObj.tabName[tableName]} key={tableName} style={ {height: "100%"}}>
                    <table border="1" style={{width:'100%',marginBottom:'5px',overflowY: 'auto',height: "100%"}}>
                        <tbody >
                        {trs}
                        </tbody>
                    </table>
                </TabPane>
            );
            tables.push(table);
        }
        return tables;
    };



    render(){
        if(this.props.rootStore.specialtyMetdataStore.loadError){
            return <div>调用超图接口失败....</div>
        }
        return (
            <Layout style={{height: "100%"}}>
                <Sider width={400}  style={{ background: '#fff',overflowY: 'auto', height: "100%" }}>
                    <Spin indicator={antIcon} tip='获取资源树...' spinning={this.props.rootStore.specialtyMetdataStore.loadingTree}>
                        <Tree  onSelect={this.props.rootStore.specialtyMetdataStore.treeSelect}
                               autoExpandParent={false}
                        >
                            {this.renderTreeNodes(this.props.rootStore.specialtyMetdataStore.treeData)}
                        </Tree>
                    </Spin>
                </Sider>
                <Content style={{height: "100%",background: '#fff'}}>
                    <Breadcrumb style={{ margin: '10px 8px' }}>
                        <Breadcrumb.Item>当前路径:</Breadcrumb.Item>
                        {
                            this.props.rootStore.specialtyMetdataStore.currentRoute
                                .filter(d=>d).map(r=><Breadcrumb.Item>{r.NAME}</Breadcrumb.Item>)
                        }
                    </Breadcrumb>
                    <Spin indicator={antIcon} tip='正在获取数据...' spinning={this.props.rootStore.specialtyMetdataStore.isLoading}>
                        <Tabs defaultActiveKey="1">
                            {this.createTable()}
                        </Tabs>
                    </Spin>

                </Content>
            </Layout>
        );
    }

}

export default MetadataTabs;