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

    checkAutoextensible=(e)=>{
      if(e==='YES'){
        this.props.rootStore.dataSpaceStore.changeAutoextensibleDisplay1();
      }
      if(e==='NO'){
        this.props.rootStore.dataSpaceStore.changeAutoextensibleDisplay2();
      }

    };

    checkSpaceName=(rule, value, callback)=>{
      const store=this.props.rootStore.dataSpaceStore;
      const instanceName=this.getInstanceName();
      let boolean=false;
      if (!value) {
        callback();
      }
      //判断在该实例下是否已经有相同的表空间名称
      for(let j of store.allSpaces){
        if(j.instanceName===instanceName&&j.tablespace_name===value){
          boolean=true;
          break;
        }
      }
      if(boolean===true){
        callback(`"${instanceName}"实例下已经有"${value}"表空间名称`);
      }else{
        callback();
      }
    };

    checkFiles=(rule, value, callback)=>{
      const store=this.props.rootStore.dataSpaceStore;
      const instanceName=this.getInstanceName();
      let boolean=false;
      if (!value) {
        callback();
      }
      //判断在该实例下是否已经有相同的数据文件路径或文件名
      for(let i of store.allSpaces){
        if(i.instanceName===instanceName&&i.files===value){
          boolean=true;
          break;
        }
      }
      if(boolean===true){
        callback(`"${instanceName}"实例下已经有"${value}"数据文件路径或文件名`);
      }else{
        callback();
      }
    };

    getInstanceName=()=>{
      const store=this.props.rootStore.dataSpaceStore;
      //根据选择的数据库实例的id查询出该实例的名称
      let instanceName;
      for(let i of store.dataAcc.result){
        if(i.id===store.selectedAccId){
          instanceName=i.name;
          break;
        }
      }
      return instanceName;
    };

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
                      store.dataAcc.result.filter(d=>d).map(s=>
                        <Option key={s.id} value={s.id}>{s.name}</Option>)
                    }
                  </Select>
                    <Form style={{display:store.formDisplay}}>
                        <Row gutter={26}>
                          <Col span={10}>
                            <FormItem label="表空间名称">
                                {getFieldDecorator('name',{
                                    rules: [{ required: true, message: '必填' },
                                            {validator: this.checkSpaceName}],
                                  validateTrigger: 'onBlur'
                                })(
                                    <Input placeholder='请输入表空间名称'/>
                                )}
                            </FormItem>
                          </Col>
                          <Col span={10} offset={3}>
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
                          </Col>
                        </Row>
                      <Row gutter={26}>
                        <Col span={10}>
                          <FormItem label="数据文件路径或文件名">
                            {getFieldDecorator('files',{
                              rules: [{ required: true, message: '必填' },
                                       {validator: this.checkFiles}],
                              validateTrigger: 'onBlur'
                            })(
                              <Input placeholder='请输入数据文件路径或文件名'/>
                            )}
                          </FormItem>
                        </Col>
                        <Col span={10} offset={3}>
                          <FormItem label="数据文件大小(字节数)">
                            {getFieldDecorator('total',{
                              rules: [{ required: true, message: '必填' },
                                {pattern:'^[1-9]\\d*$',message:'数据文件大小必须是正整数'}],
                            })(
                              <Input placeholder='请输入数据文件大小(字节数)'/>
                            )}
                          </FormItem>
                        </Col>
                      </Row>
                      <Row gutter={26}>
                        <Col span={10}>
                          <FormItem label="是否自增">
                            {getFieldDecorator('autoextensible',{
                              rules: [{ required: true, message: '必填' },
                              ],
                            })(
                              <Select onChange={this.checkAutoextensible}>
                                <Option key={1} value="NO">NO</Option>
                                <Option key={2} value="YES">YES</Option>
                              </Select>
                            )}
                          </FormItem>
                        </Col>
                      </Row>
                      <Row gutter={26}>
                        <Col span={10}>
                          <FormItem label="自增最大大小(字节数)" style={{display:store.autoextensibleDisplay}}>
                            {getFieldDecorator('maxbytes',{
                              rules: [{ required: store.required, message: '必填' },
                                      {pattern:'^[1-9]\\d*$',message:'自增最大大小必须是正整数'}
                              ],
                            })(
                              <Input placeholder='请输入自增最大大小(字节数)'/>
                            )}
                          </FormItem>
                        </Col>
                        <Col span={10} offset={3}>
                          <FormItem label="每次自增大小(字节数)" style={{display:store.autoextensibleDisplay}}>
                            {getFieldDecorator('next_byte',{
                              rules: [{ required: store.required, message: '必填' },
                                {pattern:'^[1-9]\\d*$',message:'每次自增大小必须是正整数'}
                              ],
                            })(
                              <Input placeholder='请输入每次自增大小(字节数)'/>
                            )}
                          </FormItem>
                        </Col>
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
