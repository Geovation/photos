import React from 'react';
import SelectControlSingleValue from './SelectControlSingleValue';
import RemoveIcon from '@material-ui/icons/RemoveCircleOutline';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({

});

class MultiFields extends React.Component {

  state = {
    fieldValues: [],
  }

  valueError = this.props.field.subfields ? Object.values(this.props.field.subfields).reduce((a, v) => { a[v.name] = { value: '',  error: !''.match(v.regexValidation)}; return a; },{}): false
  selectFieldName = this.props.field.leafKey;

  handleClickAdd = (e) => {

    const fieldValues = [...this.state.fieldValues];
    fieldValues.push(JSON.parse(JSON.stringify(this.valueError)));

    this.setState({
      fieldValues
    });
  }

  handleClickRemove = index => (e) => {
    const length = this.state.fieldValues.length;
    if(index === 0 && length === 1){
      this.setState({
        fieldValues : [JSON.parse(JSON.stringify(this.valueError))]
      });
    }
    else{
      const fieldValues = this.state.fieldValues.filter((fieldValue,loop_index) => loop_index!== index);
      this.setState({
        fieldValues
      });
    }
  }

  handleChangeSelect = index => (value,error) => {
    const fieldValues = [...this.state.fieldValues];
    fieldValues[index][this.selectFieldName] = value;

    this.setState({
       fieldValues
    });

    let values=[];
    let textFieldErrors=false;
    Object.values(this.state.fieldValues).forEach((obj,index) => {
      values.push({});
      Object.entries(obj).forEach(([key,value])=> {
        values[index][key] = value.value;
        if(value.error && fieldValues[index][this.selectFieldName]){
          textFieldErrors=true;
        }
      });
    });

    const res = [];
    for (let i=0; i < fieldValues.length; i++){
      if (fieldValues[i][this.selectFieldName]) {
        res.push({...values[i],...fieldValues[i]});
      }
    }

    this.props.handleChange(res,textFieldErrors);
  }

  handleChangeTitleTextField = (index,field) => (value,error) => {
    const fieldValues = [...this.state.fieldValues];
    fieldValues[index][field.name].error = error;
    fieldValues[index][field.name].value = value;

    this.setState({
      fieldValues
    });

   let values=[];
   let textFieldErrors=false;
   Object.values(fieldValues).forEach((obj,index) => {
     values.push({});
     Object.entries(obj).forEach(([key,value])=> {
       values[index][key] = value.value;
       if(value.error && this.state.fieldValues[index][this.selectFieldName]){
         textFieldErrors=true;
       }
     });
   });

   const res = [];
   for (let i=0; i < fieldValues.length; i++) {
     if (this.state.fieldValues[i][this.selectFieldName]) {
      res.push({...values[i], ...this.state.fieldValues[i]});
     }
   }

   this.props.handleChange(res,textFieldErrors);

  }

  componentDidMount(){
    this.handleClickAdd();
  }

  render() {
    return (
      <div>
        {this.state.fieldValues.map((fieldValue, index) => {
          return(
            <div key={index}>
              <br/>
              <br/>
              <div style={{display:'flex'}}>
                <SelectControlSingleValue single={fieldValue[this.selectFieldName]} handleChangeSelect={this.handleChangeSelect(index)} {...this.props}/>
                <div style={{marginBottom: this.props.theme.spacing.unit * 0.5, display:'flex', alignItems: 'flex-end'}}>
                    <RemoveIcon onClick={this.handleClickRemove(index)} />
                </div>
              </div>
              {this.props.field.subfields && fieldValue && fieldValue[this.selectFieldName] &&
                <div>
                  {Object.values(this.props.field.subfields).map((subfield,index_subfield) =>{
                    return(
                       <div  key={'subcomponent_'+index_subfield}
                          style={{ marginTop: this.props.theme.spacing.unit * 1}}>
                          <subfield.component
                            field={subfield}
                            handleChange={this.handleChangeTitleTextField(index,subfield)}
                            fieldValue={fieldValue[subfield.name]}
                          />
                      </div>
                    )
                  })}
                  {index === this.state.fieldValues.length - 1 &&
                    <div style={{marginTop: this.props.theme.spacing.unit * 1.5}}>
                      <Button fullWidth variant="outlined" onClick={this.handleClickAdd}>
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

export default withStyles(styles, { withTheme: true })(MultiFields);
