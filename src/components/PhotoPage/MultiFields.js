import React from 'react';
import SelectControlSingleValue from './SelectControlSingleValue';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import Button from '@material-ui/core/Button';
import TitleTextField from './TitleTextField';
import _ from "lodash";

class MultiFields extends React.Component {

  textFieldsValue = Object.values(this.props.field.subfields).reduce((a, v) => { a[v.name] = { value: '',  error: !''.match(v.regexValidation)}; return a; },{});

  state = {
    components: [],
    values: [],
    textFieldsValues:[]
  }
  index = 0;
  combinedValue = {};

  handleClickAdd = (e) => {
    const components = [...this.state.components];
    components.push(this.index);

    const values = [...this.state.values];
    values.push(null);

    const textFieldsValues = [...this.state.textFieldsValues];
    textFieldsValues.push(JSON.parse(JSON.stringify(this.textFieldsValue)));

    this.setState({
      components,
      values,
      textFieldsValues
    });

    this.index = this.index + 1;
  }

  handleClickRemove = (e) => {
    this.index = this.index > 0 ? this.index - 1 : 0;

    const components = [...this.state.components];
    components.pop();

    const values = [...this.state.values];
    values.pop();

    const textFieldsValues = [...this.state.textFieldsValues];
    textFieldsValues.pop();

    this.setState({
      components,
      values,
      textFieldsValues
    });
  }

  handleChangeSelect = index => (value,error) => {
    const values = [...this.state.values];
    values[index] = value;

     this.setState({
      values
    });

    let notEmptyValues = values.filter(value => value !== null);
    this.props.handleChange(notEmptyValues,false);
  }

  handleChangeTitleTextField = (index,field) => (value,error) => {

    const textFieldsValues = [...this.state.textFieldsValues];

    textFieldsValues[index][field.name].error = error;
    textFieldsValues[index][field.name].value = value;

    this.setState({
     textFieldsValues
   });

  }

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
          props.handleChangeSelect = this.handleChangeSelect(index);
          return(
            <div key={index} style={{display:'flex',flexDirection:'column',margin:15,width:'calc(100% - 30px)'}}>
              <SelectControlSingleValue {...props}/>
              {Object.values(props.field.subfields).map((subfield,index_subfield) =>{
                return(
                  <subfield.component
                    key={'subcomponent_'+index_subfield}
                    field={subfield}
                    handleChange={this.handleChangeTitleTextField(index,subfield)}
                    fieldValue={this.state.textFieldsValues[index][subfield.name]}
                  />
                )
              })}
            </div>
        )})}
      </div>
    );
  }
}

export default MultiFields;
