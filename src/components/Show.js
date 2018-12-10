import React from 'react';

class Show  extends React.Component {
  render() {
    return (
      <div className={this.props.visible ? "visible" : "hidden"}>
        {this.props.children}
      </div>
    )
  }
}

export default Show;
