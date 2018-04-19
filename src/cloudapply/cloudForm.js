import React from 'react';
import { Form, Row, Col, Button ,notification,Select,Spin,Icon,Input} from 'antd';
import {inject,observer} from 'mobx-react';
import {baseUrl,post} from '../util';

const Option=Select.Option;
const FormItem = Form.Item;
const antIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;

@inject('rootStore')
@observer
class CloudFrom extends React.Component{

    componentDidMount(){
        this.props.rootStore.cloudStore.loadFormInput();
    }


    save=()=>{
        this.props.form.validateFields(async (err,values)=>{
            if(err) return;
            let json=await post(`${baseUrl}/invoke/cloud_create`,{
                flavorId:values.flavorId,
                name:values.name,
                networkId:values.networkId,
                imageId:values.imageId
            });
            if(json.code===200){
                notification.success({
                    message:'新建成功'})
            }else{
                notification.error({
                    message:'失败,请联系管理员'});
            }
            this.props.rootStore.cloudStore.toggleFormVisible();
            this.props.rootStore.cloudStore.loadServerInfo();

        })
    };

    render(){
        const store=this.props.rootStore.cloudStore;
        const { getFieldDecorator, } = this.props.form;
        return (
            <div>
                <Spin indicator={antIcon} tip={store.loadingtest} spinning={store.loading}>
                <Form>
                    <Row>
                        <FormItem label="虚拟机名称">
                            {getFieldDecorator('name',{
                                rules: [{ required: true, message: '必填' }],
                            })(
                               <Input placeholder='输入虚拟机名称'/>
                            )}
                        </FormItem>
                        <FormItem label="虚拟机类型">
                            {getFieldDecorator('flavorId',{
                                rules: [{ required: true, message: '必填' }],
                            })(
                                <Select>
                                    {
                                        store.flavors.filter(d=>d).map(d=>
                                            <Option key={d.id}>{d.name}</Option>
                                        )
                                    }
                                </Select>
                            )}
                        </FormItem>
                        <FormItem label="网络">
                            {getFieldDecorator('networkId',{
                                rules: [{ required: true, message: '必填' }],
                            })(
                                <Select>
                                    {
                                        store.networks.filter(d=>d).map(d=>
                                            <Option key={d.id}>{d.name}</Option>
                                        )
                                    }
                                </Select>
                            )}
                        </FormItem>
                        <FormItem label="镜像">
                            {getFieldDecorator('imageId',{
                                rules: [{ required: true, message: '必填' }],
                            })(
                                <Select>
                                    {
                                        store.images.filter(d=>d).map(d=>
                                            <Option key={d.id}>{d.name}</Option>
                                        )
                                    }
                                </Select>
                            )}
                        </FormItem>
                    </Row>
                    <Row>
                        <Col span={24} style={{ textAlign: 'right' }}>
                            <Button icon="save" onClick={this.save}>保存</Button>
                        </Col>
                    </Row>
                </Form>
                </Spin>
            </div>
        );
    }
}


export default  Form.create()(CloudFrom);