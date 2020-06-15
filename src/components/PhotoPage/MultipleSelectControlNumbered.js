import React from 'react';
import SelectControlNumbered from './SelectControlNumbered';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import Button from '@material-ui/core/Button';

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
    values.push(null);

    this.setState({
      components,
      values
    });

    this.index = this.index + 1;

    console.log(components);
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

    let notEmptyValues = values.filter(value => value !== null);
    this.props.handleChange(notEmptyValues,false);
  }

  render() {
    const props = {...this.props};
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
            <SelectControlNumbered key={index} {...props}/>
        )})}
      </div>
    );
  }
}

export default MultipleSelectControlNumbered;
