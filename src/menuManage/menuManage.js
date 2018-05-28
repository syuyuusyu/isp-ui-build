import React, {Component} from 'react';
import {Layout, Tree, Button, Popconfirm, Table, Modal, Row, Col} from 'antd';
import {inject, observer} from 'mobx-react';
import OrganizationConf from "../orgOperation/orgOperation";

const TreeNode = Tree.TreeNode;
const {Content, Sider} = Layout;

@inject('rootStore')
@observer
class MenuManage extends Component {
  render() {
    const {winWidth, winHeight} = this.props.rootStore.treeStore;
    return(
      <Layout>

      </Layout>
    );
  }
}

export default MenuManage;
