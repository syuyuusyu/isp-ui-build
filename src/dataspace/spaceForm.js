import React from 'react';
import { Form, Row, Col, Button ,notification,Select,Spin,Icon,Input} from 'antd';
import {inject,observer} from 'mobx-react';
import {baseUrl, get, post} from '../util';

const Option=Select.Option;
const FormItem = Form.Item;
const antIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;

@inject('rootStore')
@observer
class SpaceForm extends React.Component{

    componentDidMount(){
        this.props.form.setFieldsValue({
            type:'PERMANENT'
        });
    }

    save=()=>{
        this.props.form.validateFields(async (err,values)=>{
            if(err) return;
            this.props.rootStore.dataSpaceStore.save(values);
        })
    };


    render(){
        const store=this.props.rootStore.dataSpaceStore;
        const { getFieldDecorator, } = this.props.form;
        return (
            <div>
                <Spin indicator={antIcon} tip={store.loadingtest} spinning={store.loading}>
                  <p>请选择数据库实例:</p>
                  <Select className="col-input"  onChange={store.selectedAcc} style={{width:'300px'}}>
                    {
                      store.dataAcc.filter(d=>d).filter(d=>d.dbType==='1').map(s=>
                        <Option key={s.id} value={s.id}>{s.name}</Option>)
                    }
                  </Select>
                    <Form style={{display:store.formDisplay}}>
                        <Row>
                            <FormItem label="表空间名称">
                                {getFieldDecorator('name',{
                                    rules: [{ required: true, message: '必填' }],
                                })(
                                    <Input placeholder='输入表空间名称'/>
                                )}
                            </FormItem>
                            <FormItem label="表空间类型">
                                {getFieldDecorator('type',{
                                    rules: [
                                        { required: true, message: '必填' }],
                                    validateTrigger:'onBlur'
                                })(
                                    <Select >
                                        <Option key={1} value="PERMANENT">PERMANENT</Option>
                                        <Option key={2} value="UNDO">UNDO</Option>
                                        <Option key={3} value="TEMPORARY">TEMPORARY</Option>
                                    </Select>
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


export default  Form.create()(SpaceForm);
