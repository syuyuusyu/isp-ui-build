import React from 'react';
import { Form, Row, Col, Input, Button ,notification,} from 'antd';
import {inject,observer} from 'mobx-react';
import {baseUrl,post} from '../util';
//const Option=Select.Option;
const FormItem = Form.Item;

@inject('rootStore')
@observer
class SysForm extends React.Component{

    componentDidMount(){
        const store=this.props.rootStore.sysStore;
        if(store.currentSys){
            this.props.form.setFieldsValue({
                code:store.currentSys.code,
                name:store.currentSys.name,
                url:store.currentSys.url
            });
        }
    }


    save=()=>{
        const store=this.props.rootStore.sysStore;
        this.props.form.validateFields(async (err,values)=>{
            if(err) return;
            if(store.currentSys){
                values.id=store.currentSys.id;
            }
            let json=await post(`${baseUrl}/sys/save`, JSON.stringify(values));
            if(json.success){
                notification.success({
                    message:'保存成功',
                })
            }else{
                notification.error({
                    message:'后台错误，请联系管理员',
                })
            }
            store.initAllsystem();
            store.toggleSysFormVisible();
            this.props.rootStore.treeStore.loadMenuTree();

        })
    };


    handleReset = () => {
        this.props.form.resetFields();
    };

    render(){
        const { getFieldDecorator, } = this.props.form;
        return (
        <Form>
            <Row>
                <FormItem label="平台编码">
                    {getFieldDecorator('code',{
                        rules: [{ validator: this.props.rootStore.sysStore.checkUnique, message: '系统编码不能重复', }],
                        validateTrigger:'onBlur'
                    })(
                        <Input placeholder="输入系统编码"  />
                    )}
                </FormItem>
            </Row>
            <Row>
                <FormItem label='平台名称'>
                    {getFieldDecorator('name',{
                        rules: [{ required: true, message: '此项为必填项!!' }],
                        validateTrigger:'onBlur'
                    })(
                        <Input placeholder="输入系统名称"  />
                    )}
                </FormItem>
            </Row>
            <Row>
                <FormItem label="URL">
                    {getFieldDecorator('url',{
                        rules: [{ required: true, message: '此项为必填项!!' }],
                    })(
                        <Input placeholder="输入URL" />
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
        )
    }
}

export default  Form.create()(SysForm);