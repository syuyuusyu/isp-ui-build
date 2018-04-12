import React, { Component } from 'react';
import { Menu, Icon } from 'antd';
import {inject,observer,} from 'mobx-react';
import {useStrict} from 'mobx';
import {Link,} from 'react-router-dom';
const SubMenu = Menu.SubMenu;
//const MenuItemGroup = Menu.ItemGroup;

useStrict(true);

@inject('rootStore')
@observer
class MenuTree extends Component{

    componentDidMount(){
        this.props.rootStore.treeStore.loadMenuTree();
    }


    renderTree=(data)=>{
        return data.map(item=>{

            const title=item.path
              ?<Link to={item.path+(item.path_value?item.path_value:'')}><span><Icon type={item.icon} /><span>{item.text}</span></span></Link>
              :<span><Icon type={item.icon} /><span>{item.text}</span></span>;

            if(item.children){
              return <SubMenu key={item.id} title={title}>
                          {this.renderTree(item.children)}
                      </SubMenu>
            }
            return <Menu.Item key={item.id}>{title}</Menu.Item>

        })
    };

    render(){
        const store=this.props.rootStore.treeStore;
        return (
            <Menu onClick={store.onMenuClick}  mode="vertical">
              {this.renderTree(store.menuTreeData)}
            </Menu>);
    }
}

export default MenuTree;
