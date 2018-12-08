import React from 'react';
import {Form, Row, Col, Input, Button, Select, notification,AutoComplete,Breadcrumb,DatePicker,Popconfirm, Divider} from 'antd';
import {inject, observer} from 'mobx-react';
import {baseUrl, get, post} from "../util";
import moment from 'moment';
import 'moment/locale/zh-cn';
import '../style.css';


const RangePicker = DatePicker.RangePicker;
const FormItem = Form.Item;
const Option = AutoComplete.Option;
const formItemLayout = {
    labelCol: {
        xs: { span: 24},
        sm: { span: 8 },
    },
    wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
    },
};

@inject('rootStore')
@observer
class QueryForm extends React.Component {

    state={};



    componentWillMount() {
        this.setState({});
        const store = this.props.rootStore.commonStore;
        const queryFieldIds=store.currentEntity.queryField?store.currentEntity.queryField.split(','):[];
        this.queryColumn=queryFieldIds.map(id=>store.allColumns.find(_=>_.id===parseInt(id)));
        this.setCandidate();

    }

    setCandidate=()=>{
        const store = this.props.rootStore.commonStore;
        this.queryColumn.forEach(async col=>{
            this.state[col.columnName]=[];
            this.state[`filter${col.columnName}`]=[];
            let json=await post(`${baseUrl}/entity/queryCandidate/${col.id}`,{...store.treeSelectedObj,...store.defaultQueryObj});
            json.unshift({value:null,text:null});
            this.setState({[col.columnName]:json});
            this.setState({[`filter${col.columnName}`]:json});
        });
    };



    handleSearch=(colunmName)=>((value)=>{
        let regExp = new RegExp('.*'+value.trim()+'.*','i');
        const filtered=this.state[colunmName].filter(o=> regExp.test(o.text));
        this.setState({[`filter${colunmName}`]:filtered});
    });

    query=()=>{
        const store = this.props.rootStore.commonStore;
        this.props.form.validateFields(async (err, values) => {
            if (err) return;
            for(let key in values){
                if(!values[key]  ) delete values[key];
            }
            this.queryColumn.forEach(c=>{
                if(c.columnType==='timestamp'){
                    if(values[c.columnName] &&values[c.columnName].length===2){
                        values[c.columnName]=[
                            values[c.columnName][0].format('YYYY-MM-DD HH:mm:ss'),
                            values[c.columnName][1].format('YYYY-MM-DD HH:mm:ss')
                        ];
                    }

                }
            });
            store.queryObj={...values,start:0,pageSize:store.pagination.pageSize,page:1};
            store.queryTable();
        });
    };

    createItem=(col)=>{
        const store = this.props.rootStore.commonStore;
        const {getFieldDecorator,} = this.props.form;
        if(col.dicGroupId){
            return (
                <FormItem style={{marginBottom: '5px'}} key={col.id}
                          label={col.text ? col.text : col.columnName}
                          {...formItemLayout}
                          >
                    {getFieldDecorator(col.columnName, {
                        rules: [{

                        }],
                    })(
                        <Select>
                            <Option key={null} value={''} style={{color: 'white'}}>&nbsp;</Option>
                            {
                                store.allDictionary
                                    .filter(d=>d.groupId===col.dicGroupId)
                                    .filter(d=>{
                                        if(!store.defaultQueryObj[col.columnName]){
                                            return true;
                                        }else{
                                            if(Object.prototype.toString.call(store.defaultQueryObj[col.columnName])==="[object Array]"){
                                                return store.defaultQueryObj[col.columnName].find(_=>_==d.value);
                                            }else{
                                                return d.value==store.defaultQueryObj[col.columnName];
                                            }
                                        }
                                    })
                                    .map(_=><Option key={_.value} value={_.value+''}>{_.text}</Option>)
                            }
                        </Select>
                    )}
                </FormItem>
            );
        }
        if(col.columnType==='timestamp'){
            return (
                <FormItem style={{marginBottom: '5px'}} key={col.id}
                          label={col.text ? col.text : col.columnName} {...formItemLayout}>
                    {getFieldDecorator(col.columnName, {})(
                        <RangePicker showTime format="YYYY-MM-DD HH:mm:ss" style={{width:'100%'}}/>
                    )}
                </FormItem>
            );
        }

        return (
            <FormItem style={{marginBottom: '5px'}} key={col.id}
                      label={col.text ? col.text : col.columnName} {...formItemLayout}>
                {getFieldDecorator(col.columnName, {})(
                    <AutoComplete
                        onSearch={this.handleSearch(col.columnName)}
                        dataSource={this.state[`filter${col.columnName}`].map(_ => {
                            if (_.value)
                                return <Option key={_.value} value={_.value + ''}>{_.text}</Option>
                            else
                                return <Option key={null} value={''} style={{color: 'white'}}>&nbsp;</Option>
                        })}
                    >
                        <Input/>
                    </AutoComplete>
                )}
            </FormItem>
        )


    };

    createItems=()=>{
        const store = this.props.rootStore.commonStore;
        if(!store.currentEntity.queryField){
            return '';
        }
        const idMatrix=[[],[],[]];
        this.queryColumn.forEach((col,index)=>{
            idMatrix[index%3].push(col);
        });
        return (
            <Row gutter={24}>
                {
                    idMatrix.map((row,index)=>{
                        return <Col span={8} key={index} style={{paddingLeft: '5px'}}>
                            {
                                row.map(col=>{
                                    return this.createItem(col);
                                })
                            }
                        </Col>
                    })
                }
            </Row>
        );



    };


    render() {
        const store=this.props.rootStore.commonStore;
        return (
            <div>
                <Form layout='horizontal'>
                    {this.createItems()}
                    <Row>
                        <Col span={18} style={{textAlign: 'left'}}>
                            {
                                store.hasParent?
                                    <Breadcrumb style={{ margin: '10px 8px' }}>
                                        <Breadcrumb.Item>当前路径:</Breadcrumb.Item>
                                        {
                                            store.currentRoute
                                                .filter(d=>d).map(r=><Breadcrumb.Item key={r.id}>{r.text}</Breadcrumb.Item>)
                                        }
                                    </Breadcrumb>
                                    :
                                    ''
                            }

                        </Col>
                        <Col span={6} style={{textAlign: 'right'}}>
                            {
                                store.operations.filter(d => d && d.location=='1')
                                    .map((m,index) => {
                                        if (m.type === '3') {
                                            return (
                                                    <Popconfirm key={index} onConfirm={store.execFun(store, m.function)}
                                                                title={`确认${m.name}?`}>
                                                        <Button icon={m.icon} onClick={null}>{m.name}</Button>
                                                    </Popconfirm>

                                            );
                                        }
                                        return (
                                                <Button icon={m.icon} onClick={this.showOperationForm(record, m.id)}
                                                        >{m.name}</Button>

                                        );
                                    })
                            }
                            {
                                store.currentEntity.queryField?
                                    <Button icon="search" onClick={this.query}>查询</Button>
                                    :''
                            }
                            {
                                store.currentEntity.editAble=='1'?
                                    <Button icon="plus-circle-o" onClick={store.showCreateForm(null,false)}>新建</Button>
                                    :''
                            }

                        </Col>
                    </Row>
                </Form>
            </div>
        );

    }
}

export default QueryForm;

