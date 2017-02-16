// @flow
import React, { Component, PropTypes } from 'react';
import { isEmpty, keys } from 'lodash';
import moment from 'moment';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import Haiku from './Haiku';
import Header from './Header';
import Loader from './Loader';
import Checkbox from './Checkbox';
import CardContainer from './CardContainer';
import TextQuestion from './TextQuestion';
import NumericQuestion from './NumericQuestion';
import GraphicQuestion from './GraphicQuestion';
import ButtonWithSpinner from './ButtonWithSpinner';
import styles from '../styles/Survey.css';


export default class Survey extends Component {
  static defaultProps = {
    surveyContent: {},
    userInput: [],
    anonymous: false,
    justSubmitted: false
  }

  static renderSubmittedView() {
    return (
      <div className={`icon-thumbs-up ${styles.submitted}`}>
        <h2 style={{ fontSize: '24px' }}>Next survey goes up in 3 days...</h2>
        <h2 style={{ fontSize: '21px' }}>We&apos;ll send out a notification :)</h2>
      </div>
    );
  }

  static renderJustSubmittedView() {
    return (
      <ReactCSSTransitionGroup
        transitionName="submittedContent"
        transitionAppear
        transitionAppearTimeout={300}
        transitionEnterTimeout={300}
        transitionLeaveTimeout={300}
      >
        <div key="submittedContent" className={`icon-thumbs-up ${styles.submitted}`}>
          <div className={styles.submittedContent}>
            <h2 style={{ fontSize: '30px' }}>Nicely done!</h2>
            <h2 style={{ fontSize: '24px', transform: 'translateX(100%)' }}>Next survey goes up in 3 days...</h2>
            <h2 style={{ fontSize: '21px', transform: 'translateX(200%)' }}>In the meantime, why not enjoy this haiku?</h2>
            <Haiku />
          </div>
        </div>
      </ReactCSSTransitionGroup>
    );
  }

  componentWillMount() {
    if (isEmpty(this.props.surveyContent)) {
      this.props.fetchSurvey();
    }
  }

  componentWillUnmount() {
    this.props.removeJustSubmitted();
  }

  submit() {
    const surveyKey = keys(this.props.surveyContent)[0];
    const userInput = this.props.userInput;
    const userId = !this.props.anonymous ? this.props.userProfile.uid : null;

    this.props.submitSurvey(surveyKey, userInput, userId);
  }

  prepareSurveyQuestions() {
    const surveyKey = keys(this.props.surveyContent)[0];
    const survey = this.props.surveyContent[surveyKey];
    const questions = survey && survey.questions;
    const components = [];
    const userInput = this.props.userInput;

    questions.forEach((question, index) => {
      if (!question) return;

      /* eslint-disable react/no-array-index-key */
      switch (question.type) {
        case 'numeric':
          components.push(
            <NumericQuestion
              key={index}
              title={question.title}
              value={userInput[index]}
              labelMin={question.labelMin}
              labelMax={question.labelMax}
              surveyPosition={index + 1}
              onClick={(value, position) => this.props.setUserInput(value, position)}
            />);
          break;
        case 'graphic':
          components.push(
            <GraphicQuestion
              key={index}
              title={question.title}
              value={userInput[index]}
              surveyPosition={index + 1}
              onClick={(value, position) => this.props.setUserInput(value, position)}
            />);
          break;
        default: // text
          components.push(
            <TextQuestion
              key={index}
              title={question.title}
              value={userInput[index]}
              classes={styles.surveyTextQuestion}
              surveyPosition={index + 1}
              onBlur={(value, position) => this.props.setUserInput(value, position)}
            />);
      /* eslint-enable react/no-array-index-key */
      }
    });

    return components;
  }

  // render loader, survey, 'submitted' view, or 'just submitted' view
  renderContent(survey: { surveyTitle?: string, start?: string }) {
    if (isEmpty(survey)) return <Loader />;

    if (this.props.justSubmitted) return Survey.renderJustSubmittedView();

    const surveyKey = keys(this.props.surveyContent)[0];
    if (surveyKey === localStorage.getItem('lastSubmittedSurvey')) {
      return Survey.renderSubmittedView();
    }

    const surveyTitle = survey.surveyTitle;
    const startDate = survey.start && moment.unix(survey.start).format('MMM Do YYYY');

    return (
      <CardContainer header={surveyTitle} icon="feedback" startDate={startDate}>
        <div className={styles.surveyFormContainer}>
          {survey && this.prepareSurveyQuestions()}
          <hr />
          <Checkbox
            label="Anonymous"
            id="anonymousCheckbox"
            classes={styles.surveyCheckbox}
            isChecked={this.props.anonymous}
            onClick={() => { this.props.toggleAnonymous(); }}
          />
          <ButtonWithSpinner label="Submit" onClick={() => this.submit()} buttonSpinnerActive={this.props.buttonSpinnerActive} />
        </div>
      </CardContainer>
    );
  }

  render() {
    const surveyKey = keys(this.props.surveyContent)[0];
    const survey = this.props.surveyContent[surveyKey] || {};

    return (
      <section className={styles.survey}>
        <Header activeTab="survey" {...this.props} />
        <div className="tabContainer">
          {this.renderContent(survey)}
        </div>
      </section>
    );
  }
}

Survey.propTypes = {
  anonymous: PropTypes.bool,
  justSubmitted: PropTypes.bool,
  fetchSurvey: PropTypes.func.isRequired,
  submitSurvey: PropTypes.func.isRequired,
  setUserInput: PropTypes.func.isRequired,
  toggleAnonymous: PropTypes.func.isRequired,
  removeJustSubmitted: PropTypes.func.isRequired,
  buttonSpinnerActive: PropTypes.bool.isRequired,
  userProfile: PropTypes.shape({
    uid: PropTypes.string
  }).isRequired,
  userInput: PropTypes.arrayOf(
    PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ])
  ),
  // eslint-disable-next-line react/forbid-prop-types
  surveyContent: PropTypes.object
};
