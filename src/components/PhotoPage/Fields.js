import React, { Component } from 'react';
import config from '../../custom/config';
import './style.scss';

class Fields extends Component {

  // getValuesSelected = (photoCategory,id) => {
  //   const photoCategories = this.state.photoCategories.map((category,index) =>
  //     id === index ? photoCategory : category
  //   );
  //   this.setState({ photoCategories });
  // }

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
              key={index}

              placeholder={field.placeholder}





              handleChange={this.props.handleChange}
              field={this.props.fields[titleTextId]}
              error={this.props.errors[titleTextId]}
              title={field.title}
              type={field.type}
              inputProps={field.inputProps}

              selectId={selectId}
              data={field.data}
              noOptionsMessage={field.noOptionsMessage}
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
