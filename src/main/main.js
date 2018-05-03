import React, { Component } from 'react';
//import LeftTree from './leftTree';

import { Layout, Breadcrumb, Avatar, Popover, Button, Card, Modal, Badge, Icon } from 'antd';

import { inject, observer } from 'mobx-react';
//import SubContent from "./subContent";
//import InvkeGrid3 from "../invoke";
import { NavLink, Switch, Route, Redirect, withRouter } from 'react-router-dom';
import { Login } from '../login';
//import {get,baseUrl} from '../util';
import MenuTree from './menuTree';
import SysConnect from './sysConnect';
import { ApplyPlatform, MessageTable } from "../notification";
import UserRegisterForm from '../signUp/userRegisterForm'

const { Header, Content, Sider, Footer } = Layout;

@inject('rootStore')
@observer
class Main extends Component {

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

    const content = (
      <div style={{ background: '#ECECEC', padding: '2px' }}>
        <Card bordered={false} style={{ width: 300 }}>
          <Button icon="notification" onClick={this.props.rootStore.notificationStore.toggleMessageTableVisible}>
            您有{this.props.rootStore.notificationStore.messages.filter(d => d).length}条代办事项,点击查看
          </Button>
          <Button icon="unlock" onClick={this.props.rootStore.notificationStore.toggleApplyPlatformVisible}>申请平台访问权限</Button>
          <Button icon="logout" onClick={this.props.rootStore.authorityStore.logout}>退出</Button>
        </Card>
      </div>
    );
    if (authoritySyore.loginVisible) {
      return (
        <Layout style={{ height: "100%" }}>
          <Switch>
            <Route path="/register" component={UserRegisterForm} />
            <Route path="/login" component={Login} />
            <Redirect path="/" to="/login" />
          </Switch>
          <Footer style={{ textAlign: "center", height: "50px", padding: "0", lineHeight: "50px" }}>  © 2018 云南地质大数据服务平台 </Footer>
        </Layout>
      );
    }
    return (
      <div style={{ height: '100%' }}>
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
        <Layout style={{ height: '100%' }}>
          <Header className="header" style={{ background: '#fff' }}>
            <div style={{ float: 'right' }}>
              <Badge count={this.props.rootStore.notificationStore.messages.filter(d => d).length}>
                <Popover placement="bottom" title='用户选项' content={content} trigger="hover">
                  <Avatar size="large"
                    icon="user" /><span>{sessionStorage.getItem('currentUserName')}</span>
                </Popover>
              </Badge>
            </div>

          </Header>
          <Layout>
            {/* <Sider width={200} style={{ background: '#fff' }}> */}
            <MenuTree />
            {/* </Sider> */}
            <Layout style={{ padding: '0 12px 12px' }}>
              <Breadcrumb style={{ margin: '16px 0' }}>
                <Breadcrumb.Item><NavLink to="/"><Icon type="home" /></NavLink></Breadcrumb.Item>
                {
                  treeStore.currentRoute.map(c => {
                    if (c.path) {
                      return <Breadcrumb.Item key={c.id}><NavLink
                        to={c.path + (c.path_value ? c.path_value : '')}>{c.text}</NavLink></Breadcrumb.Item>
                    } else {
                      return <Breadcrumb.Item key={c.id}>{c.text}</Breadcrumb.Item>
                    }
                  })
                }
              </Breadcrumb>
              <Content style={{ background: '#fff', padding: 24, margin: 0, minHeight: 280 }}>
                <div>
                  <Switch>
                    <Route exact path="/" component={SysConnect} />
                    {
                      this.props.rootStore.treeStore.currentRoleMenu
                        .filter(d => d)
                        .filter(m => m.path)
                        .map(m =>
                          <Route key={m.id} exact
                                 path={m.path + (m.path_holder ? m.path_holder : '')}
                                 component={require('../' + m.page_path)[m.page_class]} />
                        )
                    }
                    <Redirect path="/" to="/" />
                  </Switch>
                </div>
              </Content>
            </Layout>
          </Layout>
        </Layout>

      </div>
    );
  }
}

export default withRouter(Main);
