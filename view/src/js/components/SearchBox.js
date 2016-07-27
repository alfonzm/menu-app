import React from "react";
import { Link } from "react-router";
import $ from "jquery";

import Image from "./Image.js"

var API_URL = 'http://localhost:8000/';

export default class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isActive: 'input-wrap search-wrap',
      value: '',
      searchResult: []
    };
  }
  handleFocus() {
    if(this.state.isActive != 'collapse input-wrap search-wrap') {
      this.setState({ isActive: 'collapse input-wrap search-wrap' });
    }
  }
  handleFocusOut() {
    this.setState({ isActive: 'input-wrap search-wrap' });
  }
  handleChange(event) {
    this.setState({ value: event.target.value }, () => {
      if(this.state.value == ""){
        this.setState({ searchResult: [] });
        return;
      }

      var self = this;
      var productname = this.state.value;

      $.ajax({
        url: API_URL + 'products?name=' + productname,
        method: 'GET',
        success: function(data){
          self.setState({ searchResult: data });
        },
        error: function(x, e, s){
          console.error(x);
          console.error(e);
          console.error(s);
        }
      });
    });
  }
  render() {
    var collapse = this.state.isActive;
    var products = this.state.searchResult;

    var searchResultComponents = products.map(function(products, i) {
      return  <div key={i} class="rslt-elem">
                <Image />
                <div class="info-container">
                  <span class="item-name">{products.name.en}</span>
                  <span class="item-info">{products.category.name.en} /{products.subcategory.name.en} &nbsp;<span class="sale-tag"></span></span>
                </div>
              </div>;
    });

      return <div className={this.state.isActive} onBlur={() => this.handleFocusOut()} onFocus={() => this.handleFocus()} tabIndex="0">
               <input type="search" id="search" class="search-field icon-contain" placeholder="Search Product..." value={this.state.value} onChange={this.handleChange.bind(this)}></input>
               <label for="search" class="btn-icn mdi mdi-magnify"></label>
               <div class="rslt-view">{searchResultComponents}</div>
             </div>;
  }
}
