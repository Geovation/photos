import React, { Component } from 'react';

import Page1 from './Components/Page1';
import Page2 from './Components/Page2';
import Page3 from './Components/Page3';
import LandingPage from './Components/LandingPage';

class App extends Component {
  constructor(props){
      super(props)
      this.state={
        page1:false,
        page2:false,
        page3:false
      }
  }

  openPage1 = (e) =>{
    this.setState({page1:true})
  }

  closePage1 = () =>{
    this.setState({page1:false})
  }

  openPage2 = () =>{
    this.setState({page2:true})
  }

  closePage2 = () =>{
    this.setState({page2:false})
  }

  openPage3 = () =>{
    this.setState({page3:true})
  }

  closePage3 = () =>{
    this.setState({page3:false})
  }


  render() {
    return (
      this.state.page1
          ?
            <Page1 closePage={this.closePage1}/>
          :
          this.state.page2
              ?
              <Page2 closePage={this.closePage2}/>
              :
              this.state.page3
                  ?
                  <Page3 closePage={this.closePage3}/>
                  :
                      <LandingPage
                          openMenu={this.openMenu}
                          closeMenu={this.closeMenu}
                          openPage1={this.openPage1}
                          openPage2={this.openPage2}
                          openPage3={this.openPage3}
                      />
    );
  }
}

export default App;
