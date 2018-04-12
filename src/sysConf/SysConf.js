import React from 'react';
import {Table,Modal,Divider,Popconfirm,Row,Col} from 'antd';
import {inject,observer} from 'mobx-react';
import RoleButton from '../roleButton';
import SysForm from './sysForm';
import RoleSysConf from './roleSysConf';

@inject('rootStore')
@observer
class SysConf extends React.Component{

    columns=[
        {dataIndex:'code',title:'系统编码',width:50},
        {dataIndex:'name',title:'系统名称',width:100},
        {dataIndex:'url',title:'URL',width:200},
        {
            title:'操作',
            width:200,
            render:(text,record)=>{
                return (
                    <span>
                        {/*<RoleButton buttonId={20}  onClick={this.props.rootStore.sysStore.showSysRoleConf(record)}/>*/}
                        {/*<Divider type="vertical"/>*/}
                        <RoleButton buttonId={15} onClick={this.props.rootStore.sysStore.showForm(record)}/>
                        <Divider type="vertical"/>
                        <Popconfirm onConfirm={this.props.rootStore.sysStore.delete(record.id)} title="确认删除?">
                            <RoleButton buttonId={16}/>
                        </Popconfirm>
                    </span>
                )
            }
        }
    ];

    componentDidMount(){
        this.props.rootStore.sysStore.initAllsystem();
    }

    render(){
        const store=this.props.rootStore.sysStore;
        return (
            <div>
                <Modal visible={store.sysFormVisible}
                       width={700}
                       title='系统平台接入'
                       footer={null}
                       onCancel={store.toggleSysFormVisible}
                       maskClosable={false}
                       destroyOnClose={true}
                >
                    <SysForm/>
                </Modal>
                <Modal visible={store.sysRoleConfVisible}
                       width={900}
                       title={`角色访问权限配置,当前选中系统:${store.currentSys.name}`}
                       footer={null}
                       onCancel={store.toggleSysRoleConfVisible}
                       maskClosable={false}
                       destroyOnClose={true}
                >
                    <RoleSysConf/>
                </Modal>
                <Row gutter={24}>
                    <Col span={20}></Col>
                    <Col span={4} style={{ textAlign: 'right' }}>
                        <RoleButton buttonId={14} onClick={store.showForm()}/>
                    </Col>
                </Row>
                <Table columns={this.columns}
                       rowKey={record => record.id}
                       dataSource={store.allSystem.filter(d=>d)}
                       rowSelection={null}
                       size="small"
                       scroll={{ y: 800 }}
                    //expandedRowRender={this.expandedRowRender}
                    //pagination={this.state.pagination}
                    //loading={this.state.loading}
                    //onChange={this.handleTableChange}
                />
            </div>
        );
    }
}

export default SysConf;