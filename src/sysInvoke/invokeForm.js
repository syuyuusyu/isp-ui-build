import React from 'react';
import { Form, Row, Col, Input, Button ,Select,notification} from 'antd';
import {baseUrl,post} from "../util";
import {inject, observer} from 'mobx-react';

const FormItem = Form.Item;
const Option = Select.Option;
const {TextArea}=Input;

@inject('rootStore')
@observer
class InvokeForm extends React.Component{

    componentDidMount(){
        const row=this.props.rootStore.invokeOpStore.selectRow;
        if(row){
            this.props.form.setFieldsValue({
                head:row.head,
                method:row.method,
                info:row.info,
                body:row.body,
                path:row.path,
                name:row.name,
                result:row.result,
                //code:row.code
            });
        }
    }

    save=()=>{
        this.props.form.validateFields(async (err,values)=>{
            if(this.props.rootStore.invokeOpStore.selectRow){
                values.id=this.props.rootStore.invokeOpStore.selectRow.id;
            }
            values.type='3';
            values.system_id=this.props.rootStore.invokeOpStore.currentSys.id;
            let json=await post(`${baseUrl}/op/save` ,JSON.stringify(values));
            if(json.success){
                notification.success({
                    message:'保存成功',
                })
            }else{
                notification.error({
                    message:'后台错误，请联系管理员',
                })
            }
            this.props.rootStore.invokeOpStore.loadOperationById(this.props.rootStore.invokeOpStore.currentSys.id);
            this.props.rootStore.invokeOpStore.toggleFormVisible();
        });
    };

    handleReset = () => {
        this.props.form.resetFields();
    };

    render(){
        const { getFieldDecorator, } = this.props.form;
        return (
            <Form>
                <Row gutter={24}>
                    <Col span={6}>
                        <FormItem label="名称">
                            {getFieldDecorator('name',{
                                rules: [{ required: true, message: '此项为必填项!!' }],
                            })(
                                <Input placeholder="输入调用名称" />
                            )}
                        </FormItem>


                    </Col>
                    <Col span={6}>
                        <FormItem label="请求方法">
                            {getFieldDecorator('method',{
                                rules: [{ required: true, message: '此项为必填项!!' }],
                                initialValue:'get'
                            })(
                                <Select  onChange={null}>
                                    <Option key="get">GET</Option>
                                    <Option key="post">POST</Option>
                                    <Option key="put">PUT</Option>
                                    <Option key="delete">DELETE</Option>
                                </Select>
                            )}
                        </FormItem>

                    </Col>
                    <Col span={12}>
                        <FormItem label="路径">
                            {getFieldDecorator('path',{
                                rules: [{ required: true, message: '此项为必填项!!' }],
                            })(
                                <Input placeholder="输入调用名称" />
                            )}
                        </FormItem>
                    </Col>

                </Row>
                <Row gutter={24}>
                    <Col span={12}>
                        <FormItem label="请求头示例">
                            {getFieldDecorator('head',{
                                rules: [{ required: true, message: '此项为必填项!!' }],
                            })(
                                <TextArea  rows={6} />
                            )}
                        </FormItem>
                    </Col>
                    <Col span={12}>
                        <FormItem label="请求体示例">
                            {getFieldDecorator('body',{
                                rules: [{ required: true, message: '此项为必填项!!' }],
                            })(
                                <TextArea  rows={6} />
                            )}
                        </FormItem>
                    </Col>
                </Row>
                <Row gutter={24}>
                    <Col span={12}>
                        <FormItem label="返回结果示例">
                            {getFieldDecorator('result',{

                            })(
                                <TextArea rows={8} />
                            )}
                        </FormItem>
                    </Col>

                    <Col span={12}>
                        <FormItem label="说明">
                            {getFieldDecorator('info',{

                            })(
                                <TextArea rows={8} />
                            )}
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span={24} style={{ textAlign: 'right' }}>
                        <Button icon="save" onClick={this.save} >保存</Button>
                        <Button type="reload" onClick={this.handleReset}>重置</Button>

                    </Col>
                </Row>
            </Form>
        );
    }

}


export default  Form.create()(InvokeForm);
