import React,{Component} from 'react';
import { Form, Row, Col, Input, Button ,Select, Modal,notification} from 'antd';
import {baseUrl, get} from "../util";
import {inject, observer} from "mobx-react";
import FileForm from "../swift/fileForm";

const FormItem = Form.Item;
const crypto = require('crypto');
@inject('rootStore')
@observer
class ModifyUserForm extends component{
    render(){
      const {getFieldDecorator} = this.props.form;
      return(
        <div>
          <Form>
            <Row>
              <FormItem label='账号' >
                <input readOnly='readOnly'/>
              </FormItem>
            </Row>
          </Form>
        </div>
      );
    }
}
export default Form.create()(ModifyUserForm);
