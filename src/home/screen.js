import React from 'react';


class Screen extends React.Component{

    componentDidMount(){
        window.open('http://10.10.50.10:7006/');
        window.history.back(-1);
    }




    render(){
        return (
            <div></div>
        );
    }
}

export default Screen;
