import React, { Component } from 'react';
import Page1 from './Components/Page1';
import Page2 from './Components/Page2';
import Page3 from './Components/Page3';
import PhotoPage from './Components/PhotoPage';
import LandingPage from './Components/LandingPage';
import Map from './Components/Map';
import Loading from './Components/Loading';

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      page1: false,
      page2: false,
      page3: false,
      photopage: false,
      file: null,
      map: false,
      loading: true,
      control: false,
      location: {}
    };
  }

  openPage1 = () => {
    this.setState({ page1: true });
  }

  closePage1 = () => {
    this.setState((prevState)=>({
      page1: false,
      control: !prevState.control
    }));
  }

  openPage2 = () => {
    this.setState({ page2: true });
  }

  closePage2 = () => {
    this.setState((prevState)=>({
      page2: false,
      control: !prevState.control
    }));
  }

  openPage3 = () => {
    this.setState({ page3: true });
  }

  closePage3 = () => {
    this.setState((prevState)=>({
      page3: false,
      control: !prevState.control
    }));
  }

  openPhotoPage = (file, location) => {
    this.setState({
      photopage: true,
      file
    });
  }

  closePhotoPage = () => {
    this.setState((prevState)=>({
      photopage: false,
      control: !prevState.control
    }));
  }

  openMap = () => {
    this.setState({ map: true });
  }

  closeMap = () => {
    this.setState((prevState)=>({
      map: false,
      control: !prevState.control
    }));
  }

  getLocation(){
    if (navigator && navigator.geolocation) {
      const geoid = navigator.geolocation.watchPosition((position) => {
      const location = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        };
        navigator.geolocation.clearWatch(geoid);
        this.setState({
          loading: false,
          location
        });

      }, error => {
        console.log('Error: ', error.message);
        this.setState({ loading: false });
      }, {
        enableHighAccuracy: false,
        timeout: 3000
      });
    }
  }
  componentDidMount(){
    this.getLocation();
  }

  componentDidUpdate(prevProps,prevState){
    if(prevState.control!==this.state.control){
      this.getLocation();
    }
  }

  render() {
    return (
      this.state.loading
        ?
        <Loading />
        :
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
              this.state.photopage
                ?
                <PhotoPage location={this.state.location} file={this.state.file} closePage={this.closePhotoPage}/>
                :
                this.state.map
                  ?
                  <Map closePage={this.closeMap}/>
                  :
                  <LandingPage
                    openMenu={this.openMenu}
                    closeMenu={this.closeMenu}
                    openPage1={this.openPage1}
                    openPage2={this.openPage2}
                    openPage3={this.openPage3}
                    openPhotoPage={this.openPhotoPage}
                    openMap={this.openMap}
                  />
    );
  }
}

export default App;
