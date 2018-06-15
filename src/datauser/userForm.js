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

    render(){
      const store = this.props.rootStore.dataUserStore;
        const { getFieldDecorator, } = this.props.form;
        return (
            <div>
                <Spin indicator={antIcon} tip={store.loadingtest} spinning={store.loading}>
                  <p>请选择数据库实例:</p>
                      <Select style={{ width: 300 }} onChange={store.selectedAcc}>
                        {store.testData.map(d =>
                        <Option key={d.id} value={d.name}>{d.name}</Option>
                        )}
                      </Select>
                  <br/>
                  <br/>
                    <Form style={{display:store.formDisplay}}>
                        <Row>
                            <FormItem label="用户名">
                                {getFieldDecorator('name',{
                                    rules: [{ required: true, message: '必填' }],
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
