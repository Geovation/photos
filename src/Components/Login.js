import React from 'react';

class Login extends React.Component {

  /**
   *
   * @param props are {open, handleClose, loginName  }
   */
  constructor(props) {
    super(props);

    this.state = {
      open: false
    };

    this.Component = require("../services/" + this.props.loginName + ".js").default;
  }

  handleClose = () => {
    this.props.handleClose();
    return true;
  };

  render() {
    const Component = this.Component;
    return (
      <Component key={this.props.loginName} {...this.props}/>
    );
  }
}

export default Login;
