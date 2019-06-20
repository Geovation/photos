import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';

import '../ModeratorPage.scss';
import FeedbackReportsPage from "./FeedbackReportsPage";
import FeedbackDetailsPage from "./FeedbackDetailsPage";

class FeedbackReportsSubrouter extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isShowAll: false
    };
  }

  setShowAll(isShowAll) {
    this.setState({ isShowAll});
  }

  render() {
    return (
      <Switch>

        <Route exact path={this.props.config.PAGES.feedbackReports.path} render={(props) =>
          <FeedbackReportsPage {...this.props} {...props}
                               isShowAll = {this.state.isShowAll}
                               setShowAll = {isShowAll =>  this.setShowAll(isShowAll)} />}
        />

        <Route path={`${this.props.config.PAGES.feedbackReports.path}/:id`} render={(props) =>
          <FeedbackDetailsPage {...this.props} {...props}/>}
        />

      </Switch>
    );
  }
}

export default FeedbackReportsSubrouter;
