// https://material-ui.com/demos/autocomplete/#react-select

/* eslint-disable react/prop-types, react/jsx-handler-names */

import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Select from 'react-select';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import NoSsr from '@material-ui/core/NoSsr';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import Chip from '@material-ui/core/Chip';
import MenuItem from '@material-ui/core/MenuItem';
import CancelIcon from '@material-ui/icons/Cancel';
import { emphasize } from '@material-ui/core/styles/colorManipulator';

const styles = theme => ({
  root: {
    // flexGrow: 1,
    margin: 15,
    textAlign: 'center',
  },
  input: {
    display: 'flex',
    padding: 0,
  },
  valueContainer: {
    display: 'flex',
    // flexWrap: 'wrap', //default
    flex: 1,
    alignItems: 'center',
    // overflow: 'hidden',  // default
    //
    overflow:'auto'
  },
  chip: {
    margin: `${theme.spacing.unit / 2}px ${theme.spacing.unit / 4}px`,
  },
  chipFocused: {
    backgroundColor: emphasize(
      theme.palette.type === 'light' ? theme.palette.grey[300] : theme.palette.grey[700],
      0.08,
    ),
  },
  noOptionsMessage: {
    padding: `${theme.spacing.unit}px ${theme.spacing.unit * 2}px`,
  },
  singleValue: {
    fontSize: 16,
  },
  placeholder: {
    position: 'absolute',
    left: 2,
    fontSize: 16,
  },
  paper: {
    position: 'absolute',
    zIndex: 1,
    marginTop: theme.spacing.unit,
    left: 0,
    right: 0,
  },
  divider: {
    height: theme.spacing.unit * 2,
  },
  cssUnderline: {
    '&:after': {
      borderBottomColor: theme.palette.secondary.main,
    },
  },
});

function NoOptionsMessage(props) {
  return (
    <Typography
      color="textSecondary"
      className={props.selectProps.classes.noOptionsMessage}
      {...props.innerProps}
    >
      {props.children}
    </Typography>
  );
}

function inputComponent({ inputRef, ...props }) {
  return <div ref={inputRef} {...props} />;
}

function Control(props) {
  return (
    <TextField
      fullWidth
      InputProps={{
        inputComponent,
        inputProps: {
          className: props.selectProps.classes.input,
          inputRef: props.innerRef,
          children: props.children,
          ...props.innerProps,
        },
      }}
      {...props.selectProps.textFieldProps}
    />
  );
}

function Option(props) {
  return (
    <MenuItem
      buttonRef={props.innerRef}
      selected={props.isFocused}
      component="div"
      style={{
        fontWeight: props.isSelected ? 500 : 400,

      }}
      {...props.innerProps}
    >
      {props.children}
    </MenuItem>
  );
}

function Placeholder(props) {
  return (
    <Typography
      color="textSecondary"
      className={props.selectProps.classes.placeholder}
      {...props.innerProps}
    >
      {props.children}
    </Typography>
  );
}

function SingleValue(props) {
  return (
    <Typography className={props.selectProps.classes.singleValue} {...props.innerProps}>
      {props.children}
    </Typography>
  );
}

function ValueContainer(props) {
  return <div id='valueContainer' className={props.selectProps.classes.valueContainer}>{props.children}</div>;
}

function MultiValue(props) {
  return (
    <Chip
      tabIndex={-1}
      label={props.children}
      className={classNames(props.selectProps.classes.chip, {
        [props.selectProps.classes.chipFocused]: props.isFocused,
      })}
      onDelete={props.removeProps.onClick}
      deleteIcon={<CancelIcon {...props.removeProps} />}
    />
  );
}

function Menu(props) {
  return (
    <Paper square className={props.selectProps.classes.paper} {...props.innerProps}>
      {props.children}
    </Paper>
  );
}

const components = {
  Control,
  Menu,
  MultiValue,
  NoOptionsMessage,
  Option,
  Placeholder,
  SingleValue,
  ValueContainer,
};

