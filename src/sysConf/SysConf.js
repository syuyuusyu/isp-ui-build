import React from 'react';
import {Table,Modal,Divider,Popconfirm,Row,Col} from 'antd';
import {inject,observer} from 'mobx-react';
import RoleButton from '../roleButton';
import SysForm from './sysForm';
import RoleSysConf from './roleSysConf';
import "../home/index.less";

@inject('rootStore')
@observer
class SysConf extends React.Component{

    columns=[
        {dataIndex:'code',title:'系统编码',width:80},
        {dataIndex:'name',title:'系统名称',width:100},
        {dataIndex:'icon',title:'图标',width:100,},
        {dataIndex:'isGov',title:'政务网是否可以访问',width:150,
            render:(text)=>{
                if(text==='1'){
                    return '是';
                }else{
                    return '否';
                }
            }
        },
        {dataIndex:'accessType',title:'访问类型',width:100,
            render:(text)=>{
                if(text==='1'){
                    return '单点登录';
                }else if(text=='0'){
                    return '直接访问';
                }else{
                    return '其他';
                }
            }
        },
        {
            dataIndex:'url',
            title:'URL',
            width:200,
            render: (text, record) => (
                <div style={{ wordWrap: 'break-word', wordBreak: 'break-all' }}>
                    {text}
                </div>
            )
        },
        {
            dataIndex:'govUrl',
            title:'政务网URL',
            render: (text, record) => (
                <div style={{ wordWrap: 'break-word', wordBreak: 'break-all' }}>
                    {text}
                </div>
            )
        },
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
              <div style={{paddingBottom:"12px"}}>
                <Row gutter={24}>
                    <Col span={20}></Col>
                    <Col span={4} style={{ textAlign: 'right' }}>
                        <RoleButton buttonId={14} onClick={store.showForm()}/>
                    </Col>
                </Row>
              </div>
                <Table columns={this.columns}
                       rowKey={record => record.id}
                       dataSource={store.allSystem.filter(d=>d)}
                       size="small"
                       //scroll={{ y: 600,}}
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
