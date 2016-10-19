import React from 'react';
import ApiService from '../services/ApiService';

//Higher order component
var ApiDataContainer = ChildComponent => class extends React.Component {
    
    constructor(props){
        super(props);
        this.apiService = new ApiService();
        this.state = {
            userData : {}
        }
        
    }
    
    componentDidMount() {
        this.apiService.getUser().end((err, response)=>{
            if (response.ok) {
                this.updateUserData(response)
            } else {
                console.log('error')
            }
        });
    }
    
    updateUserData(response){
        this.setState({
            userData: response.body[0]
        })
    }
    
    render() {
        return <ChildComponent {...this.state} />;
    }
};

export default ApiDataContainer;