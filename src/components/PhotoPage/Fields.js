import React, { Component } from 'react';
import config from '../../custom/config';
import './style.scss';

class Fields extends Component {



  // update the field and the error state of a selected field
  handleChangeFields = field => (value) => {
    field.error = !value.match(field.regexValidation);
    field.value = value;
  }


  render() {
    return (
      <div style={{display:'flex',flexDirection:'column',flex:1,height:'100%'}}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-start',
          margin: '15px'
        }}>
          <div className='pictureThumnail'>
           <img src={this.props.imgSrc} alt={""}/>
          </div>
          <div style={{display: 'flex',flexDirection:'column'}}>
          </div>
        </div>
        {Object.values(config.PHOTO_FIELDS).map((field, index) => {

          return(
            <field.component
              key={index}
              field={field}

              handleChange={this.handleChangeFields(field)}
            />




          //   <field.component
          // key={index}
          //
          // placeholder={field.placeholder}
          //
          //
          //
          //
          //
          // titleTextId={titleTextId}
          // handleChange={this.props.handleChange}
          // field={this.props.fields[titleTextId]}
          // error={this.props.errors[titleTextId]}
          // title={field.title}
          // type={field.type}
          // inputProps={field.inputProps}
          //
          // selectId={selectId}
          // data={field.data}
          // noOptionsMessage={field.noOptionsMessage}
          // />
          )
        })}
      </div>
    );
  }
}

export default Fields;
