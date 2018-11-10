import React, { Component } from 'react';
import PhotoPage from './components/PhotoPage';
import LandingPage from './components/LandingPage';
import Map from './components/Map';
import Loading from './components/Loading';
import config from "./custom/config";

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      page: Loading,
      page1: false,
      page2: false,
      page3: false,
      photopage: false,
      file: null,
      map: false,
      loading: true,
      location: {},
      isSignedIn: undefined,
    };
  }

  openPage1 = () => {
    this.setState({ page1: true });
  }

  closePage1 = () => {
    this.setState({ page1: false });
  }

  openPage2 = () => {
    this.setState({ page2: true });
  }

  closePage2 = () => {
    this.setState({ page2: false });
  }

  openPage3 = () => {
    this.setState({ page3: true });
  }

  closePage3 = () => {
    this.setState({ page3: false });
  }

  openPhotoPage = (file) => {
    this.setState({
      photopage: true,
      file
    });
  }

  closePhotoPage = () => {
    this.setState({ photopage: false });
  }

  openMap = () => {
    this.setState({ map: true });
  }

  closeMap = () => {
    this.setState({ map: false });
  }

  getLocation() {
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

    if (this.state.loading) { this.setState({ page: Loading}); }

    this.unregisterAuthObserver = config.authModule.onAuthStateChanged((user) => {

      if (this.state.isSignedIn && !user) {
        // lets start fresh
        window.location.reload()
      }

      this.setState({isSignedIn: user});
    });
  }

  async componentWillUnmount() {
    await this.unregisterAuthObserver();
  }

  render() {
    return (
      this.state.loading
        ?
        <Loading />
        :
        this.state.page1
          ?
          <config.Page1 closePage={this.closePage1}/>
          :
          this.state.page2
            ?
            <config.Page2 closePage={this.closePage2}/>
            :
            this.state.page3
              ?
              <config.Page3 closePage={this.closePage3}/>
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
                    isSignedIn={this.state.isSignedIn}
                  />
    );
  }
}

export default App;
