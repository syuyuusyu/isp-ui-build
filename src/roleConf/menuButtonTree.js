import React, { Component } from 'react';
import { Icon ,Tree,Row,Col,Button} from 'antd';
import {inject,observer,} from 'mobx-react';


const TreeNode = Tree.TreeNode;

@inject('rootStore')
@observer
class MenuButtonTree extends Component{

    componentDidMount(){
        this.props.rootStore.roleButtonStore.loadMenuButtonTree();
    }

    renderTreeNodes=(data)=>{
        return data.map(item=>{
            if(item.children){
                return <TreeNode disableCheckbox={item.type==='1'} key={item.key+''} title={<span><Icon type={item.icon} /><span>{item.text}</span></span>}>
                    {this.renderTreeNodes(item.children)}
                </TreeNode>
            }
            return <TreeNode disableCheckbox={item.type==='1'} key={item.key+''} title={<span><Icon type={item.icon} /><span>{item.text}</span></span>}/>

        });
    };

    render(){
        const store=this.props.rootStore.roleButtonStore;
        return (
            <div>
                <Tree checkable
                      onCheck={store.onCheck}
                      checkStrictly
                      defaultExpandAll={true}
                      checkedKeys={store.checkedKeys.filter(d=>d).map(d=>d+'')}
                      defaultCheckedKeys={store.checkedKeys.filter(d=>d).map(d=>d+'')}
                >
                    {this.renderTreeNodes(store.menuButtonTree)}
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

export default MenuButtonTree;