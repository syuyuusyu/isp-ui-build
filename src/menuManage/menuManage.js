import React, {Component} from 'react';
import {Layout, Tree, Button, Popconfirm, Table, Modal, Row, Col} from 'antd';
import {inject, observer} from 'mobx-react';
import RoleButton from '../roleButton';
import AddMenuForm from './addMenuForm';
import ModifyMenuForm from './modifyMenuForm';

const TreeNode = Tree.TreeNode;
const {Content, Sider} = Layout;

@inject('rootStore')
@observer
class MenuManage extends Component {
  componentDidMount() {
    this.props.rootStore.menuManageStore.initRoot();
  }

  columns = [
    {dataIndex: 'text', title: '菜单名称', width: 220},
    {dataIndex: 'name', title: '菜单编码', width: 220},
    {dataIndex: 'path', title: '跳转路径', width: 220},
    {dataIndex: 'page_path', title: '菜单目录路径', width: 180},
    {dataIndex: 'page_class', title: '菜单类路径', width: 180},
    {dataIndex: 'menu_order', title: '菜单顺序', width: 100},
    {
      title: '操作', width: 260,
      render: (record) => {
        return (
          <span>
          <RoleButton icon="edit" buttonId={31}  onClick={this.props.rootStore.menuManageStore.showMenuModifyForm(record)} size='small'>修改</RoleButton>
          <Popconfirm onConfirm={this.props.rootStore.menuManageStore.deleteMenu(record.id)} title="确认删除?">
            <RoleButton icon="delete"  buttonId={34} onClick={null} size='small'>删除</RoleButton>
          </Popconfirm>
        </span>
        )
      }
    }
  ];

  renderTreeNodes = (data) => {
    return data.map((item) => {
      const title = item.text;
      if (item.children) {
        return (
          <TreeNode title={title} key={item.id} dataRef={item}>
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode title={title} key={item.id} dataRef={item} isLeaf={item.is_leaf === '1' ? true : false}/>;
    });
  }

  render() {
    const {winWidth, winHeight} = this.props.rootStore.treeStore;
    return (
      <Layout>
        <Sider width={220} style={{background: '#fff'}}>
          <Tree loadData={this.props.rootStore.menuManageStore.onLoadData}
                onSelect={this.props.rootStore.menuManageStore.treeSelect}>
            {this.renderTreeNodes(this.props.rootStore.menuManageStore.treeData)}
          </Tree>
        </Sider>
        <Content>
          <div style={{paddingBottom:"12px"}}>
          <Row gutter={24}>
            <Col span={20}><span style={{fontSize: '16px'}}>当前菜单名称:{this.props.rootStore.menuManageStore.currentMenuName}</span></Col>
            <Col span={4} style={{textAlign: 'right'}}>
              <RoleButton icon="plus-circle" buttonId={32}
                          onClick={this.props.rootStore.menuManageStore.showAddMenuForm(null)}>新建</RoleButton>
            </Col>
          </Row>
          </div>
          <Modal visible={this.props.rootStore.menuManageStore.menuAddVisiblef}
                 width={800}
                 title="新增菜单"
                 footer={null}
                 onCancel={this.props.rootStore.menuManageStore.toggleMenuAddVisible}
                 maskClosable={false}
                 destroyOnClose={true}
          >
            <AddMenuForm/>
          </Modal>
          <Modal visible={this.props.rootStore.menuManageStore.menuModifyFormVisible}
                 width={800}
                 title="修改菜单"
                 footer={null}
                 onCancel={this.props.rootStore.menuManageStore.toggleMenuModifyVisible}
                 maskClosable={false}
                 destroyOnClose={true}
          >
            <ModifyMenuForm/>
          </Modal>
          <Table columns={this.columns}
                 rowKey={record => record.id}
                 dataSource={this.props.rootStore.menuManageStore.currentMenus.filter(d => d)}
                 rowSelection={null}
                 size="small"
                 scroll={{y: 200,}}
          />
        </Content>
      </Layout>
    );
  }
}

export default MenuManage;
