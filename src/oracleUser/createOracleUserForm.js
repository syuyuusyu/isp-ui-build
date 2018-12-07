import React from 'react';
import { Form, Row, Col, Button ,notification,Select,Spin,Icon,Input} from 'antd';
import {inject,observer} from 'mobx-react';
import {baseUrl, get, post} from '../util';

const Option=Select.Option;
const FormItem = Form.Item;
const antIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;

@inject('rootStore')
@observer
class CreateOracleUserForm extends  React.Component{


  componentDidMount() {
    this.props.rootStore.oracleUserStore.loadDataAccForCreate();
    this.props.rootStore.oracleUserStore.initStatus();
  }

  checkUserName=(rule, value, callback)=>{
    const store=this.props.rootStore.oracleUserStore;
    const instanceName=this.getInstanceName();
    let boolean=false;
    if (!value) {
      callback();
    }
    //判断在该实例下是否已经有相同的用户名
    for(let j of store.allOracleUser){
      if(j.instanceName===instanceName&&j.username===value){
        boolean=true;
        break;
      }
    }
    if(boolean===true){
      callback(`"${instanceName}"实例下已经有"${value}"用户名`);
    }else{
      callback();
    }
  };

  getInstanceName=()=>{
    const store=this.props.rootStore.oracleUserStore;
    //根据选择的数据库实例的id查询出该实例的名称
    let instanceName;
    for(let i of store.dataAcc){
      if(i.id===store.selectedAccId){
        instanceName=i.name;
        break;
      }
    }
    return instanceName;
  };

  validateToNextPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && false) {
      form.validateFields(['confirm'], { force: true });
    }
    callback();
  };

  compareToFirstPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && value !== form.getFieldValue('password')) {
      callback('两次输入的密码不一致');
    } else {
      callback();
    }
  };

  save=()=>{
    this.props.form.validateFields(async (err,values)=> {
      if(err) return;
      this.props.rootStore.oracleUserStore.save(values)
    });
  };

  render(){

    const store=this.props.rootStore.oracleUserStore;
    const { getFieldDecorator, } = this.props.form;
    const treeStore = this.props.rootStore.treeStore;
    return(
        <div className="createOracle-box" >
        <Spin indicator={antIcon} tip={store.loadingInfo} spinning={store.loading}>
          <br/>
          <p style={{fontSize: '16px'}}>请选择数据库实例:</p>
          <Select className="col-input"  onChange={store.selectedAcc} style={{width:'300px'}}>
            {
              store.dataAcc.filter(d=>d).map(s=>
                <Option key={s.id} value={s.id}>{s.name}</Option>)
            }
          </Select>
          <br/>
          <br/>
          <Form style={{display:store.formDisplay}}>
            <Row gutter={26}>
              <Col span={10}>
                <FormItem label="用户名">
                  {getFieldDecorator('name',{
                    rules: [{ required: true, message: '必填' },
                      {validator: this.checkUserName}],
                    validateTrigger: 'onBlur'
                  })(
                    <Input placeholder='请输入用户名'/>
                  )}
                </FormItem>
                <FormItem label="密码">
                  {getFieldDecorator('password', {
                    rules: [{
                      required: true, message: '密码不能为空',
                    }, {
                      validator: this.validateToNextPassword,
                    }],
                    validateTrigger: 'onBlur'
                  })(
                    <Input type="password" placeholder="请输入密码"/>
                  )}
                </FormItem>
                <FormItem label="确认密码">
                  {getFieldDecorator('confirmPassword', {
                    rules: [{
                      required: true, message: '确认密码不能为空',
                    }, {
                      validator: this.compareToFirstPassword,
                    }],
                    validateTrigger: 'onBlur'
                  })(
                    <Input type="password" placeholder="请输入确认密码" />
                  )}
                </FormItem>
              </Col>
            </Row>
          </Form>
          <Form style={{display:store.formDisplay}}>
            <p style={{fontSize: '16px'}}>请选择默认表空间:</p>
            {store.defaultSpaces.filter(d=>d).map(a => {
              return (
                <Button className="spaceselect-button" key={a.tablespace_name} title={'表空间名:' + a.tablespace_name + ' 类型:' + a.type + ' 总大小:' + a.total + 'MB'+' 已使用:'+a.used} size="large"
                        style={{border:store.defaultSpacesBorder[a.tablespace_name],color:store.defaultSpacesFontColor[a.tablespace_name]}} onClick={()=>{store.onClickDefaultSpaces(a.tablespace_name)}}
                >{a.tablespace_name}</Button>
              );
            })}
          </Form>
          <Form style={{display:store.formDisplay}}>
            <p style={{fontSize: '16px'}}>请选择临时表空间:</p>
            {store.temporarySpaces.filter(d=>d).map(a => {
              return (
                <Button className="spaceselect-button" key={a.tablespace_name} title={'表空间名:' + a.tablespace_name + ' 类型:' + a.type + ' 总大小:' + a.total + 'MB'+' 已使用:'+a.used} size="large"
                        style={{border:store.temporarySpacesBorder[a.tablespace_name],color:store.temporarySpacesFontColor[a.tablespace_name]}} onClick={()=>{store.onClickTemporarySpaces(a.tablespace_name)}}
                >{a.tablespace_name}</Button>
              );
            })}
          </Form>
          <div className="createOracle-button">
            <br/>
            <br/>
            <Button icon="save" onClick={this.save} type="primary" htmlType="submit" style={{display:store.formDisplay}}>新建</Button>
            <Button icon="reload" href="/oracleUser" style={{display:store.formDisplay}}>返回</Button>
          </div>
        </Spin>
        </div>
    );
  }
}
export default  Form.create()( CreateOracleUserForm);

