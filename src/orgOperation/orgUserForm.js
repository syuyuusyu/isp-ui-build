import React, {Component} from 'react';
import {inject, observer} from 'mobx-react';
import {Form, Input, Row, Col, Button, notification} from 'antd';
import {baseUrl, post} from "../util";

const FormItem = Form.Item;
const Search = Input.Search;

@inject('rootStore')
@observer
class OrgUserForm extends Component {
  render() {
    const {getFieldDecorator,} = this.props.form;
    return (
      <Form>
        <Row>
          {/*<Col span={2} offset={2} style={{lineHeight: '32px'}}>系统平台:</Col>*/}
          <Search
            placeholder="请输入查询信息"
            onSearch={value => console.log(value)}
            enterButton
            style={{ width: '70%' }}
          />
        </Row>

      </Form>
    );
  }
}

export default Form.create()(OrgUserForm);

