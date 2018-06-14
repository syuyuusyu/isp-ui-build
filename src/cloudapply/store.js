import {observable, configure, action, runInAction,} from 'mobx';
import {baseUrl, get, post} from '../util';
import {notification} from 'antd';

configure({enforceActions: true});


export class CloudStore {

  constructor(rootStore) {
    this.rootStore = rootStore;
  }

  @observable
  serverInfo = [];

  @observable
  images = [];

  @observable
  networks = [];

  @observable
  flavors = [];

  @observable
  loading = false;

  @observable
  loadingtest = '';

  @observable
  formVisible = false;

  @observable
  flavorsColor = {};

  @observable
  networksColor = {};

  @observable
  imagesColor = {};

  @observable
  flavorId = '';

  @observable
  networkId = '';

  @observable
  imageId = '';


  @action
  toggleFormVisible = () => {
    this.formVisible = !this.formVisible;
  };

  scheduleToken = () => {
    get(`${baseUrl}/invoke/cloudToken`);
  };

  @action
  loadServerInfo = async () => {
    runInAction(() => {
      this.loading = true;
      this.loadingtest = '获取云机状态...'
    });
    let json = await post(`${baseUrl}/invoke/cloud_servers_info`);
    console.log(json);
    runInAction(() => {
      if (json.code && json.code === 500) {
        this.serverInfo = [];
        notification.error({message: '连接云平台失败',});
      } else {
        this.serverInfo = json;
      }
      this.loading = false;
    });

  };

