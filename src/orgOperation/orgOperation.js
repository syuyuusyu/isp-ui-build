import React, { Component } from 'react';
import { Layout, Tree ,Button,Popconfirm,Table,Modal,Row,Col} from 'antd';
import {inject,observer} from 'mobx-react';
import OrgForm from './modifyOrgForm';
import AddOrgForm from './addOrgForm';
import OrgUserForm from './orgUserForm';
import './orgOperatation.less';
import RoleButton from '../roleButton';


const TreeNode = Tree.TreeNode;
const { Content, Sider } = Layout;

@inject('rootStore')
@observer
class OrganizationConf extends Component{
  componentDidMount(){
    this.props.rootStore.orgOperationStore.initRoot();
  }

  columns=[
    {dataIndex:'name',title:'机构名称',width:260},
    {title:'操作',width:90,
      render:(record)=>{
      return(
        <span>
          <RoleButton buttonId={36} icon="edit" onClick={this.props.rootStore.orgOperationStore.showOrgForm(record)} size='small'>修改</RoleButton>
          <RoleButton buttonId={37} icon="edit" onClick={this.props.rootStore.orgOperationStore.showOrgUserForm(record)} size='small'>分配用户</RoleButton>
          <Popconfirm buttonId={4} onConfirm={this.props.rootStore.orgOperationStore.deleteOrgDetailed(record.id)} title="确认删除?">
          <RoleButton buttonId={38} icon="delete" onClick={null} size='small'>删除</RoleButton>
          </Popconfirm>
        </span>
      )
      }
    }
  ];

  renderTreeNodes = (data) => {
    return data.map((item) => {
      const title=item.name;
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
  };


  render(){
    const { winWidth, winHeight } = this.props.rootStore.treeStore;
    return(
      <Layout>
        <Sider width={winWidth - 1150} style={{ paddingRight: '16px', background: '#fff' }}>
          <Tree loadData={this.props.rootStore.orgOperationStore.onLoadData} onSelect={this.props.rootStore.orgOperationStore.treeSelect}
          >
            {this.renderTreeNodes(this.props.rootStore.orgOperationStore.treeData)}
          </Tree>
        </Sider>
        <Content>
          <div style={{paddingBottom:"12px"}}>
            <Row gutter={24}>
              <Col span={20}><span style={{fontSize: '16px'}}>当前机构名称:{this.props.rootStore.orgOperationStore.currentOrgName}</span></Col>
              <Col span={4} style={{ textAlign: 'right' }}>
                <RoleButton buttonId={35} icon="plus-circle" onClick={this.props.rootStore.orgOperationStore.showAddOrgForm(null)}>新建</RoleButton>
              </Col>
            </Row>
          </div>
          <Modal visible={this.props.rootStore.orgOperationStore.orgAddVisiblef}
                 width={900}
                 title="新增机构"
                 footer={null}
                 onCancel={this.props.rootStore.orgOperationStore.toggleOrgAddVisible}
                 maskClosable={false}
                 destroyOnClose={true}
          >
            <AddOrgForm/>
          </Modal>
          <Modal visible={this.props.rootStore.orgOperationStore.orgFormVisible}
                 width={500}
                 title="修改机构信息"
                 footer={null}
                 onCancel={this.props.rootStore.orgOperationStore.toggleOrgFormVisible}
                 maskClosable={false}
                 destroyOnClose={true}
          >
            <OrgForm/>
          </Modal>
          <Modal visible={this.props.rootStore.orgOperationStore.orgUserFormVisible}
                 width={800}
                 title="分配用户"
                 footer={null}
                 onCancel={this.props.rootStore.orgOperationStore.toggleOrgUserFormVisible}
                 maskClosable={false}
                 destroyOnClose={true}
                 afterClose={this.props.rootStore.orgOperationStore.afterClose}
          >
            <OrgUserForm/>
          </Modal>
        <Table columns={this.columns}
                rowKey={record => record.id}
                dataSource={this.props.rootStore.orgOperationStore.currentMenuOrgs.filter(d=>d)}
                rowSelection={null}
                size="small"
                scroll={{ y: 200 ,}}
        />
        </Content>
      </Layout>
    );
  }
}
export default OrganizationConf;
