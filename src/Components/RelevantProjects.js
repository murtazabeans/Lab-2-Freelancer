import React, { Component } from 'react';
import axios from 'axios';
import RelevantProject from './RelevantProject'
import ProjectSearchBar from './ProjectSearchBar'
import {connect} from 'react-redux';
import allreducers from '../reducers';
import reducer from '../reducers/all_projects';
import Pagination from './Pagination';
var config = require('../config');

class RelevantProjects extends Component {

  constructor(){
    super();
    this.state = { data: [], currentPage: 1, perPageRows: 10 };
    this.handleSearchBar = this.handleSearchBar.bind(this);
    this.handlePageChange= this.handlePageChange.bind(this);
  }
  
  componentDidMount(){
    var self = this;
    axios.get(config.host + ":3001/check_session", { withCredentials: true })
    .then((response) => {
      if(response.data.session.email ==  undefined){
        window.location.href = config.host + ":3000/signin";
      }
      else{
        this.get_relevant_projects();
      }
    })
  }

  get_relevant_projects() {
    const user_id = localStorage.getItem("user_id");
    var self = this;
    axios.get(config.host + ":3001/get_relevant_projects?id=" + user_id , { withCredentials: true })
    .then(function (response) {
      if(response.data.rows != null){
        let user_detail = response.data.rows;
        self.setState({
          data: response.data.rows
        })
        return;
      }
      return;
    })
  }

  handleSearchBar(e){
    var self = this;
    if(e.target.value != ""){
      axios.get(config.host + ":3001/search_projects?val=" + e.target.value, { withCredentials: true })
      .then((response) => {
        response.data.data_present ? self.setState({data: response.data.rows}) : self.setState({data: []})
      })
    }
    else{
      self.get_relevant_projects();
    }
  }

  handlePageChange(e) {
    this.setState({currentPage: Number(e.target.dataset.id)})
  }

  handleNextPaginationButton(e) {
    const total_pages = this.state.data.length > 0 ? this.state.data.length/this.state.perPageRows : 0;
    if(this.state.data != [] && this.state.currentPage != Math.ceil(total_pages)){
      this.setState({currentPage: Number(this.state.currentPage + 1)})      
    }
  }

  handlePrevPaginationButton(e) {
    if(this.state.data != [] && this.state.currentPage != 1){
      this.setState({currentPage: Number(this.state.currentPage - 1)})
    }
  }

  render() {
    let projectList, pagination_list=null;
    if(this.state.data.length != 0){
      const indexOfLastTodo = this.state.currentPage * this.state.perPageRows;
      const indexOfFirstTodo = indexOfLastTodo - this.state.perPageRows;
      const currentTodos = this.state.data.slice(indexOfFirstTodo, indexOfLastTodo);
      const total_pages = this.state.data.length > 0 ? this.state.data.length/this.state.perPageRows : 0;
      const page_numbers = [];
      for (let i = 1; i <= Math.ceil(this.state.data.length / this.state.perPageRows); i++) {
        page_numbers.push(i);
      }  
      pagination_list = page_numbers.map(number => {
        return (
          <li class="page-item" key= {number} data-id={number} onClick={this.handlePageChange} ><a data-id={number} class="page-link" href="#">{number}</a></li>
        );
      });
      if(currentTodos != null ){
        projectList = currentTodos.map(project => {
          return(
            <RelevantProject key = {project.id} id = {project.id} number_of_bids = {project.bids.length}  name={project.title} description={project.description} skills_required = {project.skills_required}
            max_budget = {project.max_budget} min_budget = {project.min_budget} employer_id = {project.users[0].id} employer_name={project.users[0].name}   />
          )
        })
      }
    }

    return (
      <div className= "container">
        <h1 id = "table_header" class="display-4">Relevant Projects</h1>
        <div class="row">
          <div class="col-lg-8">
          <ProjectSearchBar handleSearchBar={this.handleSearchBar}/>
          </div>
          <div class="col-lg-4">
            
          </div>
        </div>
        
        
        <table className="table details-table table-striped table-bordered">
          <thead className = "table-header">
            <tr>
              <th scope="col">Name</th>
              <th scope="col">Description</th>
              <th scope="col">Skills Required</th>
              <th scope="col">Budget Range($)</th>
              <th scope="col">Employer Name</th>
              <th scope="col">Number of Bids</th>
              <th scope="col">Actions</th>
            </tr>
          </thead>
          <tbody>
            { projectList }
          </tbody>
        </table>
        <Pagination handlePrevPaginationButton = {this.handlePrevPaginationButton.bind(this)} handleNextPaginationButton = {this.handleNextPaginationButton.bind(this)}
          handlePageChange = {this.handlePageChange.bind(this)} pagination_list = {pagination_list}/>
      </div>
    )
  }
}

function mapStateToProps(state){
  return{
    all_projects: state.all_projects
  }
}

function mapDispatchToProps(dispatch){
  return{
    
  }
}

export default RelevantProjects;