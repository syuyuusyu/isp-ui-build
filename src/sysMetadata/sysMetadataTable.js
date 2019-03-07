import React from 'react';
import {Table,Row,Col,Select,Button,Spin} from 'antd';
import {inject,observer} from 'mobx-react';
import RoleButton from '../roleButton';
import {baseUrl, get} from "../util";
import '../style.css';

const Option = Select.Option;

@inject('rootStore')
@observer
class SysMetadataTable extends React.Component{
constructor(){
  super(...arguments);
  this.store=this.props.rootStore.sysmetadataStore;
}


    columns1=[
        {dataIndex:'name',title:'编码',width:100},
        {dataIndex:'title',title:'名称',width:100},
        {dataIndex:'system_id',title:'所属系统',width:100,
            render:(text)=>{
                if(this.store.allSystems.filter(d=>d.id+''===text+'').length>0)
                    return this.store.allSystems.filter(d=>d.id+''===text+'')[0].name;
                return text;
            }
        },
        {dataIndex:'database_type',title:'数据库类型',width:100,
            render:(text)=>{
                if(this.store.allDatabaseType.filter(d=>d.value+''===text+'').length>0)
                    return this.store.allDatabaseType.filter(d=>d.value+''===text+'')[0].text;
                return text;
            }
        },
        {dataIndex:'info',title:'描述',width:200},

    ];

    columns2=[
        {dataIndex:'name',title:'编码',width:100},
        {dataIndex:'title',title:'名称',width:100},
        {dataIndex:'system_id',title:'所属系统',width:100,
            render:(text)=>{
                if(this.store.allSystems.filter(d=>d.id+''===text+'').length>0)
                    return this.store.allSystems.filter(d=>d.id+''===text+'')[0].name;
                return text;
            }
        },
        {dataIndex:'database_type',title:'数据库类型',width:100,
            render:(text)=>{
                if(this.store.allDatabaseType.filter(d=>d.value+''===text+'').length>0)
                    return this.store.allDatabaseType.filter(d=>d.value+''===text+'')[0].text;
                return text;
            }
        },
        {dataIndex:'pro_type',title:'专业元数据类型',width:100,
            render:(text)=>{
                if(this.store.allProType.filter(d=>d.value+''===text+'').length>0)
                    return this.store.allProType.filter(d=>d.value+''===text+'')[0].text;
                return text;
            }
        },
        {dataIndex:'info',title:'描述',width:200},

    ];

    state={
        columns:[]
    };

    componentWillMount(){
        let metadataType=-1;
        this.props.match.path.replace(/\/(\d+)$/,(w,p1)=>{
            metadataType=p1;
        });
        this.setState({columns:metadataType==='1'?this.columns1:this.columns2});
    }

    async componentDidMount() {
        let metadataType=-1;
        this.props.match.path.replace(/\/(\d+)$/,(w,p1)=>{
            metadataType=p1;
        });
        await this.props.rootStore.sysmetadataStore.setMetadataType(metadataType);
        await this.store.initAllsystem();
        await this.store.initAlldataBaseType();
        if(this.store.metadataType==='2'){
            await this.store.initAllProType();
        }
        this.store.setSystemId(null);
        this.store.setProType(null);
        this.store.setDataBaseType(null);
        await this.store.loadMetada();

        this.store.synMetadata(metadataType);

    }

    expandedRowRender=(record)=>{
        return (
            <SubTable metadataId={record.id}/>
        );
    };

    render(){
        const store=this.store;
        return (
            <div>
              <Spin tip={store.loadingMessage} spinning={store.loading}>
                <Row gutter={2} className="table-head-row">
                    <Col span={2} className="col-label">所属系统平台:</Col>
                    <Col span={4}>
                        <Select className="col-input"  onChange={store.setSystemId}>
                            <Option  value={''} style={{color:'white'}}>&nbsp;</Option>
                            {
                                store.allSystems.filter(d=>d).map(s=>
                                    <Option key={s.id} value={s.id}>{s.name}</Option>)
                            }
                        </Select>
                    </Col>
                    <Col span={2} className="col-label">数据库类型:</Col>
                    <Col span={4} >
                        <Select className="col-input"  onChange={store.setDataBaseType}>
                            <Option  value={''} style={{color:'white'}}>&nbsp;</Option>
                            {
                                store.allDatabaseType.filter(d=>d).map(s=>
                                    <Option key={s.id} value={s.value}>{s.text}</Option>)
                            }
                        </Select>
                    </Col>
                    {
                        this.store.metadataType==='2'?
                            <span>
                                <Col span={3} className="col-label">专业元数据类型:</Col>
                                <Col span={4}>
                                    <Select className="col-input"  onChange={store.setProType}>
                                        <Option  value={''} style={{color:'white'}}>&nbsp;</Option>
                                        {
                                            store.allProType.filter(d=>d).map(s=>
                                                <Option key={s.id} value={s.value}>{s.text}</Option>)
                                        }
                                    </Select>
                                </Col>
                            </span>
                        :<span></span>
                    }
                    <Col span={4} style={{ textAlign: 'right'}} className="col-button">
                      <RoleButton buttonId={45} onClick={store.manuSynInterfaces(store.metadataType)}/>
                    </Col>
                  <Col span={4}  className="col-button">
                    <Button icon="search" onClick={store.loadMetada}>查询</Button>
                  </Col>
                </Row>
                <Table columns={this.state.columns}
                       rowKey={record => record.id}
                       dataSource={store.metadata.filter(d=>d)}
                       rowSelection={null}
                       size="small"
                       scroll={{ y: 800 }}
                       expandedRowRender={this.expandedRowRender}
                    //pagination={this.state.pagination}
                    //loading={this.state.loading}
                    //onChange={this.handleTableChange}
                />
              </Spin>
            </div>
        )
    }
}

class SubTable extends React.Component{


    fieldColumns=[
        {dataIndex:'name',title:'字段名称',width:100},
        {dataIndex:'title',title:'中文名称',width:100},
        {dataIndex:'type',title:'数据类型',width:100},
        {dataIndex:'length',title:'数据长度',width:100},
        {dataIndex:'comment',title:'注释',width:200},
    ];

    state={
        currentMetadataFields:[]
    };

    async componentDidMount(){
        let json=await get(`${baseUrl}/metadata/metadataFields/${this.props.metadataId}`);
        this.setState({currentMetadataFields:json});
    }

    render(){
        return (
            <Table columns={this.fieldColumns}
                   rowKey={record => record.id}
                   dataSource={this.state.currentMetadataFields}
                   rowSelection={null}
                   size="small"
                   scroll={{ y: 800 }}
                   bordered={true}
                   pagination={false}
            />
        );
    }

}

export default SysMetadataTable;
