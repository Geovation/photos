import React, { Component } from "react";

import _ from "lodash";
import moment from "moment";
import Chart from "chart.js";

import { withStyles } from "@material-ui/core/styles";

// import StarsIcon from "@material-ui/icons/Stars";

import PageWrapper from "../../components/PageWrapper";

const styles = (theme) => ({});

class Reports extends Component {
  constructor(props) {
    super(props);
    this.graphRef = React.createRef();
    this.brandsRef = React.createRef();
    this.categoryRef = React.createRef();
  }

  findCategoryLabel(branch, key) {
    if (!branch) {
      return null;
    }
    if (branch[key]) {
      return branch[key].label;
    } else {
      let label = null;
      _.find(branch, (child) => {
        label = this.findCategoryLabel(child.children, key);
        return !!label;
      });

      return label;
    }
  }

  componentDidMount(months, ctx) {
    const { geojson, config } = this.props;

    if (geojson) {
      const withCategories = _.filter(
        geojson.features,
        (f) => f.properties.categories
      );

      const brands = {};
      const categories = {};
      const days = {};
      const months = {};
      const years = {};

      // reformat the info
      _.forEach(withCategories, (entry) => {
        const liveDate = entry.properties.moderated;
        // const datePeriod = moment(liveDate).format("YYYYMMDD");
        const day = moment(liveDate).startOf("day").toDate();
        const month = moment(liveDate).startOf("month").toDate();
        const year = moment(liveDate).startOf("year").toDate();

        _.forEach(entry.properties.categories, (category) => {
          const number = Number(category.number);

          brands[category.brand] = brands[category.brand]
            ? brands[category.brand] + number
            : number;

          const catLabel = this.findCategoryLabel(
            config.PHOTO_FIELDS.categories.data,
            category.leafkey
          );
          categories[catLabel] = categories[catLabel]
            ? categories[catLabel] + number
            : number;

          days[day] = days[day] ? days[day] + number : number;
          months[month] = months[month] ? months[month] + number : number;
          years[year] = years[year] ? years[year] + number : number;
        });
      });

      // draw by month
      drawByMonth(months, this.graphRef.current);
      drawByBrand(brands, this.brandsRef.current);
      drawByCategory(categories, this.categoryRef.current);
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

      new Chart(ctx, {
        type: "line",
        data: {
          labels: _.map(sortedMonths, (month) =>
            moment(month.date).format("YYYY-MM")
          ),
          datasets: [
            {
              label: "# of Pieces",
              // data: _.map(sortedMonths, (month) => month.amount),
              data: _.map(sortedMonths, (month) => ({
                t: month.date,
                y: month.amount,
              })),
              borderWidth: 1,
              backgroundColor: _.map(sortedMonths, randomColor),
            },
          ],
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

    function drawByBrand(brands, ctx) {
      let sortedBrands = _.map(brands, (amount, brand) => {
        return {
          brand,
          amount,
        };
      });
      sortedBrands = _.sortBy(sortedBrands, "amount");
      sortedBrands = _.reverse(sortedBrands);
      const allTheRest = _.sumBy(
        _.slice(sortedBrands, 10, sortedBrands.length),
        "amount"
      );
      sortedBrands = _.slice(sortedBrands, 0, 10);
      sortedBrands.push({ brand: "the others", amount: allTheRest });

      new Chart(ctx, {
        type: "bar",
        data: {
          labels: _.map(sortedBrands, (brand) => brand.brand),
          datasets: [
            {
              label: "Worst brands",
              data: _.map(sortedBrands, (brand) => brand.amount),
              borderWidth: 1,
              backgroundColor: _.map(sortedBrands, randomColor),
            },
          ],
        },
      });
    } // drawByMonth

    function drawByCategory(categories, ctx) {
      let sortedCategpries = _.map(categories, (amount, category) => {
        return {
          category,
          amount,
        };
      });
      sortedCategpries = _.sortBy(sortedCategpries, "amount");
      sortedCategpries = _.reverse(sortedCategpries);
      const allTheRest = _.sumBy(
        _.slice(sortedCategpries, 8, sortedCategpries.length),
        "amount"
      );
      sortedCategpries = _.slice(sortedCategpries, 0, 8);
      sortedCategpries.push({ category: "the others", amount: allTheRest });

      new Chart(ctx, {
        type: "pie",
        data: {
          datasets: [
            {
              data: _.map(sortedCategpries, (category) => category.amount),
              backgroundColor: _.map(sortedCategpries, randomColor),
            },
          ],
          labels: _.map(sortedCategpries, (category) => category.category),
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
    const { classes, label, handleClose } = this.props;

    return (
      <PageWrapper label={label} handleClose={handleClose} hasLogo={false}>
        <canvas ref={this.graphRef} />
        <canvas ref={this.brandsRef} />
        <canvas ref={this.categoryRef} />
      </PageWrapper>
    );
  }
}

export default withStyles(styles)(Reports);
