import React from 'react';
import SelectControlSingleValue from './SelectControlSingleValue';
import RemoveIcon from '@material-ui/icons/RemoveCircleOutline';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import { getValueAndAncestorsFromTree } from '../../utils';

const styles = theme => ({

});

class MultiFields extends React.Component {

  state = {
    fieldValues: [],
  }

  textFieldValueError = this.props.field.subfields ? Object.values(this.props.field.subfields).reduce((a, v) => { a[v.name] = { value: '',  error: !''.match(v.regexValidation)}; return a; },{}): false;

  selectValue = {
    leafkey : {
      value : ''
    }
  }

  handleClickAdd = (e) => {

    const fieldValues = [...this.state.fieldValues];
    fieldValues.push({...JSON.parse(JSON.stringify(this.textFieldValueError)),...JSON.parse(JSON.stringify(this.selectValue))});

    this.setState({
      fieldValues
    });
  }

  handleClickRemove = index => (e) => {
    const length = this.state.fieldValues.length;
    if(index === 0 && length === 1){
      this.setState({
        fieldValues : [{...JSON.parse(JSON.stringify(this.textFieldValueError)),...JSON.parse(JSON.stringify(this.selectValue))}]
      });
      this.props.handleChange(null,false);
    }
    else{
      const fieldValues = this.state.fieldValues.filter((fieldValue,loop_index) => loop_index!== index);
      this.setState({
        fieldValues
      });
      this.checkErrorAndPropagateResToParent(fieldValues);
    }
  }

  checkErrorAndPropagateResToParent = (values) => {
    let res=[];
    let textFieldErrors=false;
    Object.values(values).forEach((obj,index) => {
      res.push({});
      Object.entries(obj).forEach(([key,value])=> {
        res[index][key] = value.value;
        if(value.error && values[index].leafkey.value){
          textFieldErrors=true;
        }
      });
    });
    this.props.handleChange(res,textFieldErrors);
  }

  handleChangeSelect = index => (value,error) => {
    const fieldValues = [...this.state.fieldValues];
    fieldValues[index].leafkey.value = value;

    this.setState({
       fieldValues
    });
    this.checkErrorAndPropagateResToParent(fieldValues);
  }

  handleChangeTitleTextField = (index,field) => (value,error) => {
    const fieldValues = [...this.state.fieldValues];
    fieldValues[index][field.name].error = error;
    fieldValues[index][field.name].value = value;

    this.setState({
      fieldValues
    });
    this.checkErrorAndPropagateResToParent(fieldValues);
  }

  static toFormattedString = (s,data) => {
    const categories = typeof(s) === 'string' ? JSON.parse(s) : s;
    let categoryId;
    return categories && categories.map((category,index) => (
      <div key={index}>
        {index === 0 && <br/>}
        <div>Category {index}</div>
          {Object.entries(category).map(([key,value]) => {
            let formattedValue = value;
            let formattedKey = key;
            if(key === 'leafkey'){
              formattedValue = getValueAndAncestorsFromTree(data,value).toString();
              categoryId = value;
              formattedKey = 'category';
            }
            return(
              <div style={{display:'flex'}} key={key}>
                <div style={{fontWeight:100}}>{formattedKey}</div> : <div>{formattedValue}</div>
              </div>
            )}
          )}
          <div style={{display:'flex'}}>
            <div style={{fontWeight:100}}>categoryId</div> : <div>{categoryId}</div>
          </div>
          <br/>
        </div>
      )
    )
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
                <SelectControlSingleValue single={fieldValue.leafkey.value} handleChangeSelect={this.handleChangeSelect(index)} {...this.props}/>
                <div style={{marginBottom: this.props.theme.spacing(0.5), display:'flex', alignItems: 'flex-end'}}>
                    <RemoveIcon onClick={this.handleClickRemove(index)} />
                </div>
              </div>
              {this.props.field.subfields && fieldValue && fieldValue.leafkey.value &&
                <div>
                  {Object.values(this.props.field.subfields).map((subfield,index_subfield) =>{
                    return(
                       <div  key={'subcomponent_'+index_subfield}
                          style={{ marginTop: this.props.theme.spacing(1)}}>
                          <subfield.component
                            field={subfield}
                            handleChange={this.handleChangeTitleTextField(index,subfield)}
                            fieldValue={fieldValue[subfield.name]}
                          />
                      </div>
                    )
                  })}
                  {index === this.state.fieldValues.length - 1 &&
                    <div style={{marginTop: this.props.theme.spacing(1.5)}}>
                      <Button disabled={this.props.error} fullWidth variant="outlined" onClick={this.handleClickAdd}>
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

export default {
  MultiFieldsWithStyles :withStyles(styles, { withTheme: true })(MultiFields),
  MultiFieldsOriginal: MultiFields
}
