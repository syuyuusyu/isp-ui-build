import React, { Component } from 'react';
import {inject,observer} from 'mobx-react';
import { Form, Input,Row,Col,Button,notification} from 'antd';
import {baseUrl,post} from "../util";
const FormItem = Form.Item;

@inject('rootStore')
@observer
class ModifyOrgForm extends Component{
  componentDidMount(){
    const store=this.props.rootStore.orgOperationStore;
    if(store.selectedOrg){
      this.props.form.setFieldsValue({
        name:store.selectedOrg.name})
  }
}

save=()=>{
  const store=this.props.rootStore.orgOperationStore;
  this.props.form.validateFields(async (err,values)=>{
    if(err) return;
    //values.id=store.selectOrgid;
    //values.name=store.selectOrgName;
    if(store.selectedOrg){
      values.id=store.selectedOrg.id;
    }
    //console.log("value的值为：");
    //console.log(values);
    //console.log("value:"+value);
    let json=await post(`${baseUrl}/org/save` ,  JSON.stringify(values));
    if(json.success){
      notification.success({
        message:'保存成功',
      })
    }else{
      notification.error({
        message:'后台错误，请联系管理员',
      })
    }
    store.toggleOrgFormVisible();
    store.loadCurrentOrg();
    //this.props.rootStore.orgOperationStore.loadAllbuttons();
  })
};
  render(){
    const { getFieldDecorator, } = this.props.form;
    return (
      <Form>
        <Row>
          <FormItem label="机构名称">
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
export default Form.create()(ModifyOrgForm);
