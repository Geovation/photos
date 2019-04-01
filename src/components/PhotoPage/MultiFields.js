import React from 'react';
import SelectControlSingleValue from './SelectControlSingleValue';
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
  selectFieldName = this.props.field.leafKey;

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

  handleClickRemove = index => (e) => {
    this.index = this.index > 0 ? this.index - 1 : 0;

    let components = [...this.state.components];
    components.splice(index, 1)

    for (let i=0 ; i< components.length ; i++) {
      components[i] = i;
    }

    const selectValues = [...this.state.selectValues];
    selectValues.splice(index, 1)

    const textFieldsValues = [...this.state.textFieldsValues];
    textFieldsValues.splice(index, 1)

    this.setState({
      components,
      selectValues,
      textFieldsValues
    });
  }

  handleChangeSelect = index => (value,error) => {
    const selectValues = [...this.state.selectValues];
    selectValues[index][this.selectFieldName] = value;

     this.setState({
      selectValues
    });

    let values=[];
    let textFieldErrors=false;
    Object.values(this.state.textFieldsValues).forEach((obj,index) => {
      values.push({});
      Object.entries(obj).forEach(([key,value])=> {
        values[index][key] = value.value;
        if(value.error && selectValues[index][this.selectFieldName]){
          textFieldErrors=true;
        }
      });
    });

    const res = [];
    for (let i=0; i < selectValues.length; i++){
      if (selectValues[i][this.selectFieldName]) {
        res.push({...values[i],...selectValues[i]});
      }
    }

    this.props.handleChange(res,textFieldErrors);

  }

  handleChangeTitleTextField = (index,field) => (value,error) => {
    const textFieldsValues = [...this.state.textFieldsValues];

    textFieldsValues[index][field.name].error = error;
    textFieldsValues[index][field.name].value = value;

    this.setState({
     textFieldsValues
   });

   let values=[];
   let textFieldErrors=false;
   Object.values(textFieldsValues).forEach((obj,index) => {
     values.push({});
     Object.entries(obj).forEach(([key,value])=> {
       values[index][key] = value.value;
       if(value.error && this.state.selectValues[index][this.selectFieldName]){
         textFieldErrors=true;
       }
     });
   });

   const res = [];
   for (let i=0; i < textFieldsValues.length; i++) {
     if (this.state.selectValues[i][this.selectFieldName]) {
      res.push({...values[i], ...this.state.selectValues[i]});
     }
   }

   this.props.handleChange(res,textFieldErrors);

  }

  componentDidMount(){
    this.handleClickAdd();
  }

  render() {
    const props = {...this.props};
    return (
      <div>
        {this.state.components.map(index =>{
          props.handleChangeSelect = this.handleChangeSelect(index);
          return(
            <div key={index} style={{display:'flex',flexDirection:'column',margin:15,width:'calc(100% - 30px)'}}>
              <div style={{display:'flex'}}>
                <SelectControlSingleValue {...props}/>
                <div style={{margin:5,marginBottom:0,visibility:index !== 0 ? 'visible' :'hidden'}}>
                  <Button size={'small'} variant="outlined" onClick={this.handleClickRemove(index)}>
                    <RemoveIcon/>
                  </Button>
                </div>
              </div>
              {props.field.subfields &&
                <div>
                  {Object.values(props.field.subfields).map((subfield,index_subfield) =>{
                    return(
                      this.state.selectValues[index] && this.state.selectValues[index][this.selectFieldName]
                      ? <subfield.component
                          key={'subcomponent_'+index_subfield}
                          field={subfield}
                          handleChange={this.handleChangeTitleTextField(index,subfield)}
                          fieldValue={this.state.textFieldsValues[index][subfield.name]}
                        />
                      :null
                    )
                  })}
                  {this.state.selectValues[index] && this.state.selectValues[index][this.selectFieldName] &&
                    index === this.index - 1 &&
                    <div style={{display:'flex',flexDirection:'column',alignItems:'flex-start',margin:15}}>
                      <Button size={'small'} variant="outlined" onClick={this.handleClickAdd}>
                        add another category
                      </Button>
                    </div>
                  }
                </div>
              }
            </div>
        )})}
      </div>
    );
  }
}

export default MultiFields;
