import {observable,action,runInAction,configure} from 'mobx';
import { Message } from 'antd';
import {baseUrl,get,post} from '../util';

configure({ enforceActions: 'observed' });

export default class SummaryStoreBD{
  constructor(rootStore){
    this.rootStore=rootStore;
  }

  @observable
  clusterInfo = {
    data: [],
    links: [],
  };

  @observable
  sparkInfo = [
    { name: '成功', value: 0 },
    { name: '失败', value: 0 },
    { name: '运行', value: 0 },
  ];

  @observable
  mapReduceInfo = [
    { name: '成功', value: 0 },
    { name: '失败', value: 0 },
    { name: '运行', value: 0 },
  ];

  @observable
  tableInfo = [];

  @observable
  oracleInfo = [];

  @observable
  mySQLInfo = [];

  @observable
  hdfsInfo = [];

  @observable
  mianhdfsInfo={ total: 0, used: 0 };

  @action
  initSummaryData = async ()=>{
    const {
      type_4: { cluster_data: clusterData, cluster_links: clusterLinks },
      type_3: { spark, mapreduce },
      type_2,
    } = await post(`${baseUrl}/invoke/data_monitor`);
    runInAction(()=> {
      if (clusterData !== undefined && clusterLinks !== undefined) {
        this.clusterInfo = {
          data: clusterData,
          links: clusterLinks,
        };
      }
      if (spark !== undefined) {
        this.sparkInfo = [
          { name: '成功', value: spark.success_numbers },
          { name: '失败', value: spark.fail_numbers },
          { name: '运行', value: spark.runing_numbers },
        ];
      }
      if (mapreduce !== undefined) {
        this.mapReduceInfo = [
          { name: '成功', value: mapreduce.success_numbers },
          { name: '失败', value: mapreduce.fail_numbers },
          { name: '运行', value: mapreduce.runing_numbers },
        ];
      }
      if (type_2 !== undefined && type_2.oracle !== undefined) {
        this.tableInfo = ((obj) => {
          let result = [];
          for (let key in obj) {
            if (obj.hasOwnProperty(key)) {
              result.push({
                name: key,
                value: obj[key].table_numbers || obj[key].cluster_numbers,
              })
            }
          }
          return result
        })(type_2);
        this.oracleInfo = type_2.oracle.schema_info;
        this.mySQLInfo = type_2.mysql.schema_info;
        this.hdfsInfo = type_2.hdfs.schema_info;
        this.mianhdfsInfo={
            total: type_2.hdfs.schema_info.map(d => d.value).reduce((a, b) => a + b),
            used: type_2.hdfs.schema_info.filter(d => d.name === 'hdfs_use').map(d => d.value)[0]
        };
      }
    });
  };
}
