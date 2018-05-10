import React, { Component } from 'react';
import {inject,observer} from 'mobx-react';
import { Form, Input,Row,Col,Button,notification} from 'antd';
import {baseUrl,post} from "../util";
const FormItem = Form.Item;

@inject('rootStore')
@observer
class AddOrgForm extends Component{
/*  componentDidMount(){
    const store=this.props.rootStore.orgOperationStore;
    if(store.selectedOrg){
      this.props.form.setFieldsValue({
        name:store.selectedOrg.name})
    }
  }*/

  save=()=>{
    const store=this.props.rootStore.orgOperationStore;
    this.props.form.validateFields(async (err,values)=>{
      if(err) return;
      if(store.currentOrgId!==-1){
        values.parent_id=store.currentOrgId;
        //values.is_detailed='1';
        values.is_leaf=store.isLeaf;
        values.parent_name=store.currentOrgName;
        values.path=store.currrentPath;
      }
      let json=await post(`${baseUrl}/org/saveAdd` ,  JSON.stringify(values));
      if(json.success){
        notification.success({
          message:'保存成功',
        })
      }else{
        notification.error({
          message:'后台错误，请联系管理员',
        })
      }
      store.toggleOrgAddVisible();
      store.loadCurrentOrg();
      //this.props.rootStore.orgOperationStore.loadAllbuttons();
    })
  };
  render(){
    const { getFieldDecorator, } = this.props.form;
    return (
      <Form>
        <Row>
          <FormItem label="新增机构信息">
            {getFieldDecorator('name',{
              rules: [{ required: true, message: '此项为必填项!!'}],
            })(
              <Input placeholder="请输入机构信息" />
            )}
          </FormItem>
        </Row>
        <Row>
          <Col span={24} style={{ textAlign: 'right' }}>
            <Button icon="save" onClick={this.save}>保存</Button>
            {/*<Button icon="reload" onClick={this.handleReset}>重置</Button>*/}

          </Col>
        </Row>
      </Form>
    );
  }
}
export default Form.create()(AddOrgForm);
