import React from 'react';
import { Link } from 'react-router-dom'
import { inject, observer } from 'mobx-react';
import { Icon,Form, Button, notification, Input, Row, Col,Modal, Checkbox } from 'antd';
import { baseUrl } from '../util';
import './login-3.css';
//import UserRegisterForm from '../signUp/userRegisterForm';
import Logo from  '../assets/images/logo.png'

const FormItem = Form.Item;

@inject('rootStore')
@observer
class Login extends React.Component {
  constructor(props) {
    super();
    this.store = props.rootStore.authorityStore;
  }

  login = () => {
    this.props.form.validateFields(async (err, values) => {
      if (err) return;
      let response = await fetch(`${baseUrl}/login`, {
        method: 'POST',
        headers: new Headers({
          'Content-Type': 'application/json'
        }),
        body: JSON.stringify(values),
      }
      );
      let json = await response.json();
      switch (json.msg) {
        case '1':
          notification.success({
            message: '登录成功',
          });
          sessionStorage.setItem('access-token', json.token);
          sessionStorage.setItem('currentUserName', json.user.name);
          sessionStorage.setItem('user', JSON.stringify(json.user));
          await Promise.all([
                this.props.rootStore.authorityStore.loadAllbuttons(),
                this.props.rootStore.treeStore.initRoot(),
                this.props.rootStore.notificationStore.loadSystemAccess()
          ]);
          this.store.taggreLogin();
          break;
        case '2':
          notification.warning({
            message: '用户不存在',
          });
          break;
        case '3':
          notification.warning({
            message: '密码错误',
          });
          break;
        default:
          notification.error({
            message: '后台错误!',
          });
          break;
      }
    });
  };

  handleReset = () => {
    this.props.form.resetFields();
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div className="login">
        <div className="logo">

          <img src={Logo} alt="logo" />

        </div>
        <div className="content">
          <Form className="login-form">
            <div className="logo-title">
              <img src={Logo} />
              <h3>系统综合集成平台</h3>
            </div>
            <Row>
              <FormItem label="用户名" className="user-name">
                {getFieldDecorator('user_name', {
                  rules: [{ required: true, message: '用户名不能为空' }],
                  validateTrigger: 'onBlur',
                })
                  (<Input prefix={<Icon type="user" />} placeholder="请输入用户名" />)}
              </FormItem>
            </Row>
            <Row>
              <FormItem label="密码">
                {getFieldDecorator('passwd', {
                  rules: [{ required: true, message: '密码不能为空' }],
                })
                  (<Input prefix={<Icon type="lock" />} type="password" autoComplete="password" placeholder="请输入密码" />)}
              </FormItem>
              <Row>
                <Col span={25} style={{ textAlign: 'center' }}>
                  <Checkbox>记住我</Checkbox>
                </Col>
              </Row>
            </Row>
            <Row >
              <Col span={25}  >
                <Button type="primary" icon="login" className="login-button" onClick={this.login}>登录</Button>
                &nbsp;Or <Link to="/register">注册</Link>
                {/* <Button icon="reload" onClick={this.handleReset}>我要休息</Button> */}
                {/* <Button icon="user" onClick={this.store.toggleRegFormVisible}>注册</Button>*/}
              </Col>
            </Row>
          </Form>
        </div>
      </div>

    );
  }
}

export default Form.create()(Login);
