import React from 'react';
import {Tree,Row,Col,Button} from 'antd';
import {inject,observer} from 'mobx-react';
const TreeNode = Tree.TreeNode;

@inject('rootStore')
@observer
class RoleMenu extends React.Component{

    componentDidMount(){
        this.props.rootStore.roleMenuStore.initRoot();
    }

    renderTreeNodes = (data) => {
        return data.map((item) => {
            const title=item.text;
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

    render() {
        const store=this.props.rootStore.roleMenuStore;
        return (
            <div>
            <Tree checkable
                  loadData={store.onLoadData}
                  onCheck={store.onCheck}
                  checkedKeys={store.roleCheckedKeys.filter(d=>d)}
                  checkStrictly
                  defaultExpandAll={false}
                  defaultCheckedKeys={store.roleCheckedKeys.filter(d=>d)}

                  >
                {this.renderTreeNodes(store.treeData)}
            </Tree>
                <Row>
                    <Col span={24} style={{ textAlign: 'right' }}>
                        <Button icon="save" onClick={store.save}>保存</Button>
                        <Button icon="reload" onClick={store.handleReset}>重置</Button>

                    </Col>
                </Row>
            </div>

        );
    }
}

export default RoleMenu;