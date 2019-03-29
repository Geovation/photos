import React from 'react';
import SelectControlSingleValue from './SelectControlSingleValue';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import Button from '@material-ui/core/Button';
import TitleTextField from './TitleTextField';
import _ from "lodash";

class MultiFields extends React.Component {

  textFieldsValues = Object.values(this.props.field.subcomponents).reduce((a, v) => { a[v.name] = { value: '',  error: !''.match(v.regexValidation)}; return a; },{});

  state = {
    components: [],
    values: [],
  }
  index = 0;
  combinedValue = {};


  handleClickAdd = (e) => {
    const components = [...this.state.components];
    components.push(this.index);

    const values = [...this.state.values];
    values.push(null);

    this.setState({
      components,
      values
    });

    this.index = this.index + 1;
  }

  handleClickRemove = (e) => {
    this.index = this.index > 0 ? this.index - 1 : 0;

    const components = [...this.state.components];
    components.pop();

    const values = [...this.state.values];
    values.pop();

    this.setState({
      components,
      values
    });
  }

  // handleChange = (field,index) => (value,error) => {
    // this.textFieldsValues[field.name].error = error
    // this.textFieldsValues[field.name].value = value;
    // console.log('wtf',index,value,error,b);
    // const values = [...this.state.values];
    // values[index].value = value;
    // values[index].error = error;

    // this.setState({
      // values,
    // });

    //
    // let notEmptyValues = values.filter(value => value !== null);
    // this.props.handleChange(notEmptyValues,false);
  // }

  // handleChangeComponent = field => (value,error) => {
    // this.textFieldsValues[field.name].error = error
    // this.textFieldsValues[field.name].value = value;
    // //
    // const errors = _.reduce(this.textFieldsValues, (a, v) => a || v.error, false);
    // // this.props.handleChange(errors, this.fieldsValues);
    //
    // this.setState({textFieldsValues:this.textFieldsValues})
    // console.log(value,error,this.textFieldsValues);

  // }

  render() {
    const props = {...this.props};
    return (
      <div>
        <Button onClick={this.handleClickAdd} disabled={this.state.disabled}>
          <AddIcon/>
        </Button>
        <Button onClick={this.handleClickRemove}>
          <RemoveIcon/>
        </Button>
        {this.state.components.map(index =>{
          props.handleChange = this.handleChange(index);
          return(
            <div key={index} style={{display:'flex',flexDirection:'column',margin:15,width:'calc(100% - 30px)'}}>
              <SelectControlSingleValue {...props}/>
              {Object.values(props.field.subcomponents).map((subcomponent,index_subcomponent) =>{
                return(
                  {/*
                  <subcomponent.component
                    key={'subcomponent_'+index_subcomponent}
                    // field={subcomponent}
                    // handleChange={this.handleChange(subcomponent,index)}
                    // fieldValue={this.state.textFieldsValues[subcomponent.name]}
                  />
                  */}
              )})}
            </div>
        )})}
      </div>
    );
  }
}

export default MultiFields;
