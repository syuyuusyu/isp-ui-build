import {observable,action,runInAction,configure} from 'mobx';
import { Message } from 'antd';
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
  personalSource = [
    { type: 'CPU', values: [1, 0], unit: '个' },
    { type: '内存', values: [1, 0], unit: 'MB' },
    { type: '存储', values: [1, 0], unit: 'GB' },
    { type: '实例', values: [1, 0], unit: '个' },
  ];

  @observable
  totalSource = [
    { type: 'CPU', values: [1, 0], unit: '个' },
    { type: '内存', values: [1, 0], unit: 'GB' },
    { type: '存储', values: [1, 0], unit: 'TB' },
  ];

  @observable
  cpuState = [];

  @observable
  cloudServer = [
    { type: '网络代理', total: 1, used: 0, unit: '个' },
    { type: '块存储', total: 1, used: 0, unit: '个' },
    { type: '镜像服务', total: 1, used: 0, unit: '个' },
    { type: '网络服务', total: 1, used: 0, unit: '个' },
    { type: '计算服务', total: 1, used: 0, unit: '个' },
  ];

  @observable
  topologyData = [];

  @observable
  tpUpdateMark = 0;

  @action
  initSummaryData = async ()=>{
    const { UserSourceMsg, CloudSource, getCpuInfo, getTopology, getSysMsg } = await post(`${baseUrl}/invoke/cloud_monitor`);
    runInAction(()=>{
      if (UserSourceMsg && UserSourceMsg.ok !== false) {
        this.personalSource = [
          { type: 'CPU', values: [UserSourceMsg.totalCores, UserSourceMsg.coreUsed], unit: '个' },
          { type: '内存', values: [UserSourceMsg.totalRAMSize, UserSourceMsg.ramused], unit: 'MB' },
          { type: '存储', values: [UserSourceMsg.totalVolumeStorage, UserSourceMsg.volumeStorageUsed], unit: 'GB' },
          { type: '实例', values: [UserSourceMsg.totalInstances, UserSourceMsg.instanceUsed], unit: '个' },
        ];
      }
      if (CloudSource && CloudSource.ok !== false) {
        this.totalSource = [
          { type: 'CPU', values: [CloudSource.vcpus, CloudSource.vcpus_used], unit: '个' },
          { type: '内存', values: [Math.round(CloudSource.memory_mb / 1024), Math.round(CloudSource.memory_mb_used / 1024)], unit: 'GB' },
          { type: '存储', values: [(CloudSource.local_gb / 1024).toFixed(2), (CloudSource.local_gb_used / 1024).toFixed(2)], unit: 'TB' },
        ];
      }
      if (getCpuInfo && getCpuInfo.ok !== false) {
        this.cpuState = (() => {
          let result = [];
          getCpuInfo.forEach((item) => {
            result.push({
              type: item.name,
              values: (({ data, time }) => {
                let values = [];
                data.forEach((value, index) => {
                  if (value !== 'NaN') {
                    values.push([time[index], value]);
                  }
                });
                return values
              })(item),
            })
          });
          return result
        })();
      }
      if (getTopology && getTopology.entity !== undefined) {
        this.topologyData = getTopology.entity
      }
      if (getSysMsg && getSysMsg.ok !== false) {
        const { agent, blockStorage, compute, image, network } = getSysMsg;
        const total = agent + blockStorage + compute + image + network;
        this.cloudServer = [
          { type: '网络代理', total, used: agent, unit: '个' },
          { type: '块存储', total, used: blockStorage, unit: '个' },
          { type: '镜像服务', total, used: image, unit: '个' },
          { type: '网络服务', total, used: network, unit: '个' },
          { type: '计算服务', total, used: compute, unit: '个' },
        ];
      }
      this.tpUpdateMark += 1;
    });
  };

  @action
  toggleTable = (target) => {
    if (this.currentActiveTable === target) return;
    this.currentActiveTable = target;
  };
}
