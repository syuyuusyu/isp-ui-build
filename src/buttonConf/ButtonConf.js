import React, { Component } from 'react';
import { Layout, Tree ,Button,Divider,Popconfirm,Table,Icon,Modal,Row,Col} from 'antd';
import {inject,observer} from 'mobx-react';
import ButtonRoleConf from './ButtonRoleConf';
import ButtonForm from './buttonForm';

const TreeNode = Tree.TreeNode;
const { Content, Sider } = Layout;

@inject('rootStore')
@observer
class ButtonConf extends Component{

    columns=[
        {dataIndex:'id',title:'Id',width:20},
        {dataIndex:'menu_id',title:'菜单ID',width:20},
        {dataIndex:'icon',title:'图标',width:20,render: (text, record) =><Icon type={text} />},
        {dataIndex:'text',title:'按钮文字',width:100},
        {dataIndex:'size',title:'尺寸',width:30,
            render: (text, record) =>{
                switch (text){
                    case 'small':
                        return '小';
                    case 'large':
                        return '大';
                    case 'default':
                        return '中';
                    default:  return '';
                }
            }
        },
        {dataIndex:'color',title:'颜色',width:30},
        {dataIndex:'info',title:'信息',width:100},
        {
            title: '操作',
            width: 200,
            render: (text, record) => {
                return (
                    <span>
                        {/*<Button icon="solution" onClick={this.props.rootStore.buttonStore.showButtonRoleConf(record)} size='small'>按钮角色配置</Button>*/}
                        {/*<Divider type="vertical"/>*/}
                        <Button icon="edit" onClick={this.props.rootStore.buttonStore.showButtonForm(record)} size='small'>修改</Button>
                        <Divider type="vertical"/>
                        <Popconfirm onConfirm={this.props.rootStore.buttonStore.deleteButton(record.id)} title="确认删除?">
                            <Button icon="delete" onClick={null} size='small'>删除</Button>
                        </Popconfirm>
                    </span>
                )
            }
        }
    ];

    componentDidMount(){
        this.props.rootStore.roleMenuStore.initRoot();
    }

    renderTreeNodes = (data) => {
        return data.map((item) => {
            const title=item.text;
            //const title=item.text;
            if (item.children) {
                return (
                    <TreeNode title={title} key={item.id} dataRef={item}>
                        {this.renderTreeNodes(item.children)}
                    </TreeNode>
                );
            }
            return <TreeNode title={title} key={item.id} dataRef={item} isLeaf={item.is_leaf==='1'?true:false} />;
        });
    }

    render(){
        return (
            <Layout>
                <Sider width={200} style={{ background: '#fff' }}>
                    <Tree loadData={this.props.rootStore.roleMenuStore.onLoadData} onSelect={this.props.rootStore.buttonStore.treeSelect}
                    >
                        {this.renderTreeNodes(this.props.rootStore.roleMenuStore.treeData)}
                    </Tree>
                </Sider>
                <Content>
                    <div>
                        <Row gutter={24}>
                            <Col span={20}><span>当前菜单名称:{this.props.rootStore.buttonStore.currentMenuName}</span></Col>
                            <Col span={4} style={{ textAlign: 'right' }}>
                                <Button icon="plus-circle" onClick={this.props.rootStore.buttonStore.showButtonForm(null)}>新建</Button>
                            </Col>
                        </Row>
                    </div>
                    <Modal visible={this.props.rootStore.buttonStore.buttonRoleConfVisible}
                           width={900}
                           title="按钮角色配置"
                           footer={null}
                           onCancel={this.props.rootStore.buttonStore.toggleButtonRoleConfVisible}
                           maskClosable={false}
                           destroyOnClose={true}
                    >
                       <ButtonRoleConf/>
                    </Modal>
                    <Modal visible={this.props.rootStore.buttonStore.buttonFormVisible}
                           width={500}
                           title="按钮配置"
                           footer={null}
                           onCancel={this.props.rootStore.buttonStore.toggleButtonFormVisible}
                           maskClosable={false}
                           destroyOnClose={true}
                    >
                        <ButtonForm/>
                    </Modal>

                        <Table columns={this.columns}
                               rowKey={record => record.id}
                               dataSource={this.props.rootStore.buttonStore.currentMenuButtons.filter(d=>d)}
                               rowSelection={null}
                               size="small"
                               scroll={{ y: 800 ,}}
                            //expandedRowRender={this.expandedRowRender}
                            //pagination={this.state.pagination}
                            //loading={this.state.loading}
                            //onChange={this.handleTableChange}
                        />

                </Content>
            </Layout>
        );
    }
}

export default ButtonConf;