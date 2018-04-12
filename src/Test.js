import React, { Component } from 'react';
import { Layout, Breadcrumb,  } from 'antd';
import {inject,observer} from 'mobx-react';

import {Link,Switch,Route,withRouter} from 'react-router-dom';
// import InvkeGrid from "./invoke";
const { Header, Content, Sider } = Layout;

@inject('rootStore')
@observer
class Test extends Component{

    render(){
        console.log(this.props.location);
        return (
            <Layout style={{height:'100%'}}>
                <Header className="header">
                    <div className="logo" />


                </Header>
                <Layout>
                    <Sider width={200} style={{ background: '#fff' }}>
                        <div>
                            <Link to="/">1</Link><br/>
                            <Link to="/invoke">2</Link><br/>
                            <Link to="/some">3</Link><br/>
                        </div>
                    </Sider>
                    <Layout style={{ padding: '0 12px 12px' }}>
                        <Breadcrumb style={{ margin: '16px 0' }}>
                            <Breadcrumb.Item><Link to="/">#</Link></Breadcrumb.Item>
                            <Breadcrumb.Item>List</Breadcrumb.Item>
                            <Breadcrumb.Item>App</Breadcrumb.Item>
                        </Breadcrumb>
                        <Content style={{ background: '#fff', padding: 24, margin: 0, minHeight: 280 }}>
                            <Switch>
                                <Route exact path='/' ><div>sdsdsdsdsd</div></Route>
                                <Route exact path='/invoke' ><div>111111</div></Route>
                                <Route exact path='/some' ><div>some</div></Route>
                            </Switch>
                        </Content>
                    </Layout>
                </Layout>
            </Layout>

        );
    }
}

export default withRouter(Test);