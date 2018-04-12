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
            const {folderName}=values;
            const filePath=this.props.rootStore.swiftStore.selectRow.name;
            const username=JSON.parse(sessionStorage.getItem("user")).user_name;
            let json=await post(`${baseUrl}/swift/createFolder`,{
                filePath:filePath+folderName,username
                });
            if(json.status===201){
                notification.success({
                    message:'新建成功',
                })
            }else{
                notification.error({
                    message:'后台错误，请联系管理员',
                })
            }
            this.props.rootStore.swiftStore.toggleFormVisible();
            this.props.rootStore.swiftStore.loadRootDir();
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
                            <Button icon="save" onClick={this.save}>保存</Button>
                        </Col>
                    </Row>
                </Form>
            </div>
        );
    }
}


export default  Form.create()(CreateForm);