import React, {Component} from 'react';
import {
    Popover, Modal, Badge, Icon, Input
} from 'antd';
import {Link} from 'react-router-dom';
import {inject, observer} from 'mobx-react';
import {NavLink, Switch, Route, Redirect, withRouter} from 'react-router-dom';
import {Login} from '../login';
import MenuTree from './menuTree';
import {Home} from '../home';
import {ApplyPlatform, MessageTable} from "../notification";
import UserRegisterForm from '../signUp/userRegisterForm';
import ModifyUserForm from '../modifyUserInfo/modifyUserForm'
import {UserTaskTable} from '../activiti';
import CloudForm from '../cloudapply/cloudForm';
import CreateOracleUserForm from '../oracleUser/createOracleUserForm';


const renderMergedProps = (component, ...rest) => {
    const finalProps = Object.assign({}, ...rest);
    return (
        React.createElement(component, finalProps)
    );
};

const PropsRoute = ({component, ...rest}) => {
    return (
        <Route {...rest} render={routeProps => {
            return renderMergedProps(component, routeProps, rest);
        }}/>
    );
};

@inject('rootStore')
@observer
class Main extends Component {

    componentWillMount() {
        const winWidth = document.documentElement.clientWidth;
        const winHeight = document.documentElement.clientHeight;
        this.props.rootStore.treeStore.updateWinSize({width: winWidth, height: winHeight});
        this.winResize = (e) => {
            this.props.rootStore.treeStore.updateWinSize({
                width: document.documentElement.clientWidth,
                height: document.documentElement.clientHeight,
            });
        };
        window.addEventListener('resize', this.winResize, false);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.winResize, false);
    }

    componentDidMount() {
        //角色权限变动以后需要刷新的数据
        if (!this.props.rootStore.authorityStore.loginVisible) {
            Promise.all([
                this.props.rootStore.authorityStore.loadAllbuttons(),
                //this.props.rootStore.treeStore.initCurrentRoleMenu(),
                this.props.rootStore.treeStore.initRoot(),
                this.props.rootStore.notificationStore.loadSystemAccess(),
                this.props.rootStore.activitiStore.loadCurrentTask()
            ]);
        }
    }

    render() {
        const {loginVisible} = this.props.rootStore.authorityStore;
        const treeStore = this.props.rootStore.treeStore;
        const {winWidth, winHeight, headerHeight, menuHeight, footerHeight} = treeStore;
        const userOperations = (
            <ul className="popover-list">
                {/*<li onClick={this.props.rootStore.notificationStore.toggleApplyPlatformVisible}>*/}
                <li onClick={this.props.rootStore.activitiStore.startProcess('platform_apply')}>
                    <Icon type="user-add"/>&nbsp;&nbsp; 申请平台访问权限
                </li>
                <li onClick={this.props.rootStore.activitiStore.startProcess('platform_cancel')}>
                    <Icon type="user-delete"/>&nbsp;&nbsp; 注销平台访问权限
                </li>
                <li>
                    <Icon type="profile"/>&nbsp;&nbsp; <Link to="/modifyUser">修改用户信息</Link>
                </li>
                <li onClick={this.props.rootStore.authorityStore.logout}>
                    <Icon type="poweroff"/>&nbsp;&nbsp; 退出
                </li>
            </ul>
        );
        // 未登录
        if (loginVisible) {
            return (
                <div className="extend-layout" style={{height: "100%"}}>
                    <Switch>
                        <Route path="/register" component={UserRegisterForm}/>
                        <Route path="/login" component={Login}/>
                        <Redirect path="/" to="/login"/>
                    </Switch>
                    <footer>© 云南省地质矿产勘查开发局</footer>
                </div>
            );
        }
        // 已登录
        //console.log( this.props.rootStore.treeStore.menuTreeData.filter(d=>d));
        return (
            <div id="mainBox">
                <header>
                    <div id="headerBox">
                        <div id="logoBox">
                            <span className="text">云南地质大数据平台综合集成门户</span>
                        </div>
                        {/*<div id="searchBox">*/}
                        {/*<Input type="text" />*/}
                        {/*<Icon type="search" />*/}
                        {/*</div>*/}
                        <Popover placement="bottom" trigger="hover" content={userOperations}>
                            <div id="userBox">
                                <Icon type="user"/>
                                <span
                                    className="name">&nbsp;&nbsp;{sessionStorage.getItem('currentUserName')}&nbsp;</span>
                                <Icon type="down" style={{fontSize: '12px'}}/>
                            </div>
                        </Popover>
                        {/*<Badge id="messageBox" dot={true} count={this.props.rootStore.notificationStore.messages.filter(d => d).length}>*/}
                        {/*<Icon*/}
                        {/*type="message"*/}
                        {/*onClick={this.props.rootStore.notificationStore.toggleMessageTableVisible}*/}
                        {/*/>*/}
                        {/*</Badge>*/}
                        <Badge id="messageBox" style={{backgroundColor: '#52c41a'}}
                               count={this.props.rootStore.activitiStore.currentTask.filter(d => d).length}>
                            <Icon
                                type="message"
                                onClick={this.props.rootStore.activitiStore.showUserTaskTableVisible}
                            />
                        </Badge>
                    </div>
                    <MenuTree/>
                </header>
                <Switch>
                    <Route exact path="/" render={() => <Redirect to="/home"/>}/>
                    <Route exact path="/login" render={() => <Redirect to="/home"/>}/>
                    <Route exact path="/home" component={Home}/>
                    <Route exact path="/modifyUser" component={ModifyUserForm}/>
                    <Route exact path="/applyCloud" component={CloudForm}/>
                    <Route exact path="/createOracleUser" component={CreateOracleUserForm}/>
                    {
                        this.props.rootStore.treeStore.currentRoleMenu
                            .filter(d => d)
                            .filter(m => m.path)
                            .map(m => {
                                if (m.page_path === 'summary') {
                                    return (
                                        <Route
                                            key={m.id}
                                            exact
                                            path={m.path + (m.path_holder ? m.path_holder : '')}
                                            component={require('../' + m.page_path)[m.page_class]}
                                        />
                                    )
                                }
                                if (m.page_class === 'CommonLayOut') {
                                    return (
                                        <Route
                                            key={m.id}
                                            exact
                                            path={m.path + (m.path_holder ? m.path_holder : '')}
                                            render={() => (
                                                <div id="contentBox" style={{
                                                    width: winWidth - 32,
                                                    height: winHeight - headerHeight - menuHeight - footerHeight - 16
                                                }}>
                                                    <PropsRoute component={require('../' + m.page_path)[m.page_class]}
                                                                defaultQueryObj={m.defaultQueryObj} />
                                                </div>
                                            )}
                                        />
                                    )
                                }
                                return (
                                    <Route
                                        key={m.id}
                                        exact
                                        path={m.path + (m.path_holder ? m.path_holder : '')}
                                        render={() => (
                                            <div id="contentBox" style={{
                                                width: winWidth - 32,
                                                height: winHeight - headerHeight - menuHeight - footerHeight - 16
                                            }}>
                                                <Route component={require('../' + m.page_path)[m.page_class]}/>
                                            </div>
                                        )}
                                    />
                                )

                            })
                    }
                </Switch>
                <footer>© 云南省地质矿产勘查开发局</footer>
                <Modal visible={this.props.rootStore.notificationStore.applyPlatformVisible}
                       width={600}
                       title={`申请平台访问权限`}
                       footer={null}
                       onCancel={this.props.rootStore.notificationStore.toggleApplyPlatformVisible}
                       maskClosable={false}
                       destroyOnClose={true}
                >
                    <ApplyPlatform/>
                </Modal>
                {/*<Modal visible={this.props.rootStore.notificationStore.messageTableVisible}*/}
                {/*width={1000}*/}
                {/*title={`代办事项`}*/}
                {/*footer={null}*/}
                {/*onCancel={this.props.rootStore.notificationStore.toggleMessageTableVisible}*/}
                {/*maskClosable={false}*/}
                {/*destroyOnClose={true}*/}
                {/*>*/}
                {/*<MessageTable />*/}
                {/*</Modal>*/}
                <Modal visible={this.props.rootStore.activitiStore.userTaskTableVisible}
                       width={1000}
                       title={`待办事项`}
                       footer={null}
                       onCancel={this.props.rootStore.activitiStore.toggleUserTaskTableVisible}
                       maskClosable={false}
                       destroyOnClose={true}
                >
                    <UserTaskTable/>
                </Modal>
                <Modal visible={this.props.rootStore.authorityStore.alertMessageVisible}
                       width={700}
                       title={`welcome`}
                       footer={null}
                       onCancel={this.props.rootStore.authorityStore.toggleAlertMessageVisible}
                       maskClosable={false}
                       destroyOnClose={true}
                >
                    <div>
                        欢迎各位使用综合集成平台,由于平台刚刚投入使用,难免存在各种bug,
                        如果大家在使用中发现各种问题,请把问题截图和对应的说明发送到邮箱syuyuusyu@gmail.com,我们会尽快处理,谢谢大家!
                    </div>
                </Modal>
            </div>
        );
    }
}

export default withRouter(Main);
