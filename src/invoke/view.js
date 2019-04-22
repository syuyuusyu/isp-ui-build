import React from 'react';
import {Table,Row,Col,Card,Modal,Divider,notification,Popconfirm,AutoComplete,Input,Icon,Dropdown,Menu,Button,List,Drawer} from 'antd';
import ConfFrom from './ConfForm';
import {baseUrl, del, post, get, format} from '../util';
import RoleButton from '../roleButton';
import '../style.css';
const Option = AutoComplete.Option;



class InvkeGrid extends React.Component{

    pageChange=(page, pageSize)=>{
        let start=(page-1)*pageSize;
        this.loadData(page,start,pageSize)
    };
    state = {
        confFormvisible:false,
        invokeFormvisibele:false,
        selectedRow:{},
        dataSource:[],
        loading:true,
        pagination:{
            current:1,
            total:100,
            size:'small',
            pageSize:10,
            showTotal:(total, range) => `${range[0]}-${range[1]} of ${total} items`,
            onChange:this.pageChange
        },
        invokeNames:[],
        selectInvokeName:'',
        filterInvokeNames:[],
        saveAvailable:false,
        groupnames:[],
        selectgroupname:'',
        filtergroupname:[],
        currentRecord:[],
        infoVisible:false
    };

    columns = [
        {dataIndex:'id',title:'ID',width:50},
        {dataIndex:'invokeType',title:'调用类型',width:90,
            render: (text, record) => {
                switch (text){
                    case '1':
                        return '调用配置';
                    case '2':
                        return '可调用接口';
                    default:
                        return '';
                }
            }
        },
        {
            dataIndex:'name',title:'名称',width:170,
        },
        {dataIndex:'groupName',title:'组名称',width:170},
        {dataIndex:'descrption',title:'描述',width:200},
        {dataIndex:'method',title:'请求方法',width:90},
        {dataIndex:'url',title:'URL'},
        {
            title: '操作',
            align:'center',
            width: 350,
            fixed: 'right',
            render: (text, record) => {
                return (
                    <span>

                        {/*<RoleButton onClick={this.edit(record,true)} buttonId={8}/>*/}

                        <Button icon={'eye'} onClick={this.showInfo(record)} size='small'>查看</Button>
                         <Divider type="vertical"/>
                        <Button icon="play-circle-o" onClick={this.edit(record,true)} size='small'>测试</Button>
                        <Divider type="vertical"/>
                        {/*<RoleButton onClick={this.edit(record)} buttonId={6}/>*/}
                        <Button icon="edit" onClick={this.edit(record)} size='small'>修改</Button>
                        <Divider type="vertical"/>
                        <Popconfirm onConfirm={this.delete(record.id)} title="确认删除?">
                            {/*<Button icon="delete" onClick={null} size='small'>删除</Button>*/}
                            <RoleButton  buttonId={7}/>
                        </Popconfirm>
                    </span>
                )
            }
        }
    ];



    componentDidMount(){
        this.loadData(1,0,this.state.pagination.pageSize);
    }



    expandedRowRender=(record)=>(
        <div className="box-code-card" style={{ background: '#ECECEC', padding: '1px' }}>
            <Row gutter={24} >
                <Col span={8} >
                    <Card title="请求头" bordered={false}><pre>{record.head}</pre></Card>
                </Col>
                <Col span={8} >
                    <Card title="请求体" bordered={false}><pre>{record.body}</pre></Card>
                </Col>
                <Col span={8} >
                    <Card title="解析函数" bordered={false}><pre>{record.parseFun}</pre></Card>
                </Col>
            </Row>
        </div>
    );

    loadInvokeName=async()=>{
        let json=await post(`${baseUrl}/invokeInfo/invokes` ,{} );
        //let json=await response.json();
        const invokeNames=json.map(o=>({id:o.id,name:o.name}));
        invokeNames.unshift({id:null,name:null});
        this.setState({invokeNames});
        this.setState({filterInvokeNames:invokeNames});
        let json2=await get(`${baseUrl}/invokeInfo/groupName` , );
        const groupnames=json2.map(o=>({id:o.groupName,name:o.groupName})).filter(o=>o.id);
        groupnames.unshift({id:null,name:null});
        this.setState({groupnames});
        this.setState({filtergroupname:groupnames});
    };


