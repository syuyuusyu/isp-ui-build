import {observable,action,runInAction,configure} from 'mobx';
import {baseUrl,get,post} from '../util';

const topologyData = [
  {
    id: 1,
    name: '云平台',
    icon: 'cloud',
    children: [
      {
        id: 2,
        name: '物理机A',
        icon: 'pc',
        children: [
          {
            id: 3,
            name: '虚拟机A1',
            icon: 'vpc',
            children: [],
          },
          {
            id: 4,
            name: '虚拟机A2',
            icon: 'vpc',
            children: [],
          },
          {
            id: 5,
            name: '虚拟机A3',
            icon: 'vpc',
            children: [],
          },
        ],
      },
      {
        id: 6,
        name: '物理机B',
        icon: 'pc',
        children: [
          {
            id: 7,
            name: '虚拟机B1',
            icon: 'vpc',
            children: [],
          },
          {
            id: 8,
            name: '虚拟机B2',
            icon: 'vpc',
            children: [],
          },
          {
            id: 9,
            name: '虚拟机B3',
            icon: 'vpc',
            children: [],
          },
          {
            id: 10,
            name: '虚拟机B4',
            icon: 'vpc',
            children: [],
          },
        ],
      },
      {
        id: 11,
        name: '物理机C',
        icon: 'pc',
        children: [
          {
            id: 12,
            name: '虚拟机C1',
            icon: 'vpc',
            children: [],
          },
          {
            id: 13,
            name: '虚拟机C2',
            icon: 'vpc',
            children: [],
          },
          {
            id: 14,
            name: '虚拟机C3',
            icon: 'vpc',
            children: [],
          },
          {
            id: 15,
            name: '虚拟机C4',
            icon: 'vpc',
            children: [
              {
                id: 16,
                name: '虚拟机C4',
                icon: 'vpc',
                children: [],
              },
            ],
          },
        ],
      },
    ],
  }
];

configure({ enforceActions: true });

export class SummaryStore{
  constructor(rootStore){
    this.rootStore=rootStore;
  }

  @observable
  currentActiveTable = 0;

  @observable
  personalSource = [];

  @observable
  totalSource = [];

  @observable
  cpuState = [];

  @observable
  cloudServer = [];

  @observable
  topologyData = [];

  @observable
  tpUpdateMark = 0;

  @action
  initSummaryData = async ()=>{
    let json = await new Promise((resolve => {
      setTimeout(() => {
        // 首页数据
        resolve({
          success: true,
          personalSource: [
            { type: '实例', values: [7, 5], unit: '个' },
            { type: 'CPU', values: [100, 60], unit: '%' },
            { type: '内存', values: [16, 8], unit: 'GB' },
            { type: '存储卷', values: [10240, 3456], unit: 'GB' },
          ],
          totalSource: [
            { type: '实例', values: [14, 7], unit: '个' },
            { type: 'CPU', values: [100, 34], unit: '%' },
            { type: '内存', values: [64, 23], unit: 'GB' },
            { type: '存储卷', values: [102400, 24560], unit: 'GB' },
          ],
          cpuState: [
            { type: 'CPU1', values: [['2018-05-06', 30], ['2018-05-07', 43], ['2018-05-08', 54], ['2018-05-09', 47]] },
            { type: 'CPU2', values: [['2018-05-06', 10], ['2018-05-07', 15], ['2018-05-08', 76], ['2018-05-09', 23]] },
            { type: 'CPU3', values: [['2018-05-06', 43], ['2018-05-07', 2], ['2018-05-08', 53], ['2018-05-09', 22]] },
            { type: 'CPU4', values: [['2018-05-06', 3], ['2018-05-07', 32], ['2018-05-08', 23], ['2018-05-09', 46]] },
          ],
          cloudServer: [
            { type: '网络代理', total: 10, used: 6, unit: '个' },
            { type: '块存储', total: 10, used: 2, unit: '个' },
            { type: '镜像服务', total: 10, used: 3, unit: '个' },
            { type: '网络服务', total: 10, used: 7, unit: '个' },
            { type: '计算服务', total: 10, used: 4, unit: '个' },
          ],
        })
      }, 1000);
    }));
    runInAction(()=>{
      this.personalSource = json.personalSource;
      this.totalSource = json.totalSource;
      this.cpuState = json.cpuState;
      this.topologyData = topologyData;
      this.tpUpdateMark += 1;
      this.cloudServer = json.cloudServer;
    })
  };

  @action
  toggleTable = (target) => {
    if (this.currentActiveTable === target) return;
    this.currentActiveTable = target;
  };
}
