import React from 'react';
import { Form, Row, Col, Button ,notification,Select,Spin,Icon,Input} from 'antd';
import {inject,observer} from 'mobx-react';
import {baseUrl, get, post} from '../util';

const Option=Select.Option;
const FormItem = Form.Item;
const antIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;


@inject('rootStore')
@observer
class UserForm extends React.Component{

    componentDidMount(){
      //this.props.rootStore.dataUserStore.loadDataAcc();
    }

    save=()=>{
        this.props.form.validateFields(async (err,values)=>{
            if(err) return;
            this.props.rootStore.dataUserStore.save(values);
        })
    };

    checkpwd=async(rule, value, callback)=>{
        if(value===this.props.rootStore.dataUserStore.firstPwd){
            callback();
        }else{
            callback(new Error());
        }

    };

     checkUserName=(rule, value, callback)=>{
       const store=this.props.rootStore.dataUserStore;
       const instanceName=this.getInstanceName();
       let boolean=false;
       if (!value) {
         callback();
       }
       //判断在选择的实例下是否已经有输入的用户名
       for(let i of store.allDataUsers){
        if(i.instanceName===instanceName&&i.username===value){
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
    const store=this.props.rootStore.dataUserStore;
    //根据选择的数据库实例的id查询出该实例的名称
    let instanceName;
    for(let i of store.dataAcc.result){
      if(i.id===store.selectedAccId){
        instanceName=i.name;
        break;
      }
    }
    return instanceName;
  };

    render(){
      const store = this.props.rootStore.dataUserStore;
        const { getFieldDecorator, } = this.props.form;
        return (
            <div>
                <Spin indicator={antIcon} tip={store.loadingtest} spinning={store.loading}>
                  <p>请选择数据库实例:</p>
                  <Select className="col-input"  onChange={store.selectedAcc} style={{width:'300px'}}>
                    {
                      store.dataAcc.result.filter(d=>d).filter(d=>d.dbType==='0'||d.dbType==='1').map(s=>
                        <Option key={s.id} value={s.id}>{s.name}</Option>)
                    }
                  </Select>
                  <br/>
                  <br/>
                    <Form style={{display:store.formDisplay}}>
                        <Row>
                            <FormItem label="用户名">
                                {getFieldDecorator('name',{
                                    rules: [{ required: true, message: '必填' },
                                      {validator: this.checkUserName}],
                                  validateTrigger: 'onBlur'
                                })(
                                    <Input  placeholder='输入用户名'/>
                                )}
                            </FormItem>
                            <FormItem label="密码">
                                {getFieldDecorator('pwd',{
                                    rules: [{ required: true, message: '必填' }],
                                })(
                                    <Input placeholder='输入密码' type='password' onBlur={this.props.rootStore.dataUserStore.setFirstPwd}/>
                                )}
                            </FormItem>
                            <FormItem label="确认密码">
                                {getFieldDecorator('pwd1',{
                                    rules: [{ validator: this.checkpwd, message: '两次密码不同', },
                                        { required: true, message: '必填' }],
                                    validateTrigger:'onBlur'
                                })(
                                    <Input placeholder='确认密码' type='password'/>
                                )}
                            </FormItem>
                        </Row>
                        <Row>
                            <Col span={24} style={{ textAlign: 'right' }}>
                                <Button icon="save" onClick={this.save}>新建</Button>
                            </Col>
                        </Row>
                    </Form>
                </Spin>
            </div>
        );
    }
}


export default  Form.create()(UserForm);
