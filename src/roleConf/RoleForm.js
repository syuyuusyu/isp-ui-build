import React from 'react';
import { Form, Row, Col, Input, Button ,notification,Select} from 'antd';
import {inject,observer} from 'mobx-react';
import {baseUrl,post} from '../util';
const Option=Select.Option;
const FormItem = Form.Item;

@inject('rootStore')
@observer
class RoleForm extends React.Component{

    systemId=1;

    constructor(){
        super(...arguments);
        this.store=this.props.rootStore.roleStore;
    }

    componentDidMount(){
        const store=this.store;
        this.props.form.setFieldsValue({
            system_id:this.systemId?this.systemId:1,
            //type:this.props.roleType
        });
        if(store.selectRow){
            this.systemId=store.selectRow.system_id;
            this.props.form.setFieldsValue({
                system_id:store.selectRow.system_id,
                code:store.selectRow.code,
                name:store.selectRow.name,
                description:store.selectRow.description,
            });
        }
    }

    checkUnique=async(rule, value, callback)=>{
        if(this.store.selectRow){
            if(this.store.selectRow.code===value){
                callback();
            }
        }
        let json=await post(`${baseUrl}/role/codeUnique/`,{value:value,systemId:this.systemId});
        //let json=await response.json();
        if(json.total===0){
            callback();
        }else{
            callback(new Error());
        }

    };

    save=()=>{
        this.props.form.validateFields(async (err,values)=>{
            if(err) return;
            values.type=this.props.rootStore.roleStore.roleType;
            if(this.store.selectRow){
                values.id=this.store.selectRow.id;
            }
            let json=await post(`${baseUrl}/role/save` ,JSON.stringify(values));
            if(json.success){
                notification.success({
                    message:'保存成功',
                })
            }else{
                notification.error({
                    message:'后台错误，请联系管理员',
                })
            }
            this.store.taggreForm();
            this.store.loadAllRoles();
        })
    };


    handleReset = () => {
        this.props.form.resetFields();
    };

    setSystemId=(value)=>{
        this.systemId=value;
    };

    render(){
        const { getFieldDecorator, } = this.props.form;
        console.log(this.props.roleType);
        return (
            <Form>
                {
                    this.props.roleType==='1'?
                        (<Row>
                            <FormItem label="所属系统">
                                {getFieldDecorator('system_id',{
                                    rules: [{ required: true, message: '此项为必填项!!' }],
                                })(
                                    <Select onSelect={this.setSystemId}>
                                        {
                                            this.props.rootStore.roleStore.allSystem.map(i=>
                                                <Option key={i.id} value={i.id}>{i.name}</Option>
                                            )
                                        }
                                    </Select>
                                )}
                            </FormItem>
                        </Row>)
                        :(
                          ''
                        )
                }

                <Row>
                <FormItem label="编码">
                    {getFieldDecorator('code',{
                        rules: [{ validator: this.checkUnique,required: true,min:1, message: '此项必填或所属系统下已经存在相同编码的角色', }],
                        validateTrigger:'onBlur'
                    })(
                        <Input placeholder="输入角色编码"  />
                    )}
                </FormItem>
                </Row>
                <Row>
                <FormItem label="名称">
                    {getFieldDecorator('name',{
                        rules: [{ required: true, message: '此项为必填项!!' }],
                    })(
                        <Input placeholder="输入角色名称" />
                    )}
                </FormItem>
                </Row>
                <Row>
                <FormItem label="描述">
                    {getFieldDecorator('description',{

                    })(
                        <Input placeholder="输入角色说明" />
                    )}
                </FormItem>
                </Row>
                <Row>
                    <Col span={24} style={{ textAlign: 'right' }}>
                        <Button icon="save" onClick={this.save}>保存</Button>
                        <Button icon="reload" onClick={this.handleReset}>重置</Button>

                    </Col>
                </Row>
            </Form>
        );
    }
}

export default  Form.create()(RoleForm);