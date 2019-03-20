import React, { Component } from 'react';
import config from '../../custom/config';
import './style.scss';

class Fields extends Component {
  render() {
    let titleTextId = -1;
    let selectId = -1;
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
        {Object.values(config.PHOTO_FIELDS).map((field,index) => {
          if (field.componentType === 'TitleTextField'){
            titleTextId = titleTextId + 1;
          }
          else if (field.componentType === 'SelectControl') {
            selectId = selectId + 1;
          }
          return(
            <field.component
              titleTextId={titleTextId}
              selectId={selectId}

              key={index}
              handleChange={this.props.handleChange}
              getPhotoTypes={this.props.getPhotoTypes}
              field={this.props.fields[titleTextId]}
              error={this.props.errors[titleTextId]}

              type={field.type}
              title={field.title}
              placeholder={field.placeholder}
              inputProps={field.inputProps}
              data={field.data}
            />
          )
        })}
      </div>
    );
  }
}

export default Fields;
