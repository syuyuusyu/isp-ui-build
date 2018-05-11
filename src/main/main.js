import React, { Component } from 'react';
//import LeftTree from './leftTree';

import {
  Layout, Dropdown, Menu, Avatar, Popover, Button, Card, Modal, Badge, Icon, Input
} from 'antd';

import { inject, observer } from 'mobx-react';
//import SubContent from "./subContent";
//import InvkeGrid3 from "../invoke";
import { NavLink, Switch, Route, Redirect, withRouter } from 'react-router-dom';
import { Login } from '../login';
//import {get,baseUrl} from '../util';
import MenuTree from './menuTree';
import { Home } from '../home';
import { Summary } from '../summary';
import SysConnect from './sysConnect';
import { ApplyPlatform, MessageTable } from "../notification";
import UserRegisterForm from '../signUp/userRegisterForm'
import ModifyUserForm from '../modifyUserInfo/modifyUserForm'
import {Link} from 'react-router-dom';
const { Header, Content, Sider, Footer } = Layout;

@inject('rootStore')
@observer
class Main extends Component {

  componentWillMount () {
    const winWidth = document.documentElement.clientWidth;
    const winHeight = document.documentElement.clientHeight;
    this.props.rootStore.treeStore.updateWinSize({ width: winWidth, height: winHeight });
    this.winResize = (e) => {
      this.props.rootStore.treeStore.updateWinSize({
        width: document.documentElement.clientWidth,
        height: document.documentElement.clientHeight,
      });
    };
    window.addEventListener('resize', this.winResize, false);
  }
  componentWillUnMount () {
    window.removeEventListener('resize', this.winResize, false);
  }
  componentDidMount() {
    //角色权限变动以后需要刷新的数据
    if (!this.props.rootStore.authorityStore.loginVisible) {
      Promise.all([
        this.props.rootStore.authorityStore.loadAllbuttons(),
        //this.props.rootStore.treeStore.initCurrentRoleMenu(),
        this.props.rootStore.treeStore.initRoot(),
          this.props.rootStore.notificationStore.loadSystemAccess()
      ]);
    }


  }

  // componentWillUpdate(){
  //     if(!this.props.rootStore.authorityStore.loginVisible){
  //         this.props.rootStore.treeStore.initRoot();
  //         this.props.rootStore.treeStore.initCurrentRoleMenu();
  //     }
  // }

  componentWillUpdate() {
    //console.log('componentWillUpdate:'+this.constructor.name);
  }


  render() {
    const treeStore = this.props.rootStore.treeStore;
    const authoritySyore = this.props.rootStore.authorityStore;
    const { winWidth, winHeight } = treeStore;
    const userOperations = (
      <ul className="popover-list">
          <li onClick={this.props.rootStore.notificationStore.toggleApplyPlatformVisible}>申请平台访问权限</li>
          <li><Link to="/modifyUser">修改用户信息</Link></li>
          <li onClick={this.props.rootStore.authorityStore.logout}>退出</li>
      </ul>
    );
    // 未登录
    if (authoritySyore.loginVisible) {
      return (
        <div className="extend-layout" style={{ height: "100%" }}>
          <Switch>
            <Route path="/register" component={UserRegisterForm} />
            <Route path="/login" component={Login} />
            <Redirect path="/" to="/login" />
          </Switch>
          <footer>© 2018 云南地质大数据服务平台</footer>
        </div>
      );
    }
    // 已登录
    return (
      <div id="mainBox">
        <header>
          <div id="headerBox">
            <div id="logoBox">
              <span className="text">系统综合集成平台</span>
            </div>
            <div id="searchBox">
              <Input type="text" />
              <Icon type="search" />
            </div>
            <Popover placement="bottom" trigger="hover" content={userOperations}>
              <div id="userBox">
                <Icon type="user" />
                <span className="name">&nbsp;&nbsp;{sessionStorage.getItem('currentUserName')}&nbsp;</span>
                <Icon type="down" style={{ fontSize: '12px' }} />
              </div>
            </Popover>
            <Badge id="messageBox" dot={true} count={this.props.rootStore.notificationStore.messages.filter(d => d).length}>
              <Icon
                type="message"
                onClick={this.props.rootStore.notificationStore.toggleMessageTableVisible}
              />
            </Badge>
          </div>
          <MenuTree />
        </header>
        <Switch>
          <Redirect exact path="/" to="/home" />
          <Redirect exact path="/login" to="/home" />
          <Route exact path="/home" component={Home} />
          <Route exact path="/summary" component={Summary} />
          <Route path="/modifyUser" component={ModifyUserForm} />
          <div id="contentBox" style={{ width: winWidth - 32, height: winHeight - 200 }}>
            {
              this.props.rootStore.treeStore.currentRoleMenu
                .filter(d => d)
                .filter(m => m.path)
                .map(m =>
                  <Route
                    key={m.id}
                    exact
                    path={m.path + (m.path_holder ? m.path_holder : '')}
                    component={require('../' + m.page_path)[m.page_class]}
                  />
                )
            }
          </div>
        </Switch>
        <footer>CopyRight © 云南地矿测绘院</footer>
        <Modal visible={this.props.rootStore.notificationStore.applyPlatformVisible}
               width={600}
               title={`申请平台访问权限`}
               footer={null}
               onCancel={this.props.rootStore.notificationStore.toggleApplyPlatformVisible}
               maskClosable={false}
               destroyOnClose={true}
        >
          <ApplyPlatform />
        </Modal>
        <Modal visible={this.props.rootStore.notificationStore.messageTableVisible}
               width={1000}
               title={`代办事项`}
               footer={null}
               onCancel={this.props.rootStore.notificationStore.toggleMessageTableVisible}
               maskClosable={false}
               destroyOnClose={true}
        >
          <MessageTable />
        </Modal>
      </div>
    );
  }
}

export default withRouter(Main);
