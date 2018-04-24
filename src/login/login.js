import React from 'react';
import { inject, observer } from 'mobx-react';
import { Icon, Form, Button, notification, Input, Row, Col, Modal } from 'antd';
import { baseUrl } from '../util';
import './login-3.css';
import UserRegisterForm from '../signUp/userRegisterForm';

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
          <img src="../../public/images/logo-big.png" alt="logo" />
        </div>
        <div className="content">
          <Form className="login-form">
            <h3 className="form-title">使用账号密码登录</h3>
            <Row>
              <FormItem label="用户名">
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
                  (<Input prefix={<Icon type="lock" />} type="password" placeholder="请输入密码" />)}
              </FormItem>
            </Row>
            <Row >
              <Col span={25} style={{ textAlign: 'center' }} >
                <Button icon="login" onClick={this.login}>登录</Button>
                {/* <Button icon="reload" onClick={this.handleReset}>我要休息</Button> */}
                <Button icon="user" onClick={this.store.toggleRegFormVisible}>注册</Button>
              </Col>
            </Row>
          </Form>
        </div>
        <Modal visible={this.store.regFormVisible}
          width={500}
          title="用户注册"
          footer={null}
          onCancel={this.store.toggleRegFormVisible}
          maskClosable={false}
          destroyOnClose={true}
        >
          <UserRegisterForm />
        </Modal>
      </div>

    );
  }
}

export default Form.create()(Login);
