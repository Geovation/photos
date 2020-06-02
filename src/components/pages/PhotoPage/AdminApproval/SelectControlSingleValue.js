// https://material-ui.com/demos/autocomplete/#react-select

/* eslint-disable react/prop-types, react/jsx-handler-names */

import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import Select from "react-select";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import NoSsr from "@material-ui/core/NoSsr";
import TextField from "@material-ui/core/TextField";
import Paper from "@material-ui/core/Paper";
import Chip from "@material-ui/core/Chip";
import MenuItem from "@material-ui/core/MenuItem";
import CancelIcon from "@material-ui/icons/Cancel";
import { emphasize } from "@material-ui/core/styles/colorManipulator";
import _ from "lodash";
import { getValueFromTree } from "../../../../utils";

const styles = theme => ({
  root: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    justifyContent: "flex-end"
  },
  input: {
    display: "flex",
    padding: 0
  },
  valueContainer: {
    display: "flex",
    flexWrap: "wrap",
    flex: 1,
    alignItems: "center",
    overflow: "hidden"
  },
  chip: {
    margin: `${theme.spacing(1 / 2)}px ${theme.spacing(1 / 4)}px`
  },
  chipFocused: {
    backgroundColor: emphasize(
      theme.palette.type === "light"
        ? theme.palette.grey[300]
        : theme.palette.grey[700],
      0.08
    )
  },
  noOptionsMessage: {
    padding: `${theme.spacing(1)}px ${theme.spacing(2)}px`
  },
  singleValue: {
    fontSize: 16
  },
  placeholder: {
    position: "absolute",
    left: 2,
    fontSize: 16
  },
  paper: {
    position: "absolute",
    zIndex: 1,
    marginTop: theme.spacing(1),
    left: 0,
    right: 0
  },
  divider: {
    height: theme.spacing(2)
  },
  cssUnderline: {
    "&:after": {
      borderBottomColor: theme.palette.secondary.main
    }
  }
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
        className: props.selectProps.classes.cssUnderline,
        inputComponent,
        inputProps: {
          className: props.selectProps.classes.input,
          inputRef: props.innerRef,
          children: props.children,
          ...props.innerProps
        }
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
        fontWeight: props.isSelected ? 500 : 400
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
    <Typography
      className={props.selectProps.classes.singleValue}
      {...props.innerProps}
    >
      {props.children}
    </Typography>
  );
}

function ValueContainer(props) {
  return (
    <div className={props.selectProps.classes.valueContainer}>
      {props.children}
    </div>
  );
}

function MultiValue(props) {
  return (
    <Chip
      tabIndex={-1}
      label={props.children}
      className={classNames(props.selectProps.classes.chip, {
        [props.selectProps.classes.chipFocused]: props.isFocused
      })}
      onDelete={props.removeProps.onClick}
      deleteIcon={<CancelIcon {...props.removeProps} />}
    />
  );
}

function Menu(props) {
  return (
    <Paper
      elevation={2}
      square
      className={props.selectProps.classes.paper}
      {...props.innerProps}
    >
      {props.children}
    </Paper>
  );
}

function DropdownIndicator(props) {
  return null;
}

function IndicatorSeparator(props) {
  return null;
}

function ClearIndicator(props) {
  return null;
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
  DropdownIndicator,
  IndicatorSeparator,
  ClearIndicator
};

class SelectControlSingleValue extends React.Component {
  state = {
    single: null,
    options: []
  };

  handleChange = name => value => {
    this.setState({
      [name]: value
    });

    let selectedValue;
    if (value) {
      selectedValue = value.key;
    } else {
      selectedValue = null;
    }

    this.props.handleChangeSelect(selectedValue);
  };

  getItems = tree => {
    let items = [];

    function getNodesInLowestHierarchy(tree) {
      Object.entries(tree).forEach(([key, value]) => {
        if (!value.children) {
          items.push({ label: value.label, key: key });
        } else {
          getNodesInLowestHierarchy(value.children);
        }
      });
    }

    getNodesInLowestHierarchy(tree);
    return items;
  };

  initializeOptions = data => {
    const unsortedOptions = Object.entries(data).map(([key, value]) => ({
      label: value.label,
      key: value.key
    }));

    const options = _.sortBy(unsortedOptions, "label");

    this.options = options;
    this.setState({ options });
  };

  componentDidMount() {
    this.items = this.getItems(this.props.field.data);
    this.initializeOptions(this.items);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.single !== this.props.single) {
      const label = getValueFromTree(this.props.field.data, this.props.single);
      this.setState({
        single: label ? { label: label, key: this.props.single } : null
      });
    }
  }

  render() {
    // TODO add propTypes
    const { classes, theme, field } = this.props;

    const selectStyles = {
      input: base => ({
        ...base,
        color: theme.palette.text.primary,
        "& input": {
          font: "inherit"
        }
      })
    };
    return (
      <div className={classes.root}>
        <NoSsr>
          <Select
            classes={classes}
            styles={selectStyles}
            components={components}
            value={this.state.single}
            onChange={this.handleChange("single")}
            getOptionValue={option => option["label"]}
            placeholder={field.placeholder}
            noOptionsMessage={() => field.noOptionsMessage}
            options={this.state.options}
            textFieldProps={{
              label: "Category",
              InputLabelProps: {
                shrink: true,
                style: { color: "#000" }
              }
            }}
            isClearable
          />
        </NoSsr>
      </div>
    );
  }
}

// TODO: describe the props.
SelectControlSingleValue.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired
};

export default withStyles(styles, { withTheme: true })(
  SelectControlSingleValue
);
