import {TreeStore} from "./main";
import { HomeStore } from "./home";
import { SummaryStoreCM, SummaryStoreBD } from './summary';
import {RoleStore, RoleMenuStore, RoleButtonStore, RoleSysStore} from "./roleConf";
import {AuthorityStore} from './login';
import {UserRoleStore} from './userRole';
import {ButtonStore} from './buttonConf';
import {SysStore} from "./sysConf";
import {SysOperationStore} from './sysOperation';
import {InvokeOpStore} from './sysInvoke';
import {SysmetadataStore} from './sysMetadata';
import {CloudStore} from "./cloudapply";
import {OrgStore} from './orgOperation';
import {SwiftStore} from './swift';
import {InterfacesLogStory} from "./interfacesLog/store";
import NotificationSotre from "./notification/store";
import {DataUserStore} from './datauser';
import {DataSpaceStore} from './dataspace';
import {SystemLogStore} from "./systemLog/store";

import {DashBoardStore} from './dashboard';

import {BacklogLogStore} from "./backlogLog/store";
import {SignUpStore} from "./signUp/store";
import {ActivitiStore} from "./activiti";





export default class RootStore {



    constructor() {
        this.treeStore = new TreeStore(this);
        this.homeStore = new HomeStore(this);
        this.summaryStoreCM = new SummaryStoreCM(this);
        this.summaryStoreBD = new SummaryStoreBD(this);
        this.roleStore = new RoleStore(this);
        this.roleMenuStore = new RoleMenuStore(this);
        this.authorityStore = new AuthorityStore(this);
        this.userRoleStore = new UserRoleStore(this);
        this.buttonStore = new ButtonStore(this);
        this.sysStore = new SysStore(this);
        this.sysOperationStore = new SysOperationStore(this);
        this.invokeOpStore = new InvokeOpStore(this);
        this.roleButtonStore = new RoleButtonStore(this);
        this.roleSysStore = new RoleSysStore(this);
        this.sysmetadataStore = new SysmetadataStore(this);
        this.cloudStore = new CloudStore(this);
        this.orgOperationStore = new OrgStore(this);
        this.swiftStore=new SwiftStore(this);
        this.notificationStore=new NotificationSotre(this);
        this.interfacesLog=new InterfacesLogStory(this);
        this.dataUserStore=new DataUserStore(this);
        this.dataSpaceStore=new DataSpaceStore(this);
        this.systemLogStore=new SystemLogStore(this);

        this.dashBoardStore=new DashBoardStore(this);

        this.backlogLogStore=new BacklogLogStore(this);
        this.signUpStore=new SignUpStore(this);
        this.activitiStore=new ActivitiStore(this);

    }
}

