import React, { Component } from 'react';
import { Layout, Tree ,Button,Popconfirm,Table,Modal,Row,Col} from 'antd';
import {inject,observer} from 'mobx-react';
import OrgForm from './OrgForm';
import AddOrgForm from './addOrgForm';


const TreeNode = Tree.TreeNode;
const { Content, Sider } = Layout;

@inject('rootStore')
@observer
class OrganizationConf extends Component{
  componentDidMount(){
    this.props.rootStore.orgOperationStore.initRoot();
  }

  columns=[
    {dataIndex:'id',title:'Id',width:100},
    {dataIndex:'name',title:'机构名称',width:100},
    {title:'操作',width:100,
      render:(record)=>{
      return(
        <span>
          <Button icon="edit" onClick={this.props.rootStore.orgOperationStore.showOrgForm(record)} size='small'>修改</Button>
          <Popconfirm onConfirm={this.props.rootStore.orgOperationStore.deleteOrgDetailed(record.id)} title="确认删除?">
            <Button icon="delete" onClick={null} size='small'>删除</Button>
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
  }


  render(){
    return(
      <Layout>
        <Sider  width={200} style={{ background: '#fff' }}>
          <Tree loadData={this.props.rootStore.orgOperationStore.onLoadData} onSelect={this.props.rootStore.orgOperationStore.treeSelect}
          >
            {this.renderTreeNodes(this.props.rootStore.orgOperationStore.treeData)}
          </Tree>
        </Sider>
        <Content>
          <div>
            <Row gutter={24}>
              <Col span={20}><span>当前机构名称:{this.props.rootStore.orgOperationStore.currentOrgName}</span></Col>
              <Col span={4} style={{ textAlign: 'right' }}>
                <Button icon="plus-circle" onClick={this.props.rootStore.orgOperationStore.showAddOrgForm(null)}>新建</Button>
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
