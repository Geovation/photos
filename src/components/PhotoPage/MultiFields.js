import React from 'react';
import SelectControlSingleValue from './SelectControlSingleValue';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import Button from '@material-ui/core/Button';

class MultiFields extends React.Component {


  state = {
    components: [],
    selectValues: [],
    textFieldsValues:[]
  }

  index = 0;
  combinedValue = {};
  valueError = this.props.field.subfields ? Object.values(this.props.field.subfields).reduce((a, v) => { a[v.name] = { value: '',  error: !''.match(v.regexValidation)}; return a; },{}): false

  handleClickAdd = (e) => {
    const components = [...this.state.components];
    components.push(this.index);

    const selectValues = [...this.state.selectValues];
    selectValues.push({});

    const textFieldsValues = [...this.state.textFieldsValues];
    textFieldsValues.push(JSON.parse(JSON.stringify(this.valueError)));

    this.setState({
      components,
      selectValues,
      textFieldsValues
    });

    this.index = this.index + 1;
  }

  handleClickRemove = (e) => {
    this.index = this.index > 0 ? this.index - 1 : 0;

    const components = [...this.state.components];
    components.pop();

    const selectValues = [...this.state.selectValues];
    selectValues.pop();

    const textFieldsValues = [...this.state.textFieldsValues];
    textFieldsValues.pop();

    this.setState({
      components,
      selectValues,
      textFieldsValues
    });
  }

  handleChangeSelect = index => (value,error) => {
    const selectValues = [...this.state.selectValues];
    selectValues[index].value = value;

     this.setState({
      selectValues
    });

    let values=[];
    Object.values(this.state.textFieldsValues).forEach((obj,index) => {
      values.push({});
      Object.entries(obj).forEach(([key,value])=> {
        values[index][key] = value.value;
      });
    });

    const res = [];
    for (let i=0;i<selectValues.length;i++){
      res.push({...values[i],...selectValues[i]});
    }

    this.props.handleChange(res,false);
  }

  handleChangeTitleTextField = (index,field) => (value,error) => {
    const textFieldsValues = [...this.state.textFieldsValues];

    textFieldsValues[index][field.name].error = error;
    textFieldsValues[index][field.name].value = value;

    this.setState({
     textFieldsValues
   });

   let values=[];
   Object.values(textFieldsValues).forEach((obj,index) => {
     values.push({});
     Object.entries(obj).forEach(([key,value])=> {
       values[index][key] = value.value;
     });
   });

   const res = [];
   for (let i=0; i < textFieldsValues.length; i++) {
     res.push({...values[i],...this.state.selectValues[i]})
   }

   console.log(res);
   this.props.handleChange(res,false);

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
              {props.field.subfields && Object.values(props.field.subfields).map((subfield,index_subfield) =>{
                return(
                  this.state.selectValues[index].value
                  ? <subfield.component
                      key={'subcomponent_'+index_subfield}
                      field={subfield}
                      handleChange={this.handleChangeTitleTextField(index,subfield)}
                      fieldValue={this.state.textFieldsValues[index][subfield.name]}
                    />
                  :null
                )
              })}
            </div>
        )})}
      </div>
    );
  }
}

export default MultiFields;
