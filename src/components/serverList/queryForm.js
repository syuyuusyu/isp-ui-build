import React from 'react';
import { Form, Row, Col, Input, Button ,Select,notification} from 'antd';
import {baseUrl,post} from "../../util";
import {inject, observer} from 'mobx-react';

const FormItem = Form.Item;
const Option = Select.Option;
const {TextArea}=Input;

@inject('rootStore')
@observer
class ServiceQuery extends React.Component{

    componentDidMount(){

    }

    save=()=>{
        this.props.form.validateFields(async (err,values)=>{

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
                        <FormItem label="服务类型">
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
                                <Input placeholder="输入调用名称" />
                            )}
                        </FormItem>
                    </Col>
                    <Col span={12}>
                        <FormItem label="请求体示例">
                            {getFieldDecorator('body',{
                                rules: [{ required: true, message: '此项为必填项!!' }],
                            })(
                                <Input placeholder="输入调用名称" />
                            )}
                        </FormItem>
                    </Col>
                </Row>
                <Row gutter={24}>
                    <Col span={12}>
                        <FormItem label="返回结果示例">
                            {getFieldDecorator('result',{

                            })(
                                <Input placeholder="输入调用名称" />
                            )}
                        </FormItem>
                    </Col>

                    <Col span={12}>
                        <FormItem label="说明">
                            {getFieldDecorator('info',{

                            })(
                                <Input placeholder="输入调用名称" />
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


export default Form.create()(ServiceQuery);
