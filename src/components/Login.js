import React from 'react';

class Login extends React.Component {

  /**
   *
   * @param props are {open, handleClose, loginName  }
   */

  render() {
    const Component = this.props.loginComponent;
    return (
      <Component key={""} {...this.props}/>
    );
  }
}

export default Login;