  @action
  loadFormInput = async () => {
    runInAction(() => {
      this.loading = true;
      this.loadingtest = '正在向云平台获取表单信息...'
    });
    let json=await post(`${baseUrl}/invoke/cloud_form`);
/*    let json = {
      "flavors": [
        {
          "id": "1bc6dfe0-48a4-4e1b-988d-1987b956d340",
          "name": "8C64G100G",
          "ram": 65536,
          "vcpus": 8,
          "disk": 100,
          "swap": 0,
          "rxtxFactor": 1,
          "ephemeral": 0,
          "links": [
            {
              "rel": "self",
              "href": "http://controller:8774/v2.1/flavors/1bc6dfe0-48a4-4e1b-988d-1987b956d340"
            },
            {
              "rel": "bookmark",
              "href": "http://controller:8774/flavors/1bc6dfe0-48a4-4e1b-988d-1987b956d340"
            }
          ]
        },
        {
          "id": "3d87b655-ed1f-4703-946a-1b6c6fd4a220",
          "name": "8C16G100G",
          "ram": 16348,
          "vcpus": 8,
          "disk": 100,
          "swap": 0,
          "rxtxFactor": 1,
          "ephemeral": 0,
          "links": [
            {
              "rel": "self",
              "href": "http://controller:8774/v2.1/flavors/3d87b655-ed1f-4703-946a-1b6c6fd4a220"
            },
            {
              "rel": "bookmark",
              "href": "http://controller:8774/flavors/3d87b655-ed1f-4703-946a-1b6c6fd4a220"
            }
          ]
        },
        {
          "id": "5536189c-0341-4345-ad86-08464b0a0635",
          "name": "2C16G100G",
          "ram": 16348,
          "vcpus": 2,
          "disk": 100,
          "swap": 0,
          "rxtxFactor": 1,
          "ephemeral": 0,
          "links": [
            {
              "rel": "self",
              "href": "http://controller:8774/v2.1/flavors/5536189c-0341-4345-ad86-08464b0a0635"
            },
            {
              "rel": "bookmark",
              "href": "http://controller:8774/flavors/5536189c-0341-4345-ad86-08464b0a0635"
            }
          ]
        },
        {
          "id": "56f4596e-0b35-4cca-b28e-710afb0d6f1f",
          "name": "2C4G10G",
          "ram": 4096,
          "vcpus": 2,
          "disk": 10,
          "swap": 0,
          "rxtxFactor": 1,
          "ephemeral": 0,
          "links": [
            {
              "rel": "self",
              "href": "http://controller:8774/v2.1/flavors/56f4596e-0b35-4cca-b28e-710afb0d6f1f"
            },
            {
              "rel": "bookmark",
              "href": "http://controller:8774/flavors/56f4596e-0b35-4cca-b28e-710afb0d6f1f"
            }
          ]
        },
        {
          "id": "6b9bce5b-6489-44d5-aa68-f4085a0da80f",
          "name": "4C32G100G",
          "ram": 32768,
          "vcpus": 4,
          "disk": 100,
          "swap": 0,
          "rxtxFactor": 1,
          "ephemeral": 0,
          "links": [
            {
              "rel": "self",
              "href": "http://controller:8774/v2.1/flavors/6b9bce5b-6489-44d5-aa68-f4085a0da80f"
            },
            {
              "rel": "bookmark",
              "href": "http://controller:8774/flavors/6b9bce5b-6489-44d5-aa68-f4085a0da80f"
            }
          ]
        },
        {
          "id": "7e2fdba3-99ba-4836-a242-b1364be6fca0",
          "name": "16C32G500G",
          "ram": 32768,
          "vcpus": 16,
          "disk": 500,
          "swap": 0,
          "rxtxFactor": 1,
          "ephemeral": 0,
          "links": [
            {
              "rel": "self",
              "href": "http://controller:8774/v2.1/flavors/7e2fdba3-99ba-4836-a242-b1364be6fca0"
            },
            {
              "rel": "bookmark",
              "href": "http://controller:8774/flavors/7e2fdba3-99ba-4836-a242-b1364be6fca0"
            }
          ]
        },
        {
          "id": "a2b1a915-8b5e-4aef-9a63-0b885d608872",
          "name": "2C8G100G",
          "ram": 8192,
          "vcpus": 2,
          "disk": 100,
          "swap": 0,
          "rxtxFactor": 1,
          "ephemeral": 0,
          "links": [
            {
              "rel": "self",
              "href": "http://controller:8774/v2.1/flavors/a2b1a915-8b5e-4aef-9a63-0b885d608872"
            },
            {
              "rel": "bookmark",
              "href": "http://controller:8774/flavors/a2b1a915-8b5e-4aef-9a63-0b885d608872"
            }
          ]
        },
        {
          "id": "b2b29350-6c54-4fce-bff2-d01e220c6a16",
          "name": "8C32G100G",
          "ram": 32768,
          "vcpus": 8,
          "disk": 100,
          "swap": 0,
          "rxtxFactor": 1,
          "ephemeral": 0,
          "links": [
            {
              "rel": "self",
              "href": "http://controller:8774/v2.1/flavors/b2b29350-6c54-4fce-bff2-d01e220c6a16"
            },
            {
              "rel": "bookmark",
              "href": "http://controller:8774/flavors/b2b29350-6c54-4fce-bff2-d01e220c6a16"
            }
          ]
        },
        {
          "id": "bf1dece7-5657-434d-a46d-65f155e54af6",
          "name": "8C16G200G",
          "ram": 16384,
          "vcpus": 8,
          "disk": 200,
          "swap": 0,
          "rxtxFactor": 1,
          "ephemeral": 0,
          "links": [
            {
              "rel": "self",
              "href": "http://controller:8774/v2.1/flavors/bf1dece7-5657-434d-a46d-65f155e54af6"
            },
            {
              "rel": "bookmark",
              "href": "http://controller:8774/flavors/bf1dece7-5657-434d-a46d-65f155e54af6"
            }
          ]
        },
        {
          "id": "d61db4b1-da84-49cc-ba9c-eed79eccff13",
          "name": "1C1G1G",
          "ram": 1024,
          "vcpus": 1,
          "disk": 1,
          "swap": 0,
          "rxtxFactor": 1,
          "ephemeral": 0,
          "links": [
            {
              "rel": "self",
              "href": "http://controller:8774/v2.1/flavors/d61db4b1-da84-49cc-ba9c-eed79eccff13"
            },
            {
              "rel": "bookmark",
              "href": "http://controller:8774/flavors/d61db4b1-da84-49cc-ba9c-eed79eccff13"
            }
          ]
        },
        {
          "id": "e123e533-e663-4d55-83e1-7fb2c3278759",
          "name": "4C16G100G",
          "ram": 16384,
          "vcpus": 4,
          "disk": 100,
          "swap": 0,
          "rxtxFactor": 1,
          "ephemeral": 0,
          "links": [
            {
              "rel": "self",
              "href": "http://controller:8774/v2.1/flavors/e123e533-e663-4d55-83e1-7fb2c3278759"
            },
            {
              "rel": "bookmark",
              "href": "http://controller:8774/flavors/e123e533-e663-4d55-83e1-7fb2c3278759"
            }
          ]
        },
        {
          "id": "f648a6d6-ca96-4110-bb78-c0ac1ac195c9",
          "name": "4C8G100G",
          "ram": 8192,
          "vcpus": 4,
          "disk": 100,
          "swap": 0,
          "rxtxFactor": 1,
          "ephemeral": 0,
          "links": [
            {
              "rel": "self",
              "href": "http://controller:8774/v2.1/flavors/f648a6d6-ca96-4110-bb78-c0ac1ac195c9"
            },
            {
              "rel": "bookmark",
              "href": "http://controller:8774/flavors/f648a6d6-ca96-4110-bb78-c0ac1ac195c9"
            }
          ]
        }
      ],
      "network": [
        {
          "id": "3ab9bbbd-c7e0-4d4f-9512-4c37dfc82111",
          "name": "demo-net",
          "tenantId": "491ec2831b2146b18fb8bf0c0ab4a1e5",
          "tenantName": "demo",
          "adminStateUp": true,
          "shared": false,
          "routerExternal": false,
          "status": "ACTIVE",
          "neutronSubnets": [
            {
              "id": "7c88bfa5-9341-4d95-8f94-6f9b1a4d4049",
              "name": "demo-subnet",
              "cidr": "10.100.5.0/24",
              "enable_dhcp": true,
              "network_id": "3ab9bbbd-c7e0-4d4f-9512-4c37dfc82111",
              "tenant_id": "491ec2831b2146b18fb8bf0c0ab4a1e5",
              "dns_nameservers": [],
              "allocation_pools": [
                {
                  "start": "10.100.5.2",
                  "end": "10.100.5.254"
                }
              ],
              "host_routes": [],
              "ip_version": 4,
              "gateway_ip": "10.100.5.1"
            }
          ],
          "createSubnet": false
        },
        {
          "id": "807d2fde-5378-49d6-a705-b0caeccffb7e",
          "name": "supermap-net",
          "tenantId": "aba15fc5cd9d49e2bce23ba1ac9533d0",
          "tenantName": "supermap",
          "adminStateUp": true,
          "shared": false,
          "routerExternal": false,
          "status": "ACTIVE",
          "neutronSubnets": [
            {
              "id": "5aa7fabb-4d92-4f54-84a8-3ce59e1c4d23",
              "name": "supermap-subnet",
              "cidr": "10.100.7.0/24",
              "enable_dhcp": true,
              "network_id": "807d2fde-5378-49d6-a705-b0caeccffb7e",
              "tenant_id": "aba15fc5cd9d49e2bce23ba1ac9533d0",
              "dns_nameservers": [],
              "allocation_pools": [
                {
                  "start": "10.100.7.2",
                  "end": "10.100.7.254"
                }
              ],
              "host_routes": [],
              "ip_version": 4,
              "gateway_ip": "10.100.7.1"
            }
          ],
          "createSubnet": false
        },
        {
          "id": "ac8893fc-1bfb-43fe-8038-36e28d7d9750",
          "name": "public-net",
          "tenantId": "ec6856e168e34ab28582578a7bfa4806",
          "tenantName": "admin",
          "adminStateUp": true,
          "shared": true,
          "routerExternal": true,
          "status": "ACTIVE",
          "neutronSubnets": [
            {
              "id": "b5f68242-80e6-44e0-b10c-688dbbb86489",
              "name": "public-subnet",
              "cidr": "10.10.0.0/16",
              "enable_dhcp": true,
              "network_id": "ac8893fc-1bfb-43fe-8038-36e28d7d9750",
              "tenant_id": "ec6856e168e34ab28582578a7bfa4806",
              "dns_nameservers": [
                "10.10.0.254"
              ],
              "allocation_pools": [
                {
                  "start": "10.10.50.1",
                  "end": "10.10.50.254"
                }
              ],
              "host_routes": [],
              "ip_version": 4,
              "gateway_ip": "10.10.0.254"
            }
          ],
          "createSubnet": false
        },
        {
          "id": "f475f2a7-e26b-4979-9502-f7e60a5c056c",
          "name": "yzy0net",
          "tenantId": "616103de118045498e61da9b2b1ff512",
          "tenantName": "mapgis",
          "adminStateUp": true,
          "shared": false,
          "routerExternal": false,
          "status": "ACTIVE",
          "neutronSubnets": [
            {
              "id": "8a0148b1-7e9c-4281-9484-472a33058a80",
              "name": "yzy-subnet",
              "cidr": "10.100.6.0/24",
              "enable_dhcp": true,
              "network_id": "f475f2a7-e26b-4979-9502-f7e60a5c056c",
              "tenant_id": "616103de118045498e61da9b2b1ff512",
              "dns_nameservers": [
                "10.10.0.254"
              ],
              "allocation_pools": [
                {
                  "start": "10.100.6.2",
                  "end": "10.100.6.254"
                }
              ],
              "host_routes": [],
              "ip_version": 4,
              "gateway_ip": "10.100.6.1"
            }
          ],
          "createSubnet": false
        }
      ],
      "image": [
        {
          "id": "d2fd0289-a9ad-4862-88e4-73f9641a82f5",
          "name": "test001",
          "owner": "admin",
          "snapshot": false,
          "status": "active",
          "visibility": "public",
          "diskFormat": "iso",
          "size": 515374,
          "description": "",
          "minDisk": 0,
          "minRam": 0,
          "metadata": {
            "description": ""
          },
          "protected": false
        },
        {
          "id": "02d23723-e19b-4e54-b267-b22d2910a801",
          "name": "test001",
          "owner": "demo",
          "snapshot": false,
          "status": "active",
          "visibility": "public",
          "diskFormat": "qcow2",
          "size": 2050883584,
          "description": "mininet",
          "minDisk": 10,
          "minRam": 0,
          "metadata": {
            "owner_user_name": "hmily001",
            "base_image_ref": "9d4b71a0-09ac-41fd-92e2-a3a286105b29",
            "boot_roles": "mengyuxiang",
            "user_id": "a23c742b7a774e6e888641b305c394c2",
            "owner_id": "491ec2831b2146b18fb8bf0c0ab4a1e5",
            "description": "mininet",
            "image_location": "snapshot",
            "image_state": "available",
            "owner_project_name": "demo",
            "image_type": "snapshot"
          },
          "protected": false
        },
        {
          "id": "5f6e637a-256d-4a37-a039-56ebc2a83d55",
          "name": "cope-test",
          "owner": "demo",
          "snapshot": false,
          "status": "active",
          "visibility": "private",
          "diskFormat": "qcow2",
          "size": 2050883584,
          "description": "mininet",
          "minDisk": 10,
          "minRam": 0,
          "metadata": {
            "owner_user_name": "hmily001",
            "base_image_ref": "9d4b71a0-09ac-41fd-92e2-a3a286105b29",
            "boot_roles": "mengyuxiang",
            "user_id": "a23c742b7a774e6e888641b305c394c2",
            "owner_id": "491ec2831b2146b18fb8bf0c0ab4a1e5",
            "description": "mininet",
            "image_location": "snapshot",
            "image_state": "available",
            "owner_project_name": "demo",
            "image_type": "snapshot"
          },
          "protected": false
        },
        {
          "id": "bdad916b-7d87-46f3-be62-2ef0e79134b3",
          "name": "test",
          "owner": "demo",
          "snapshot": false,
          "status": "active",
          "visibility": "private",
          "diskFormat": "qcow2",
          "size": 2050883584,
          "description": "mininet",
          "minDisk": 10,
          "minRam": 0,
          "metadata": {
            "owner_user_name": "hmily001",
            "base_image_ref": "9d4b71a0-09ac-41fd-92e2-a3a286105b29",
            "boot_roles": "mengyuxiang",
            "user_id": "a23c742b7a774e6e888641b305c394c2",
            "owner_id": "491ec2831b2146b18fb8bf0c0ab4a1e5",
            "description": "mininet",
            "image_location": "snapshot",
            "image_state": "available",
            "owner_project_name": "demo",
            "image_type": "snapshot"
          },
          "protected": false
        },
        {
          "id": "9d4b71a0-09ac-41fd-92e2-a3a286105b29",
          "name": "mininet",
          "owner": "admin",
          "snapshot": false,
          "status": "active",
          "visibility": "public",
          "diskFormat": "vmdk",
          "size": 2047868928,
          "description": "mininet",
          "minDisk": 0,
          "minRam": 0,
          "metadata": {
            "description": "mininet"
          },
          "protected": true
        },
        {
          "id": "44ee201c-abcf-44fc-b168-8646f39f58ce",
          "name": "ttt",
          "owner": "admin",
          "snapshot": false,
          "status": "active",
          "visibility": "unknown",
          "diskFormat": "qcow2",
          "size": 197120,
          "minDisk": 0,
          "minRam": 0,
          "metadata": {},
          "protected": false
        },
        {
          "id": "efe4a7a4-6627-4925-b1d4-266ee872f1cd",
          "name": "supermap-imanager-9.0.1-180105-8-openstack-qcow2",
          "owner": "admin",
          "snapshot": false,
          "status": "active",
          "visibility": "public",
          "diskFormat": "qcow2",
          "size": 3058273280,
          "minDisk": 0,
          "minRam": 0,
          "metadata": {},
          "protected": false
        },
        {
          "id": "f9e2c413-dd9c-4f2c-ac58-0b9607ff89d6",
          "name": "supermap_iserver_14ubuntu14.04",
          "owner": "admin",
          "snapshot": false,
          "status": "active",
          "visibility": "public",
          "diskFormat": "qcow2",
          "size": 1228682752,
          "minDisk": 0,
          "minRam": 0,
          "metadata": {},
          "protected": false
        },
        {
          "id": "801db4e7-cd13-42de-b71d-0c2aa1c80786",
          "name": "sahara-cloudera-5.9.0-centos7",
          "owner": "admin",
          "snapshot": false,
          "status": "active",
          "visibility": "public",
          "diskFormat": "qcow2",
          "size": 4008312832,
          "minDisk": 0,
          "minRam": 0,
          "metadata": {
            "_sahara_tag_cdh": "True",
            "_sahara_tag_5.9.0": "True",
            "_sahara_username": "centos"
          },
          "protected": true
        },
        {
          "id": "9153cc3a-70c9-44bf-af6d-846b3c133335",
          "name": "windows_server_2016_x64_cloudinit",
          "owner": "admin",
          "snapshot": false,
          "status": "active",
          "visibility": "public",
          "diskFormat": "qcow2",
          "size": 10249437184,
          "minDisk": 0,
          "minRam": 0,
          "metadata": {},
          "protected": true
        },
        {
          "id": "9773f80a-0673-4a18-b80c-9a8c3242353f",
          "name": "windows_server_2012_r2_x64_cloudinit",
          "owner": "admin",
          "snapshot": false,
          "status": "active",
          "visibility": "public",
          "diskFormat": "qcow2",
          "size": 8216576000,
          "minDisk": 0,
          "minRam": 0,
          "metadata": {},
          "protected": true
        },
        {
          "id": "d5d636d3-7bab-48dd-9707-9dd17f31c33b",
          "name": "windows_server_2008_r2_x64_cloudinit",
          "owner": "admin",
          "snapshot": false,
          "status": "active",
          "visibility": "public",
          "diskFormat": "qcow2",
          "size": 7712407552,
          "minDisk": 0,
          "minRam": 0,
          "metadata": {},
          "protected": true
        },
        {
          "id": "5f760649-2887-4654-b01b-aa74f060ac3a",
          "name": "CentOS-7-x86_64-GenericCloud-1708",
          "owner": "admin",
          "snapshot": false,
          "status": "active",
          "visibility": "public",
          "diskFormat": "qcow2",
          "size": 854851584,
          "minDisk": 0,
          "minRam": 0,
          "metadata": {},
          "protected": true
        },
        {
          "id": "f719e208-29dd-443d-901f-5a1f919ef5b0",
          "name": "CentOS-7-x86_64-1708-GUIServer",
          "owner": "admin",
          "snapshot": false,
          "status": "active",
          "visibility": "public",
          "diskFormat": "qcow2",
          "size": 3952869376,
          "minDisk": 0,
          "minRam": 0,
          "metadata": {},
          "protected": true
        },
        {
          "id": "110f941f-7a6c-479d-bd39-20888224c1d4",
          "name": "cirros",
          "owner": "admin",
          "snapshot": false,
          "status": "active",
          "visibility": "public",
          "diskFormat": "qcow2",
          "size": 12716032,
          "minDisk": 0,
          "minRam": 0,
          "metadata": {},
          "protected": true
        }
      ]
    }*/
    if (json.status && json.status === 500) {
      notification.error({message: '连接云平台失败',});
      runInAction(() => {
        this.loading = false;
      })
    } else {
      runInAction(() => {
        this.images = json.image;
        this.networks = json.network;
        this.flavors = json.flavors;
        this.loading = false;
      });
      for (let i = 0; i < this.flavors.length; i++) {
        const id = this.flavors[i].id;
        this.flavorsColor[id] = 'orange';
      }
      for (let i = 0; i < this.images.length; i++) {
        const id = this.images[i].id;
        this.imagesColor[id] = 'orange';
      }
      for (let i = 0; i < this.networks.length; i++) {
        const id = this.networks[i].id;
        this.networksColor[id] = 'orange';
      }
    }

  };

  @action
  detail = (record) => (() => {

  });

  @action
  onClickFlavors = (value) => {
    for (let i in this.flavorsColor) {
      this.flavorsColor[i] = 'orange';
    }
    this.flavorsColor = {...this.flavorsColor, [value]: 'gray'};
    this.flavorId = value;
  };

  @action
  onClickImages = (value) => {
    for (let i in this.imagesColor) {
      this.imagesColor[i] = 'orange';
    }
    this.imagesColor = {...this.imagesColor, [value]: 'gray'};
    this.imageId = value;
  };

  @action
  onClickNetworks = (value) => {
    for (let i in this.networksColor) {
      this.networksColor[i] = 'orange';
    }
    this.networksColor = {...this.networksColor, [value]: 'gray'};
    this.networkId = value;
  }
}
