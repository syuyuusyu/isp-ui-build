import React, {Component} from 'react';
import { Divider, Popconfirm, Table, Modal, Row, Col,Button,Drawer,Select,notification} from 'antd';
import {inject, observer} from 'mobx-react';
import {baseUrl, dateFtt, get} from '../util';



const Option=Select.Option;

//import {SysOperationStore} from "./store";

//const TreeNode = Tree.TreeNode;
//const {Content, Sider} = Layout;

@inject('rootStore')
@observer
class CommonTree extends Component{

    componentWillMount(){
        const store=this.props.rootStore.commonStore;

    }

    render(){

        return (
            <div>tree</div>
        );
    }

}

export default CommonTree;