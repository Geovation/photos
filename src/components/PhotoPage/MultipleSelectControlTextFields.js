import React from 'react';
import SelectControlNumbered from './SelectControlNumbered';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';

class MultipleSelectControlNumbered extends React.Component {

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
    values.push({});

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

  handleChange = index => (value,error,b) => {
    const values = [...this.state.values];
    values[index] = value;

    this.setState({
      values
    });

    console.log();
    let notEmptyValues = values.filter(value => value !== null);
    this.props.handleChange(notEmptyValues,false);
  }

  handleChangeText = index => e => {
    const values = [...this.state.values];
    values[index].brand = e.target.value;

    this.setState({
      values
    });

    this.props.handleChange(values,false);

  }

  render() {
    const props = {...this.props};
    const field = {
      name: 'brand',
      title: 'Brand',
      placeholder: 'Enter the brand of the litter',
    }

    let fieldValue = {
      value : '',
      error: !''.match('.*')
    }
    return (
      <div>
        <div style={{display:'flex',flexDirection:'column',alignItems:'flex-start',margin:15}}>
          <Button onClick={this.handleClickAdd} disabled={this.state.disabled}>
            Add Categories
            <AddIcon/>
          </Button>
          <Button onClick={this.handleClickRemove}>
            Remove Categories
            <RemoveIcon/>
          </Button>
        </div>
        {this.state.components.map((component,index) =>{
          props.handleChange = this.handleChange(index);
          return(
            <div key={index} >
              <SelectControlNumbered {...props}/>


              <div style={{margin:15}}>
                <Typography className='typography1'>
                  {field.title}
                </Typography>

                <TextField
                  type={field.type}
                  required={true}
                  placeholder={field.placeholder}
                  // className='text-field'
                  onChange={this.handleChangeText(index)}
                  error= {fieldValue.error}
                />
              </div>
            </div>
        )})}
      </div>
    );
  }
}

export default MultipleSelectControlNumbered;
