import React from 'react';
import {Table,Modal,} from 'antd';
import {inject,observer} from 'mobx-react';
import UserRoleConf from './userRoleConf';
import '../style.css';
//import RoleButton from "../roleButton";
//const Option = Select.Option;

@inject('rootStore')
@observer
class UserTable extends React.Component{

    componentDidMount(){
        this.props.rootStore.userRoleStore.loadAllUsers();
    }



    render(){
        const store=this.props.rootStore.userRoleStore;
        return (
            <div>
                <Modal visible={store.userRoleConfVisible}
                       width={900}
                       title="用户角色配置"
                       footer={null}
                       onCancel={store.taggreUserRoleConf}
                       maskClosable={false}
                       destroyOnClose={true}
                >
                    <UserRoleConf/>
                </Modal>
                {/*<Row gutter={24} className="table-head-row">*/}
                    {/*<Col span={2}>用户类型:</Col>*/}
                    {/*<Col span={6}>*/}
                        {/*<Select defaultValue={store.userType} onChange={store.userTypeChange}>*/}
                            {/*<Option value="1">系统用户</Option>*/}
                            {/*<Option value="2">机构用户</Option>*/}
                        {/*</Select>*/}
                    {/*</Col>*/}
                {/*</Row>*/}
                <Table columns={store.columns.filter(d=>d)}
                       rowKey={record => record.id}
                       dataSource={store.users.filter(d=>d)}
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

export default UserTable;