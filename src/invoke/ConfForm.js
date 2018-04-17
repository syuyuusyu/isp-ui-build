import React from 'react';
import { Form, Row, Col, Input, Button ,Select,Modal,Progress} from 'antd';
import ParamsForm from './ParamsForm';
import {baseUrl, get,} from "../util";

const FormItem = Form.Item;
const Option = Select.Option;
const {TextArea}=Input;


class ConfForm extends React.Component{
    state = {
        next:[],
        saveVisible:false,
        savePercent:0,
        saveStatus:'active',
        paramVisible:false,
        queryStr:[],
        currentInvoke:{}
    };

    componentWillUnmount(){
        //this.props.close=null;
    }
    async componentDidMount(){
        if(this.props.data){
            const data=this.props.data;
            this.props.form.setFieldsValue({
                head:data.head,
                method:data.method,
                next:data.next?data.next.split(','):[],
                parseFun:data.parseFun,
                descrption:data.descrption,
                url:data.url,
                body:data.body,
                name:data.name,
                groupName:data.groupName
            });
        }
        if(this.props.invokeType==='2'){
            this.props.form.setFieldsValue({
                method:'post',
                head:
`{
    "Accept":"application/json",
    "Content-Type":"application/json;charset=UTF-8",
}`
            });
        }
        let response=await fetch(`${baseUrl}/invokeInfo/invokes` , {
                method: 'POST',
                headers: new Headers({
                    'Content-Type': 'application/json',
                    'Access-Token': sessionStorage.getItem('access-token') || ''
                }),
                body: JSON.stringify({}),
            }
        );
        let json=await response.json();
        json=json.map(o=>({
            id:o.id,name:o.name
        }));
        this.setState({next:json});
    };

    async componentWillReceiveProps(){

    };

    taggleParamForm=()=>{
        this.setState({paramVisible:!this.state.paramVisible})
    };

    test=()=>{
        this.props.form.validateFields((err,values)=>{
            if(err) return;
            if(values.next && values.next.length===0){
                delete values.next;
            }else if(values.next && values.next.length>0){
                values.next=values.next.reduce((a,b)=>a+','+b);
            }
            this.setState({currentInvoke:values});
            let queryStr = [];
            (values.url + values.head + values.body).replace(/@(\w+)/g, function (w, p1) {
                queryStr.push(p1);
            });
            this.setState({queryStr});
            this.taggleParamForm();
        });
    };

    handleReset = () => {
        this.props.form.resetFields();
    };

    save=()=>{
        this.props.form.validateFields(async (err,values)=>{
            if(err) return;
            if(this.props.data){
                values.id=this.props.data.id;
            }
            values.next=values.next?values.next:[];
            values.invokeType=this.props.invokeType;
            if(values.next.length===0){
                delete values.next;
            }else{
                values.next=values.next.reduce((a,b)=>a+','+b);
            }
            this.setState({saveVisible:true});
            let response=await fetch(`${baseUrl}/invokeInfo/save` , {
                    method: 'POST',
                    headers: new Headers({
                        'Content-Type': 'application/json',
                        'Access-Token': sessionStorage.getItem('access-token') || ''
                    }),
                    body: JSON.stringify(values),
                }
            );
            this.setState({savePercent:75});
            let json=await response.json();
            if(json.success){
                this.setState({savePercent:100,saveStatus:'success'});
            }else{
                this.setState({savePercent:100,saveStatus:'exception'});
            }
            //setTimeout(()=>{this.setState({saveVisible:false})},2000);
            this.props.close();
            this.props.reloadTable();
        })
    };

    checkUnique=async(rule, value, callback)=>{
        if(this.props.data){
            if(this.props.data.name===value){
                callback();
            }
        }
        let json=await get(`${baseUrl}/invokeInfo/checkUnique/${value}`);
        //let json=await response.json();
        if(json.total===0){
            callback();
        }else{
            callback(new Error());
        }

    };



