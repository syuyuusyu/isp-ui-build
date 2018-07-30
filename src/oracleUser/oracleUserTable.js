import React from 'react';
import {Table,Icon,Spin,Modal,Row,Col,Button,Select} from 'antd';
import {inject,observer} from 'mobx-react';
import {convertGiga} from "../util";

const Option = Select.Option;
const antIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;

@inject('rootStore')
@observer
class OracleUserTable extends React.Component{

}
export default OracleUserTable;
