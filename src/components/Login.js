import React from "react";

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
  }

  handleClose = () => {
    this.props.handleClose();
    return true;
  };

  render() {
    const Component = this.props.loginComponent;
    return <Component key={""} {...this.props} />;
  }
}

export default Login;
