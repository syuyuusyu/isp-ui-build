import React, { Component } from 'react';
import {inject,observer} from 'mobx-react';
import {InvkeGrid} from '../invoke';
import {Switch,Route,} from 'react-router-dom';


@inject('rootStore')
@observer
class SubContent extends Component{

    render(){
        //const router=this.props.rootStore.routerStore;
         return (
             <div>
            <Switch>
                <Route exact path='/' ><div>sdsdsdsdsd</div></Route>
                <Route exact path='/invoke' component={InvkeGrid}/>
            </Switch>
             </div>
        );
        //return <InvkeGrid/>
    }

}

export default SubContent;