class SelectControl extends React.Component {
  state = {
    single: null,
    multi: null,
    options: [],
    menuIsOpen: false,
  };

  control = true;
  options = [];
  flatTree = [];
  input = '';

  handleInputChange = (input) => {

    let options;
    if (input===''){
      options = this.options;
    }
    else{
      options = this.flatTree;
    }
    this.setState({ options })
    this.input = input;
  }

  handleChange = name => values => {
    if (values.length!==0) {
      let current_data = {...this.props.data};
      const findvaluePath = this.findOptions(this.props.data,values[values.length - 1].key);
      // console.log('findvaluePath','values',findvaluePath,values);

      this.setState({ [name]: findvaluePath });
      this.props.getPhotoTypes(findvaluePath,this.props.selectId);

      Object.values(findvaluePath).forEach(value => {
        current_data = current_data[value.key].children;
        if (!current_data) {
          current_data = {}
        }
      });
      const new_values = this.changeOptions(current_data);
      this.options = new_values;
      // console.log('current_data','new_values',current_data,new_values);
      this.controlMenuVisibility(current_data,new_values);
    }
    else {
      this.props.getPhotoTypes([],this.props.selectId);
      this.setState({ [name]: [] });
      this.initializeOptions(this.props.data)
      this.controlMenuVisibility(this.props.data,[]);
    }
  };

  controlMenuVisibility = (data,values) => {
    if (values.length === 0) {
      this.control = true;
    }
    else {
      this.control = false;
    }

    if (Object.entries(data).length === 0) {
      this.setState({ menuIsOpen: false });
    }
    else {
      this.setState({ menuIsOpen: true });
    }
  }

  changeOptions = (data) => {
    let values = [];
    Object.entries(data).forEach(([key,value])=>{
      values.push({ label: value.label, key: key });
    });
    return values;
  }

  findOptions = (tree,key_to_find) => {

    const templist = [];
    let listWithChildren = [];

    function searchTreeData(tree,key_to_find) {
      Object.entries(tree).forEach(([key,value]) => {
        if (key_to_find === key){
          const currentChild = { label:value.label,key:key }
          listWithChildren = [...templist,currentChild];
        }
        if(value.children){
          templist.push({ label:value.label, key:key })
          searchTreeData(value.children,key_to_find);
          templist.pop()
        }

      });
    }
    searchTreeData(tree,key_to_find);
    return listWithChildren;
  }

  getflatTreeData = (tree) => {
    let flatTree = [];

    function getChildren(tree){
      Object.entries(tree).forEach( ([key,value]) => {
        if (!value.children) {
          flatTree.push({ label: value.label, key: key });
        }
        else {
          getChildren(value.children);
        }
      });
    }

    getChildren(tree);
    return flatTree;
  }

  initializeOptions = (data) => {
    const options = Object
                  .entries(data)
                  .map(([key,value]) => ({label: value.label, key: key }));
    this.options = options;
    this.setState({ options });
  }

  componentDidMount(){
    this.flatTree = this.getflatTreeData(this.props.data);
    this.initializeOptions(this.props.data);
  }

  render() {
    const { classes, theme } = this.props;

    const selectStyles = {
      input: base => ({
        ...base,
        color: theme.palette.text.primary,
        '& input': {
          font: 'inherit',
        },
      }),
    };
    return (
      <div className={classes.root}>
        <NoSsr>
          <Select
            classes={classes}
            styles={selectStyles}
            components={components}
            value={this.state.multi}
            onChange={this.handleChange('multi')}
            menuPosition='fixed'
            placeholder={this.props.placeholder}
            options={this.state.options}
            isMulti
            getOptionValue={(option) => (option['label'])}

            onInputChange={(e) => this.handleInputChange(e)}
            menuIsOpen={this.state.menuIsOpen}
            onFocus={() => this.setState({ menuIsOpen: true })}
            onBlur={()=> {
              if (this.control) {
                this.setState({ menuIsOpen: false });
              }
            }}
          />
        </NoSsr>
      </div>
    );
  }
}

SelectControl.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(SelectControl);