    handleSearch=(value)=>{
        let regExp = new RegExp('.*'+value+'.*','i');
        const filtered=this.state.invokeNames.filter(o=> regExp.test(o.name));
        this.setState({filterInvokeNames:filtered});
    };

    filtergroupname=(value)=>{
        let regExp = new RegExp('.*'+value+'.*','i');
        const filtered=this.state.groupnames.filter(o=> regExp.test(o.name));
        this.setState({filtergroupname:filtered});
    };


    onSearch=(e)=>{
        //e.preventDefault();
        e.stopPropagation();
        this.loadData(1,0,100,this.state.selectInvokeName,this.state.selectgroupname);
    };

    selectName=(e)=>{
        this.setState({selectInvokeName:e.target.value});
    };
    selecGrouptName=(e)=>{
        this.setState({selectgroupname:e.target.value});
    };



    closeInfo=()=>{
        this.setState({infoVisible:false});
    };

    loadData=async (page, start, limit,invokeName=this.state.selectInvokeName,groupName=this.state.selectgroupname)=>{
        this.setState({loading:true});
        const url=`${baseUrl}/invokeInfo/infos`;
        let json=await post(url,{start:start,limit:limit,invokeName:invokeName,groupName});
        if(json){
            this.setState({dataSource:json.content});
            this.setState({pagination:{
                    ...this.state.pagination,
                    total:json.totalElements,
                    current:page
                }});
            this.setState({loading:false});
        }else{
            this.setState({loading:false});
        }

        this.loadInvokeName();
    };


    create=()=>{
        this.setState({saveAvailable:true});
        this.setState({selectedRow:null});
        this.taggleConfForm();
    };

    taggleConfForm=()=>{
        this.setState({confFormvisible:!this.state.confFormvisible})
    };

    careateInvoke=()=>{
        this.setState({saveAvailable:true});
        this.setState({selectedRow:null});
        this.toggleinvokeFormvisibele();
    };

    toggleinvokeFormvisibele=()=>{
        this.setState({invokeFormvisibele:!this.state.invokeFormvisibele});
    };

    edit=(record,saveAvailable)=>(()=> {
            this.setState({saveAvailable});
            this.setState({selectedRow: record});
            if(record.invokeType==='1'){
                this.taggleConfForm();
            }else{
                this.toggleinvokeFormvisibele();
            }

        }
    );

    delete=(id)=>(async()=>{
        this.setState({loading:true});
        const json=await del(`${baseUrl}/invokeInfo/delete/${id}`);
        //const json=await response.json();
        if(json.success){
            notification.success({
                message:'删除成功',
            })
        }else{
            notification.error({
                message:'后台错误，请联系管理员',
            })
        }
        this.loadData();
    });

    showInfo=(record)=>(()=>{
        let list=[];
        list.push({
            name:'ID',
            value:record.id
        });
        list.push({
            name:'调用类型',
            value:record.invokeType=='1'?'调用配置':'可调用接口'
        });
        list.push({
            name:'名称',
            value:record.name
        });
        list.push({
            name:'组名称',
            value:record.groupName
        });
        list.push({
            name:'描述',
            value:record.descrption
        });
        list.push({
            name:'请求方法',
            value:record.method
        });
        list.push({
            name:'url',
            value:record.url
        });
        list.push({
            name:'请求头',
            value:record.head,
            type:'text'
        });
        list.push({
            name:'请求体',
            value:record.body,
            type:'text'
        });
        list.push({
            name:'解析函数',
            value:record.parseFun,
            type:'text'
        });
        this.setState({currentRecord:list,infoVisible:true});
    });



