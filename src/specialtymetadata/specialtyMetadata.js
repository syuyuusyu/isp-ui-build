import React, { Component } from 'react';
import { Layout, Tree,Table,Icon,Modal,Row,Col,Spin,Breadcrumb} from 'antd';
import {inject,observer} from 'mobx-react';


const TreeNode = Tree.TreeNode;
const { Content, Sider } = Layout;
const antIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;

@inject('rootStore')
@observer
class SpecialtyMetadata extends Component{

    columns=[
        {dataIndex:'name',title:'编码',width:100},
        {dataIndex:'title',title:'名称',width:100},
        {dataIndex:'database_type',title:'数据库类型',width:100,
            render:(text)=>{
                if(this.props.rootStore.sysmetadataStore.allDatabaseType.filter(d=>d.value+''===text+'').length>0)
                    return this.props.rootStore.sysmetadataStore.allDatabaseType.filter(d=>d.value+''===text+'')[0].text;
                return text;
            }
        },
        {dataIndex:'info',title:'描述',width:200},

    ];

    componentDidMount(){
        this.props.rootStore.specialtyMetdataStore.loadTree();
        this.props.rootStore.sysmetadataStore.initAlldataBaseType();
    }

    expandedRowRender=(record)=>{
        return (
            <SubTable fields={record.fields}/>
        );
    };

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

    render(){
        return (
            <Layout style={{height: "100%"}}>
                <Sider width={400}  style={{ background: '#fff',overflowY: 'auto', height: "100%" }}>
                    <Spin indicator={antIcon} tip='获取资源树...' spinning={this.props.rootStore.specialtyMetdataStore.loadingTree}>
                    <Tree  onSelect={this.props.rootStore.specialtyMetdataStore.treeSelect}>
                        {this.renderTreeNodes(this.props.rootStore.specialtyMetdataStore.treeData)}
                    </Tree>
                    </Spin>
                </Sider>
                <Content style={{height: "100%"}}>
                    <Breadcrumb style={{ margin: '10px 8px' }}>
                        <Breadcrumb.Item>当前路径:</Breadcrumb.Item>
                        {
                            this.props.rootStore.specialtyMetdataStore.currentRoute
                                .filter(d=>d).map(r=><Breadcrumb.Item>{r.NAME}</Breadcrumb.Item>)
                        }
                    </Breadcrumb>
                    <Spin indicator={antIcon} tip='正在获取数据...' spinning={this.props.rootStore.specialtyMetdataStore.isLoading}>
                    <Table columns={this.columns}
                           rowKey={record => record.id}
                           dataSource={this.props.rootStore.specialtyMetdataStore.currentMetdata.filter(d=>d)}
                           rowSelection={null}
                           size="small"
                           scroll={{ y: 800 ,}}
                           expandedRowRender={this.expandedRowRender}
                        //pagination={this.state.pagination}
                        //loading={this.state.loading}
                        //onChange={this.handleTableChange}
                    />
                    </Spin>

                </Content>
            </Layout>
        );
    }
}

class SubTable extends React.Component{


    fieldColumns=[
        {dataIndex:'name',title:'字段名称',width:100},
        {dataIndex:'title',title:'中文名称',width:100},
        {dataIndex:'type',title:'数据类型',width:100},
        {dataIndex:'length',title:'数据长度',width:100},
        {dataIndex:'comment',title:'注释',width:200},
    ];


    async componentDidMount(){

    }

    render(){
        return (
            <Table columns={this.fieldColumns}
                   rowKey={record => record.id}
                   dataSource={this.props.fields}
                   rowSelection={null}
                   size="small"
                   scroll={{ y: 800 }}
                   bordered={true}
                   pagination={false}
            />
        );
    }

}

export default SpecialtyMetadata;