    render() {
        const { getFieldDecorator, } = this.props.form;

        return (
            <div>
                <Modal key="saveStatus" visible={this.state.saveVisible} footer={null}>
                    <Progress type="circle" percent={this.state.savePercent} status={this.state.saveStatus}  />
                </Modal>
                <Modal visible={this.state.paramVisible} footer={null}  onCancel={this.taggleParamForm}
                       maskClosable={false}
                       destroyOnClose={true}>
                    <ParamsForm invokeType={this.props.invokeType} params={this.state.queryStr} currentInvoke={this.state.currentInvoke}/>
                </Modal>
                <Form>
                    <Row gutter={24}>
                        <Col span={6}>
                            <FormItem label="调用名称">
                                {getFieldDecorator('name',{
                                    rules: [{ validator: this.checkUnique, message: '调用名称必须唯一', }],
                                    validateTrigger:'onBlur'
                                })(
                                    <Input placeholder="输入调用名称" />
                                )}
                            </FormItem>
                        </Col>
                        <Col span={6}>
                            <FormItem label="组名称">
                                {getFieldDecorator('groupName',{

                                })(
                                    <Input  placeholder="组名称" />
                                )}
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem label="描述">
                                {getFieldDecorator('descrption')(
                                    <Input placeholder="输入描述信息" />
                                )}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row gutter={24}>
                        <Col span={6}>
                            <FormItem label="请求方法">
                                {getFieldDecorator('method',{
                                    rules: [{ required: this.props.invokeType==='1'?true:false, message: '此项为必填项!!' }],
                                    initialValue:'get'
                                })(
                                    <Select disabled={this.props.invokeType==='1'?false:true} onChange={null}>
                                        <Option key="get">GET</Option>
                                        <Option key="post">POST</Option>
                                        <Option key="put">PUT</Option>
                                        <Option key="delete">DELETE</Option>
                                    </Select>
                                )}
                            </FormItem>
                        </Col>
                        <Col span={6}>
                            <FormItem label="关联请求">
                                {getFieldDecorator('next',{
                                    rules: [{ required: this.props.invokeType==='2'?true:false, message: '此项为必填项!!' }],
                                })(
                                    <Select  onChange={null}  mode="multiple">
                                        {
                                            this.state.next.map((o,i)=><Option key={o.id}>{o.name}</Option>)
                                        }
                                    </Select>
                                )}
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem label="URL">
                                {getFieldDecorator('url',{
                                    rules: [{ required: this.props.invokeType==='1'?true:false, message: 'url不符合规范',
                                        //pattern: /(https?|ftp|file):\/\/[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]/
                                    }],
                                })(
                                    <Input disabled={this.props.invokeType==='1'?false:true} placeholder="输入请求URL" />
                                )}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row gutter={24}>
                        <Col span={12}>
                            <FormItem label="请求头">
                                {getFieldDecorator('head',{
                                    rules: [{ required: this.props.invokeType==='1'?true:false, message: '此项为必填项!!' }],
                                })(
                                    <TextArea disabled={this.props.invokeType==='1'?false:true} rows={6}
                                              placeholder={`
{
    "Accept":"application/json",
    "Content-Type":"application/json;charset=UTF-8"
}
                                              `}
                                    />
                                )}
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem label="请求体">
                                {getFieldDecorator('body',{
                                    rules: [{ required: true, message: '此项为必填项!!' }],
                                })(
                                    <TextArea  rows={6} />
                                )}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <FormItem label="解析函数">
                            {getFieldDecorator('parseFun',{

                            })(
                                <TextArea rows={8} placeholder="解析函数回调参数:response,responsehead,responsestatus,requesthead,requestdata,url"/>
                            )}
                        </FormItem>
                    </Row>
                    <Row>
                        <Col span={24} style={{ textAlign: 'right' }}>
                            <Button icon="play-circle" onClick={this.test}>测试</Button>
                            <Button icon="save" onClick={this.save} >保存</Button>
                            <Button type="reload" onClick={this.handleReset}>重置</Button>

                        </Col>
                    </Row>
                </Form>
            </div>
        );
    }
}

export default  Form.create()(ConfForm);