    buttonMenu=(
        <Menu>
            <Menu.Item>
                <Button onClick={this.create}>创建接口配置</Button>
            </Menu.Item>
            <Menu.Item>
                <Button onClick={this.careateInvoke}>创键可调用接口</Button>
            </Menu.Item>
        </Menu>
    );

    render(){
        return (
            <div>
                <Row gutter={2} className="table-head-row">
                    <Col span={2} className="col-label">调用名称:</Col>
                    <Col span={4}>
                        <AutoComplete style={{ width: '200' }}
                                      className="col-input"
                                      onSearch={this.handleSearch}
                                      placeholder="输入调用名称"
                                      dataSource={this.state.filterInvokeNames.map(o=>{
                                          if(o.id)
                                              return <Option key={o.id} value={o.id+''}>{o.name}</Option>
                                          else
                                              return <Option key={o.id} value={o.id+''} style={{color:'white'}}>&nbsp;</Option>
                                      })}
                        >
                            <Input   onSelect={this.selectName}/>
                        </AutoComplete>
                    </Col>

                    <Col span={2} className="col-label">组名称:</Col>
                    <Col span={4}>
                        <AutoComplete style={{ width: '200' }}
                                      className="col-input"
                                      onSearch={this.filtergroupname}
                                      placeholder="输入组名称"
                                      dataSource={this.state.filtergroupname.map(o=>{
                                          if(o.id)
                                              return <Option key={o.id} value={o.id+''}>{o.name}</Option>
                                          else
                                              return <Option key={o.id} value={o.id+''} style={{color:'white'}}>&nbsp;</Option>
                                      })}
                        >
                            <Input addonAfter={<Icon type="search" onClick={this.onSearch} />}  onSelect={this.selecGrouptName}/>
                        </AutoComplete>
                    </Col>

                    <Col span={4} style={{ textAlign: 'right' }} className="col-button">
                        <Dropdown overlay={this.buttonMenu} placement="bottomCenter">
                            <Button icon="plus-circle-o">新建</Button>
                        </Dropdown>

                    </Col>

                </Row>
                <Modal visible={this.state.confFormvisible}
                       width={1200}
                       title="原生接口配置"
                       footer={null}
                       onCancel={this.taggleConfForm}
                       maskClosable={false}
                       destroyOnClose={true}
                >
                    <ConfFrom invokeType='1' saveAvailable={this.state.saveAvailable} data={this.state.selectedRow} reloadTable={this.loadData} close={()=>this.setState({confFormvisible:false})}/>
                </Modal>
                <Modal visible={this.state.invokeFormvisibele}
                       width={1200}
                       title="封装接口配置"
                       footer={null}
                       onCancel={this.toggleinvokeFormvisibele}
                       maskClosable={false}
                       destroyOnClose={true}
                >
                    <ConfFrom invokeType='2' saveAvailable={this.state.saveAvailable} data={this.state.selectedRow} reloadTable={this.loadData} close={()=>this.setState({invokeFormvisibele:false})}/>
                </Modal>
                <Drawer
                    placement="left"
                    width={600}
                    closable={false}
                    onClose={this.closeInfo}
                    visible={this.state.infoVisible}
                >
                    <List
                        itemLayout="horizontal"
                        dataSource={this.state.currentRecord}
                        renderItem={item => (
                            <List.Item>
                                <List.Item.Meta
                                    title={item.name}
                                    description={
                                        item.type=='text'?
                                            <pre>{format(item.value)}</pre>
                                            :
                                            item.value
                                    }
                                />
                            </List.Item>
                        )}
                    />
                </Drawer>
                <Table columns={this.columns}
                       rowKey={record => record.id}
                       dataSource={this.state.dataSource}
                       rowSelection={null}
                       size="small"
                       scroll={{ y: 900, x: 'max-content'}}
                       //expandedRowRender={this.expandedRowRender}
                    pagination={this.state.pagination}
                       loading={this.state.loading}
                />
            </div>
        );
    };
}


export default InvkeGrid;



