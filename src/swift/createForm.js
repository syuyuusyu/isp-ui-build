import React from 'react';
import { Form, Row, Col, Input, Button ,notification} from 'antd';
import {inject,observer} from 'mobx-react';
import {baseUrl,post} from '../util';
//const Option=Select.Option;
const FormItem = Form.Item;

@inject('rootStore')
@observer
class CreateForm extends React.Component{

    nodash=async(rule, value, callback)=>{
        if(/\//.test(value)){
            callback(new Error());
        }else{
            callback();
        }

    };

    save=()=>{
        this.props.form.validateFields(async (err,values)=>{
            if(err) return;
            this.props.rootStore.swiftStore.createFolder(values);
        })
    };

    render(){
        //const store=this.props.rootStore.swiftStore;
        const { getFieldDecorator, } = this.props.form;
        return (
            <div>
                <Form>
                    <Row>
                        <FormItem label="文件夹名称名称">
                            {getFieldDecorator('folderName',{
                                rules: [{ required: true, message: '文件名称不能包含"/"',validator:this.nodash }],
                            })(
                                <Input placeholder="输入文件夹名称名称" />
                            )}
                        </FormItem>
                    </Row>
                    <Row>
                        <Col span={24} style={{ textAlign: 'right' }}>
                            <Button icon="folder-add"
                                    onClick={this.save}
                                    type="primary"
                                    loading={this.props.rootStore.swiftStore.uploading}>
                                {this.props.rootStore.swiftStore.uploading ? '新建中' : '点击新建' }
                            </Button>
                        </Col>
                    </Row>
                </Form>
            </div>
        );
    }
}


export default  Form.create()(CreateForm);