import React,{Component} from 'react';
import '../css/App.css';
import AddAppointments from './AddAppointments';
import SearchAppointments from './SearchAppointments';
import ListAppointments from './ListAppointments';
import {findIndex, without} from 'lodash';


class App extends Component{

  constructor(){
    super();
    this.state = {
      myApponitments: [],
      formDisplay: false,
      orderBy: 'petName',
      orderDir: 'asc',
      queryText: '',
      lastIndex: 0
    };
    this.deleteAppointment = this.deleteAppointment.bind(this); 
    //without binding it to this this.setState in deleteAppointment will not work!
    this.toggleForm = this.toggleForm.bind(this);
    this.addAppointment = this.addAppointment.bind(this);
    this.changeOrder = this.changeOrder.bind(this);
    this.setQueryText = this.setQueryText.bind(this);
    this.updateInfo = this.updateInfo.bind(this);
  }
  

  toggleForm(){
    this.setState({
      formDisplay:!this.state.formDisplay
    });
  }

  deleteAppointment(apt){
    let tempApts = this.state.myApponitments;
    tempApts = without(tempApts, apt);

    this.setState({
      myApponitments: tempApts
    });
  }

  addAppointment(apt){
    let tempApts = this.state.myApponitments;
    apt.aptId = this.state.lastIndex+1; 
    // As the form does  not contain a id we'll feed the previous index that we used.

    tempApts.unshift(apt); //pushing new apt to the array
    this.setState({
      myApponitments: tempApts,
      lastIndex: this.state.lastIndex+1
    })
  }

  updateInfo(name, value, id){
    let tempApts = this.state.myApponitments;
    let aptIndex = findIndex(this.state.myApponitments,{
      aptId:id
    });

    tempApts[aptIndex][name] =value;
    this.setState({
      myApponitments: tempApts
    });
  }

  changeOrder(order, dir){
    this.setState({
      orderBy: order,
      orderDir: dir
    });
  }

  setQueryText(text){
    this.setState({
      queryText: text
    });
  }

  componentDidMount(){
    fetch('./data.json')
      .then(response => response.json())
      .then(result => {
        const apts = result.map(item => {
          item.aptId = this.state.lastIndex;
          this.setState({lastIndex: this.state.lastIndex +1});
          return item;
        })

      this.setState({
        myApponitments: apts
      });

      });
      
  }

  render(){
    
    let order;
    let filteredApts = this.state.myApponitments;
    if(this.state.orderDir === 'asc'){
      order = 1;
    }else{
      order = -1;
    }

    filteredApts = filteredApts.sort((a,b) => {
      if(a[this.state.orderBy].toLowerCase()<b[this.state.orderBy].toLowerCase()){
        return -1 * order;
      }
      return 1*order;
    }).filter(eachItem => {
        return(
          eachItem['petName']
          .toLowerCase()
          .includes(this.state.queryText.toLowerCase()) ||
          eachItem['ownerName']
          .toLowerCase()
          .includes(this.state.queryText.toLowerCase()) ||
          eachItem['aptDate']
          .toLowerCase()
          .includes(this.state.queryText.toLowerCase()) ||
          eachItem['aptNotes']
          .toLowerCase()
          .includes(this.state.queryText.toLowerCase())
        );
    } );

    return (
      <main className="page bg-white" id="petratings">
          <div className="container">
            <div className="row">
              <div className="col-md-12 bg-white">
                <div className="container">
                  <AddAppointments 
                    formDisplay={this.state.formDisplay}
                    toggleForm={this.toggleForm}
                    addAppointment={this.addAppointment}/> 
                    {/* this addAppointment={this.addAppointment} will call a local method to deal
                    with the prop*/}
                  <SearchAppointments
                    orderBy = {this.state.orderBy}
                    orderDir = {this.state.orderDir}
                    changeOrder = {this.changeOrder}
                    setQueryText = {this.setQueryText}
                  />
                  <ListAppointments appointments={filteredApts}
                    deleteAppointment={this.deleteAppointment}
                    updateInfo={this.updateInfo}/>
                </div>
              </div>
            </div>
          </div>
        </main>
    );
  }
}

export default App;
