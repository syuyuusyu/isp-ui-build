import React, { Component } from 'react';
import { Tree } from 'antd';
import {inject,observer,} from 'mobx-react';
import {configure} from 'mobx';
import {Link,} from 'react-router-dom';
const TreeNode = Tree.TreeNode;

configure({ enforceActions: 'observed' });

@inject('rootStore')
@observer
class LeftTree extends Component{


    renderTreeNodes = (data) => {
        return data.map((item) => {
            const title=item.path?<Link to={item.path}>{item.text}</Link>:item.text;
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

    render() {
        const store=this.props.rootStore.treeStore;
        return (
            <Tree loadData={store.onLoadData} onSelect={store.onSelect}  >
                {this.renderTreeNodes(store.treeData)}
            </Tree>

        );
    }
}

export default LeftTree;