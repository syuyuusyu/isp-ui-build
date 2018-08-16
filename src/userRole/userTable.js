import React from 'react';
import {Table, Modal, Row, Col, Select, Button,} from 'antd';
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
              <div style={{paddingBottom:"12px"}}>
                <Row gutter={25}>
                  <Col span={2} offset={0} style={{lineHeight:'32px'}}>登录名称:</Col>
                  <Col span={3} offset={1}>
                    <Select style={{width:150}}  onChange={store.setSelectUser}>
                      <Option  value={''} style={{color:'white'}}>&nbsp;</Option>
                      {
                        store.usersBack.filter(d=>d).map(s=>
                          <Option key={s.id} value={s.user_name}>{s.user_name}</Option>)
                      }
                    </Select>
                  </Col>
                  <Col span={4} style={{ textAlign: 'right',float:'right' }}>
                    <Button icon="search" onClick={store.queryUser}>查询</Button>
                  </Col>
                </Row>
              </div>
                <Modal visible={store.userRoleConfVisible}
                       width={900}
                       title="关联角色"
                       footer={null}
                       onCancel={store.taggreUserRoleConf}
                       maskClosable={false}
                       destroyOnClose={true}
                       afterClose={store.afterClose()}
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
                       dataSource={store.users.filter(d=>d).sort((a,b)=>Date.parse(b.update_date)-Date.parse(a.update_date))}
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
