import React from 'react';
import { inject, observer } from 'mobx-react';
import { Form, Button, notification, Input, Row, Col } from 'antd';
import { baseUrl } from '../util';
import './login-3.css';
import logo from '../assets/images/logo-big.png'

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
            this.props.rootStore.treeStore.initRoot()
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
          <img src={logo} alt="logo" />
        </div>
        <div className="content">
          <Form className="login-form">
            <h3 className="form-title">使用账号密码登录</h3>
            <Row>
              <FormItem label="用户名">
                {getFieldDecorator('user_name', {
                  rules: [{ required: true, message: '用户名不能为空' }],
                  validateTrigger: 'onBlur',
                })(<Input placeholder="请输入用户名" />)}
              </FormItem>
            </Row>
            <Row>
              <FormItem label="密码">
                {getFieldDecorator('passwd', {
                  rules: [{ required: true, message: '密码不能为空' }],
                })(<Input placeholder="请输入密码" />)}
              </FormItem>
            </Row>

            <Row>
              <Col span={24} style={{ textAlign: 'right' }}>
                <Button icon="login" onClick={this.login} type="primary">登录</Button>
                {/* <Button icon="reload" onClick={this.handleReset}>重置</Button> */}
              </Col>
            </Row>
          </Form>
        </div>
      </div>
    );
  }
}

export default Form.create()(Login);
