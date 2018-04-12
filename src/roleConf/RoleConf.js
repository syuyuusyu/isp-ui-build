import React from 'react';
import {Table,Modal,Row,Col} from 'antd';
import {inject,observer} from 'mobx-react';
import RoleForm from './RoleForm';
import RoleMenu from './RoleMenu';
import RoleSysConf from './roleSysConf';
import RoleButton from '../roleButton';
import MenuButtonTree from './menuButtonTree';
import '../style.css';
//import {get,baseUrl} from '../util';

//const Option=Select.Option;


@inject('rootStore')
@observer
class RoleConf extends React.Component{



    constructor(){
        super(...arguments);
        this.store=this.props.rootStore.roleStore;
    }

    async componentDidMount(){
        this.store.loadAllRoles();
        //this.store.loadAllSystem();
    }

    async componentWillMount(){

    }

    render(){
        return (
            <div>
                <div>
                    {/*<Button icon={this.createButton.icon} sice={this.createButton.size} onClick={this.store.create}>{this.createButton.text}</Button>*/}

                    <Row gutter={24} className="table-head-row">
                        {/*<Col span={2} className="col-label">角色类型:</Col>*/}
                        {/*<Col span={6}>*/}
                            {/*<Select defaultValue={this.store.roleType} className="col-input" onChange={this.store.roleTypeChange}>*/}
                                {/*<Option value="1">系统角色</Option>*/}
                                {/*<Option value="2">机构角色</Option>*/}
                            {/*</Select>*/}
                        {/*</Col>*/}
                        <Col className="col-button">
                            <RoleButton buttonId={4} onClick={this.store.create} />
                        </Col>
                    </Row>
                </div>
                <Modal visible={this.store.fromVisible}
                       width={600}
                       title="角色配置"
                       footer={null}
                       onCancel={this.store.taggreForm}
                       maskClosable={false}
                       destroyOnClose={true}
                >
                    <RoleForm roleType={this.store.roleType}/>
                </Modal>
                <Modal visible={this.props.rootStore.roleMenuStore.menuVisible}
                       width={400}
                       title={`菜单权限配置:${this.props.rootStore.roleStore.selectRow && this.props.rootStore.roleStore.selectRow.code}`}
                       footer={null}
                       onCancel={this.props.rootStore.roleMenuStore.taggreMenu}
                       maskClosable={false}
                       destroyOnClose={true}
                >
                    <RoleMenu />
                </Modal>
                <Modal visible={this.props.rootStore.roleButtonStore.menuButtonTreeVisible}
                       width={400}
                       title={`按钮权限配置:${ this.props.rootStore.roleButtonStore.selectRow.code}`}
                       footer={null}
                       onCancel={this.props.rootStore.roleButtonStore.toggleMenuButtonTreeVisible}
                       maskClosable={false}
                       destroyOnClose={true}
                >
                    <MenuButtonTree />
                </Modal>
                <Modal visible={this.props.rootStore.roleSysStore.sysRoleConfVisible}
                       width={700}
                       title={`系统平台访问权限配置:${this.props.rootStore.roleStore.roleType==='1' ? this.props.rootStore.roleSysStore.selectedRow.sname:''}
                        -${ this.props.rootStore.roleSysStore.selectedRow.code}`}
                       footer={null}
                       onCancel={this.props.rootStore.roleSysStore.toggleSysRoleConfVisible}
                       maskClosable={false}
                       destroyOnClose={true}
                >
                    <RoleSysConf />
                </Modal>
                <Table columns={this.store.columns.filter(d=>d)}
                       rowKey={record => record.id}
                       dataSource={this.store.allRoles.filter(d=>d)}

                       rowSelection={null}
                       size="small"
                       scroll={{ y: 800 }}
                />
            </div>
        )
    }
}

export default RoleConf;