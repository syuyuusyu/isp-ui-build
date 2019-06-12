import React from 'react';
import {Tree,Row,Col,Button,notification} from 'antd';
import {inject,observer} from 'mobx-react';
import {baseUrl, get, post,careateTree,getPathById} from "../../util";
const TreeNode = Tree.TreeNode;


@inject('rootStore')
@observer
class UserOrg extends React.Component{

    tree=[];

    monyTomony={
        firstIdField: "user_id",
        firstTable: "t_user",
        id: 17,
        name: "用户机构",
        relationTable: "t_user_org",
        secondIdField: "org_id",
        secondTable: "t_organization",
    };

    relevantEntity={
        deleteFlagField: "stateflag",
        editAble: "1",
        entityCode: "organization",
        entityName: "机构",
        fuzzyQueryField: null,
        id: 1028,
        idField: "id",
        mmQueryField: null,
        nameField: "name",
        orderField: null,
        parentEntityId: 1028,
        pidField: "parent_id",
        queryField: null,
        tableLength: null,
        tableName: "t_organization"
    };

    operationId=58;

    state={
        treeData:[],
        checkedKeys:{checked:[149],halfChecked:[2]},
        defaultExpandedKeys:[]
    };

    componentDidMount(){
        const store=this.props.rootStore.commonStore;
        store.relevantEntity=this.relevantEntity;
        this.nameField=store.relevantEntity.nameField;
        this.idField=store.relevantEntity.idField;
        this.initRoot();
    }

    renderTreeNodes = (data) => {
        return data.map((item) => {
            const title=item[this.nameField];
            if (item.children) {
                return (
                    <TreeNode title={title} key={item[this.idField]+''} dataRef={item}>
                        {this.renderTreeNodes(item.children)}
                    </TreeNode>
                );
            }
            return <TreeNode title={title} key={item[this.idField]+''} dataRef={item}  isLeaf={item.is_leaf?(item.is_leaf==='1'?true:false):false} />;
        });
    };

    initRoot=async ()=>{
        const store=this.props.rootStore.commonStore;
        let orgTree= await post(`${baseUrl}/interfaces`,{ "method":"organization"});
        //array,idField,pidField,topId
        this.tree=careateTree(orgTree,'id','parent_id',1);
        this.tree.shift();

        // let topParentRecord = await get(`${baseUrl}/entity/topParentRecord/${store.relevantEntity.id}`);
        // let treeData = await post(`${baseUrl}/entity/query/${store.relevantEntity.id}`, {
        //     [store.relevantEntity.pidField]: topParentRecord[store.relevantEntity.idField]
        // });
        let url=
            `${baseUrl}/entity/queryRelevant/${store.currentEntity.id}/${this.monyTomony.id}/${store.currentTableRow[store.currentEntity.idField]}`;
        let checkedKeys= await get(url);
        console.log(checkedKeys);
        let checked=checkedKeys.data.length>0?checkedKeys.data.map(d=>d[store.relevantEntity.idField]+''):[];
        let halfChecked=[];
        if(checked[0]){
            this.tree.filter(d => d).forEach(data => {
                getPathById(checked[0], Object.create(data), (result) => {
                    halfChecked=result.map(d=>d[store.relevantEntity.idField]+'')
                }, 'id')
            });
        }

        this.setState({
            treeData:this.tree,
            checkedKeys:{checked:checked,halfChecked:halfChecked},
            defaultExpandedKeys:checkedKeys.data.map(d=>d[store.relevantEntity.idField]+'')
        });
    };

    save=async ()=>{
        const store=this.props.rootStore.commonStore;
        let json=await post(`${baseUrl}/entity/saveRelevant/${store.currentEntity.id}/${this.monyTomony.id}`,{
            srcId:store.currentTableRow[store.currentEntity.idField],
            targetIds:this.state.checkedKeys.checked,
        });
        if (json.success) {
            notification.success({
                message: '保存成功',
            })
        } else {
            notification.error({
                message: '后台错误，请联系管理员',
            })
        }
        store.toggleOperationVisible(this.props.operationId)();
    };

    handleReset=()=>{
        this.setState({checkedKeys:[]});
    };

    onCheck=(checkedKeys)=>{
        const store=this.props.rootStore.commonStore;
        let checked=checkedKeys.checked.length>0?[checkedKeys.checked.pop()]:[];
        let halfChecked=[];
        if(checked[0]){
            this.tree.filter(d => d).forEach(data => {
                getPathById(checked[0], Object.create(data), (result) => {
                    halfChecked=result.map(d=>d[store.relevantEntity.idField]+'')
                }, 'id')
            });
        }
        this.setState({checkedKeys:{checked:checked,halfChecked:halfChecked}},()=>{

        });

    };


    onLoadData=async (treeNode)=>{
        const store=this.props.rootStore.commonStore;
        const parentId=treeNode.props.dataRef.id;
        let json = await post(`${baseUrl}/entity/query/${store.relevantEntity.id}`, {
            [store.relevantEntity.pidField]: parentId
        });
        treeNode.props.dataRef.children=json.data;
        //console.log()
        this.setState({treeData:[...this.state.treeData]});
    };

    render() {
        const store=this.props.rootStore.commonStore;
        return (
            <div>
                <Tree checkable
                      //loadData={this.onLoadData}
                      checkStrictly={true}
                      checkedKeys={this.state.checkedKeys}
                      onCheck={this.onCheck}
                      //defaultExpandAll={true}
                      //onSelect={this.onSelect}
                      //defaultCheckedKeys={this.state.checkedKeys}
                >
                    {this.renderTreeNodes(this.state.treeData)}
                </Tree>
                <Row>
                    <Col span={24} style={{ textAlign: 'right' }}>
                        <Button icon="save" onClick={this.save}>保存</Button>
                        <Button icon="reload" onClick={this.handleReset}>重置</Button>

                    </Col>
                </Row>
            </div>

        );
    }
}

export default UserOrg;