import React, { Component } from "react";

import _ from "lodash";
import moment from "moment";
import Chart from 'chart.js/auto';

import { withStyles } from "@material-ui/core/styles";

// import StarsIcon from "@material-ui/icons/Stars";

import PageWrapper from "../../components/PageWrapper";

const styles = (theme) => ({});

class Reports extends Component {
  constructor(props) {
    super(props);
    this.graphRef = React.createRef();
    this.numberBarRef = React.createRef();
    this.numberRef = React.createRef();
  }


  componentDidMount(months, ctx) {
    const { geojson } = this.props;

    if (geojson) {
      const withNumber = _.filter(geojson.features, (f) => f.properties.number);
      const days = {};
      const months = {};
      const years = {};
      const numbers = {};

      // reformat the info
      _.forEach(withNumber, (entry) => {
        const liveDate = entry.properties.moderated;
        const number = Number(entry.properties.number);
        const day = moment(liveDate).startOf("day").toDate();
        const month = moment(liveDate).startOf("month").toDate();
        const year = moment(liveDate).startOf("year").toDate();
        days[day] = days[day] ? days[day] + number : number;
        months[month] = months[month] ? months[month] + number : number;
        years[year] = years[year] ? years[year] + number : number;
        numbers[number] = numbers[number] ? numbers[number] + 1 : 1;
      });

      // draw by month
      drawByMonth(months, this.graphRef.current);
      drawBarByNumber(numbers, this.numberBarRef.current);
      drawByNumber(numbers, this.numberRef.current);
    }

    // local functions
    function drawByMonth(months, ctx) {
      let sortedMonths = _.map(months, (amount, date) => {
        return {
          date: new Date(date),
          amount,
        };
      });
      sortedMonths = _.sortBy(sortedMonths, "date");

      const datasets = [
        {
          label: "# of Pieces",
          data: _.map(sortedMonths, (month) => ({
            t: month.date,
            y: month.amount,
          })),
          borderWidth: 1,
          backgroundColor: _.map(sortedMonths, randomColor),
        },
      ];
      new Chart(ctx, {
        type: "line",
        data: {
          labels: _.map(sortedMonths, (month) =>
            moment(month.date).format("YYYY-MM")
          ),
          datasets,
          options: {
            scales: {
              xAxes: [
                {
                  type: "time",
                  distribution: "linear",
                  time: {
                    unit: "month",
                  },
                },
              ],
            },
          },
        },
      });
    } // drawByMonth

    function drawBarByNumber(numbers, ctx) {
      const data = _.map(numbers, (amount, number) => amount);
      const backgroundColor = _.map(numbers, randomColor);
      const labels = _.map(numbers, (amount, number) => number);
      const datasets = [
        {
          data,
          backgroundColor,
          label: "Numbers",
          borderWidth: 1,
        },
      ];

      new Chart(ctx, {
        type: "bar",
        data: {
          labels,
          datasets,
        },
      });
    } // drawByMonth

    function drawByNumber(numbers, ctx) {
      const data = _.map(numbers, (amount, number) => amount);
      const backgroundColor = _.map(numbers, randomColor);
      const labels = _.map(numbers, (amount, number) => number);
      const datasets = [
        {
          data,
          backgroundColor,
        },
      ];
      new Chart(ctx, {
        type: "pie",
        data: {
          datasets,
          labels,
        },
        options: {},
      });
    }

    function randomColor() {
      const r = Math.floor(Math.random() * 255);
      const g = Math.floor(Math.random() * 255);
      const b = Math.floor(Math.random() * 255);
      return "rgb(" + r + "," + g + "," + b + ")";
    }
  }

  render() {
    const { handleClose } = this.props;

    return (
      <PageWrapper label="Some repports" handleClose={handleClose} hasLogo={false}>
        <canvas ref={this.graphRef} />
        <canvas ref={this.numberBarRef} />
        <canvas ref={this.numberRef} />
      </PageWrapper>
    );
  }
}

export default withStyles(styles)(Reports);
