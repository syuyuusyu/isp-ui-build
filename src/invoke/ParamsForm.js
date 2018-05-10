import React from 'react';
import { Form, Input, Switch,Row,Col,Button,Modal,notification,} from 'antd';
import lodash from 'lodash';
import {format} from '../util';
import ParseForm from './ParseForm';
import InvokeParseForm from './invokeParesForm';
import {baseUrl,post} from '../util';
const FormItem = Form.Item;
const {TextArea}=Input;


class ParamsForm extends React.Component{

    state={
        from1Visible:false,
        from2Visible:false,
        from3Visible:false,
        invokeResult:{},
        invokeing:false,
        from3Result:{},
        from3ParseFun:''
    };

    componentDidMount(){
        if(this.props.invokeType==='2'){
            this.props.form.setFieldsValue({
                isNext:true
            });
        }
    }

    launch=()=>{
        if(this.props.invokeType==='1'){
            this.props.form.validateFields(async (err,queryMap)=>{
                let queryData=lodash.cloneDeep(this.props.currentInvoke);
                if(!queryMap.isNext){
                    delete queryData.next;
                    delete queryData.parseFun;
                }
                queryData.queryMap=queryMap;
                this.setState({invokeing:true});
                console.log(JSON.stringify(queryData));
                let json=await post(`${baseUrl}/invokeInfo/test` , JSON.stringify(queryData));



                if(json.success){
                    // delete json.success;
                    // delete json.msg;
                    this.setState({invokeResult:json});
                    if(!queryMap.isNext){
                        this.targgleForm2();
                    }else{
                        this.targgleForm1();

                    }
                }else{
                    notification.error({
                        message: '后台服务错误',
                        description: json.errInfo,
                    });
                }
                this.setState({invokeing:false});
            })
        }else if(this.props.invokeType==='2'){
            this.props.form.validateFields(async (err,queryMap)=>{
                let queryData=lodash.cloneDeep(this.props.currentInvoke);
                queryData.queryMap=queryMap;
                this.setState({invokeing:true});
                console.log(JSON.stringify(queryData.body));
                let json=await post(`${baseUrl}/invoke/${queryData.name}`, queryData.body);
                if(json){
                    // delete json.success;
                    // delete json.msg;
                    this.setState({from3Result:json});
                    this.setState({from3ParseFun:queryData.parseFun});
                    this.targgleForm3();
                }else{
                    notification.error({
                        message: '后台服务错误',
                        description: json.errInfo,
                    });
                }
                this.setState({invokeing:false});
            })
        }

    };

    createForm1(){
        console.log(this.state.invokeResult);
        const items=[];
        //const { getFieldDecorator, } = this.props.form;
        const result=this.state.invokeResult;
        if(!result.success){
            return items;
        }
        for(let key in result){
            if(key==='success' || key==='msg') {
                continue;
            }
            items.push(
                <div key={key}>
                    <p>url:{result[key].url}</p>
                    <Row gutter={24}>
                        <Col span={6}>
                            <FormItem label="请求头" ><TextArea rows={10} value={format(JSON.stringify(result[key].head))}/></FormItem>
                        </Col>
                        <Col span={6}>
                            <FormItem label="请求体" ><TextArea rows={10} value={format(JSON.stringify(result[key].body))}/></FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem label="请求结果" ><TextArea rows={10} value={format(JSON.stringify(result[key].result))}/></FormItem>
                        </Col>
                    </Row>
                </div>
            );
        }
        return items;

    }



    targgleForm1=()=>{
        this.setState({from1Visible:!this.state.from1Visible});
    };
    targgleForm2=()=>{
        this.setState({from2Visible:!this.state.from2Visible});
    };

    targgleForm3=()=>{
        this.setState({from3Visible:!this.state.from3Visible});
    };

    render(){
        const { getFieldDecorator, } = this.props.form;
        console.log(this.props.invokeType);
        return(
            <div>
                <Modal key="from1" width={1200} visible={this.state.from1Visible} footer={null}  onCancel={this.targgleForm1}
                       maskClosable={false}
                       destroyOnClose={true}>
                    <Form >
                        {this.createForm1()}
                    </Form>
                </Modal>
                <Modal key="from2" width={1200} visible={this.state.from2Visible} footer={null}  onCancel={this.targgleForm2}
                       maskClosable={false}
                       destroyOnClose={true}>
                    <ParseForm invokeResult={this.state.invokeResult[Object.getOwnPropertyNames(this.state.invokeResult)[0]]} currentInvoke={this.props.currentInvoke}/>
                </Modal>
                <Modal key="from3" width={1200} visible={this.state.from3Visible} footer={null}  onCancel={this.targgleForm3}
                       maskClosable={false}
                       destroyOnClose={true}>
                    <InvokeParseForm result={this.state.from3Result} parseFun={this.state.from3ParseFun} />
                </Modal>
                <Form>
                    {
                        this.props.params.map((p,i)=>
                            <FormItem label={p} key={i}>
                                {getFieldDecorator(p,{
                                    rules: [{ required: true, message: '此项为必填项!!' }],
                                })(
                                    <Input  />
                                )}
                            </FormItem>
                        )
                    }
                    <FormItem label="是否关联调用">
                        {getFieldDecorator('isNext', { valuePropName: 'checked' })(
                            <Switch disabled={this.props.invokeType==='1'?false:true} />
                        )}
                    </FormItem>
                    <Row>
                        <Col span={24} style={{ textAlign: 'right' }}>
                            <Button icon="play-circle" onClick={this.launch} loading={this.state.invokeing}>测试</Button>
                            <Button type="reload" onClick={null}>重置</Button>

                        </Col>
                    </Row>
                </Form>
            </div>
        );
    }
}

export default  Form.create()(ParamsForm);