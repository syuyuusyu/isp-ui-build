import React from 'react';


class Screen extends React.Component{

    componentDidMount(){

        let obj = JSON.parse(this.props.defaultQueryObj);
        let url = obj.url;
        // let port= this.props.match.path.replace(/\/\w+\/(\d+)\/?(?:\S)*/, (w, p1) => {
        //     return p1;
        // });
        console.log(url);
        if(url){
            window.open(url);
        }
        window.history.back(-1);
    }


    render(){
        return (
            <div></div>
        );
    }
}

export default Screen;
