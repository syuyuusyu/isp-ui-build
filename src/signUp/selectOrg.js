import React from 'react';
import {Tree, Row, Col, Button, Modal} from 'antd';
import {inject,observer} from 'mobx-react';
const TreeNode = Tree.TreeNode;

@inject('rootStore')
@observer
class SelectOrg extends React.Component{
  componentDidMount(){
    this.props.rootStore.signUpStore.initRoot();
  }

  /*renderTreeNodes = (data) => {

    return data.map((item) => {
      const title=item.name;
      if (item.children) {
        return (
          <TreeNode title={title} key={item.id+''} dataRef={item}>
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode title={title} key={item.id+''} dataRef={item} isLeaf={item.is_leaf==='1'?true:false} />;
    });
  };*/

  renderTreeNodes = (data) => {
    return data.map((item) => {
      if (item.children) {
        return (
          <TreeNode title={item.name} key={item.id} dataRef={item} >
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode title={item.name} key={item.id+''} dataRef={item} isLeaf={item.is_leaf==='1'?true:false} />;
     /* return <TreeNode {...item} />;*/
    });
  };

  render() {
    const store=this.props.rootStore.signUpStore;
    return (
      <div>
        <Tree checkable
              onCheck={store.onCheck}
              checkedKeys={store.orgCheckedKeys.filter(d=>d)}
              checkStrictly={true}
              defaultCheckedKeys={store.orgCheckedKeys.filter(d=>d)}

        >
          {this.renderTreeNodes(store.treeData)}
        </Tree>
        <Row>
          <Col span={24} style={{ textAlign: 'right' }}>
            <Button icon="save" onClick={store.saveSelect}>确认选择</Button>
          </Col>
        </Row>
      </div>

    );
  }
}
export default SelectOrg;
