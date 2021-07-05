import React, { Component } from "react";
import { connect } from "react-redux";

import PropTypes from "prop-types";
import loadImage from "blueimp-load-image";
import dms2dec from "dms2dec";

import Button from "@material-ui/core/Button";
import { withStyles } from "@material-ui/core/styles";

import config from "custom/config";
import { gtagEvent } from "gtag.js";
import "./style.scss";

import PageWrapper from "components/PageWrapper";
import Fields from "./Fields";
import GeoTag from "./GeoTag";
import MapLocation from "types/MapLocation";
import { GeolocationContext } from "store/GeolocationContext";

const emptyState = {
  imgSrc: null,
  imgLocation: null,
  anyError: true,
  enabledUploadButton: true,
  next: false,
  fieldsValues: {},
};

const styles = (theme) => ({
  cssUnderline: {
    "&:after": {
      borderBottomColor: theme.palette.secondary.main,
    },
  },
  progress: {
    margin: theme.spacing(2),
  },
  link: {
    color: theme.palette.secondary.main,
  },
  notchTop: {
    paddingTop: 0,
  },
  notchBottom: {
    paddingBottom: 0,
  },
  fields: {
    margin: theme.spacing(1.5),
  },
  photo: {
    marginRight: theme.spacing(1.5),
    marginLeft: theme.spacing(1.5),
    marginBottom: theme.spacing(0.5),
  },
});

class PhotoPage extends Component {
  static contextType = GeolocationContext;

  constructor(props) {
    super(props);
    this.state = { ...emptyState };
  }

  /**
   * Given an exif object, return the coordinates {latitude, longitude} or undefined if an error occurs
   */
  getLocationFromExifMetadata = (imgExif) => {
    let location, latitude, longitude;
    try {
      // https://www.npmjs.com/package/dms2dec
      const GPSInfo = imgExif.GPSInfo;
      const lat = GPSInfo.GPSLatitude.split(",").map(Number);
      const latRef = GPSInfo.GPSLatitudeRef;
      const lon = GPSInfo.GPSLongitude.split(",").map(Number);
      const lonRef = GPSInfo.GPSLongitudeRef;

      const latLon = dms2dec(lat, latRef, lon, lonRef);
      latitude = latLon[0];
      longitude = latLon[1];
      location = new MapLocation({ latitude, longitude });
    } catch (e) {
      console.debug(`Error extracting GPS from file; ${e}`);
    }

    return location;
  };

  sendFile = async () => {
    this.props.handleUploadClick({
      location: this.state.imgLocation,
      imgSrc: this.state.imgSrc,
      fieldsValues: this.state.fieldsValues
    });
  }

  loadImage = () => {
    let imgExif = null;
    let imgIptc = null;
    let imgLocation = null;

    // https://github.com/blueimp/JavaScript-Load-Image#meta-data-parsing
    loadImage.parseMetaData(
      this.props.file,
      (data) => {
        imgExif = data.exif ? data.exif.getAll() : imgExif;
        imgIptc = data.iptc ? data.iptc.getAll() : imgIptc;
      },
      {
        maxMetaDataSize: 262144,
        disableImageHead: false,
      }
    );

    loadImage(
      this.props.file,
      (img) => {
        // let imgFromCamera;
        const imgSrc = img.toDataURL("image/jpeg");

        // Get location from the image first
        imgLocation = this.getLocationFromExifMetadata(imgExif);
        // If undefined, get it from the GPS
        imgLocation = imgLocation ? imgLocation : this.context.geolocation;

        this.setState({
          imgSrc,
          imgLocation,
          anyError: !!this.props.fields[0],
        });

        // Let the user confirm the location
        this.setState({ openGeotag: true });
      },
      {
        canvas: true,
        orientation: true,
        maxWidth: config.MAX_IMAGE_SIZE,
        maxHeight: config.MAX_IMAGE_SIZE,
      }
    );
  };

  retakePhoto = () => {
    gtagEvent("Retake Photo", "Photo");
    this.setState(emptyState);
    this.props.handleRetakeClick();
  };

  handleNext = () => {
    this.setState({ next: true });
  };

  handlePrev = () => {
    this.setState({ next: false });
  };

  componentDidMount() {
    this.loadImage();
  }

  componentDidUpdate(prevProps) {
    // cannot have errors if there are not fields
    if (!this.props.fields[0] && !this.state.next) {
      this.setState({ next: true });
    }

    if (prevProps.file !== this.props.file) {
      this.loadImage();
    }
  }

  handleChangeFields = (anyError, fieldsValues) => {
    this.setState({ anyError, fieldsValues });
  };

  render() {
    const { classes, fields } = this.props;

    const imageVisible = this.state.openGeotag ? "hidden" : "visible";

    return (
      <div className="geovation-photos">
        <PageWrapper
          handlePrev={this.handlePrev}
          handleNext={this.props.fields[0] ? this.handleNext : null}
          enableNext={!!this.state.imgLocation}
          nextClicked={this.state.next}
          error={this.state.anyError || !this.state.enabledUploadButton}
          sendFile={this.sendFile}
          photoPage={true}
          label={config.PAGES.photos.label}
          imgSrc={this.state.imgSrc}
          handleClose={this.props.handleClose}
        >
          {this.state.next && fields[0] ? (
            <div className={classes.fields}>
              <Fields
                handleChange={this.handleChangeFields}
                imgSrc={this.state.imgSrc}
                fields={fields}
                error={this.state.anyError}
              />
            </div>
          ) : (
            <div
              style={{ display: "flex", flexDirection: "column", flex: 1 }}
              className={classes.photo}
            >
              <div className="picture">
                  <img src={this.state.imgSrc} alt={""} style={{ visibility: imageVisible }} />
              </div>

              <Button
                variant="contained"
                color="secondary"
                fullWidth={true}
                onClick={this.retakePhoto}
              >
                Retake
              </Button>
            </div>
          )}

          <GeoTag
            open={this.state.openGeotag}
            imgLocation={this.state.imgLocation}
            handleNext={this.handleNext}
            handleClose={(imgLocation) =>
              this.setState({ imgLocation, openGeotag: false })
            }
          />

        </PageWrapper>
      </div>
    );
  }
}

PhotoPage.propTypes = {
  online: PropTypes.bool.isRequired,
  file: PropTypes.object,
  handleClose: PropTypes.func.isRequired,
  handleRetakeClick: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  online: state.online,
});
export default connect(mapStateToProps)(
  withStyles(styles, { withTheme: true })(PhotoPage)
);
