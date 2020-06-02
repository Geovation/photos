import React, { Component } from "react";

import { withStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import StarsIcon from "@material-ui/icons/Stars";

import { sortArrayByObjectKey } from "utils";

import PageWrapper from "../../components/PageWrapper";
import config from "../../custom/config";

const styles = theme => ({
  th: {
    fontWeight: "bold",
    color: theme.palette.common.white,
    backgroundColor: "rgba(0, 0, 0, 0.54)"
  },
  highlightRow: {
    fontWeight: "bold",
    color: config.THEME.palette.secondary.main
  },
  cell: {
    position: "relative",
    padding: theme.spacing(1),
    fontSize: "inherit"
  },
  truncate: {
    position: "absolute",
    top: theme.spacing(1.5),
    maxWidth: "90%",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis"
  }
});

class Leaderboard extends Component {
  renderTableBody() {
    const { usersLeaderboard, classes, config, user } = this.props;
    const userId = user && user.id;
    sortArrayByObjectKey(
      usersLeaderboard,
      config.LEADERBOARD_FIELD.field
    ).reverse();

    return (
      <TableBody>
        {usersLeaderboard.map((user, index) => {
          const highlightRow = index === 0 || user.uid === userId;

          return (
            <TableRow key={index}>
              <TableCell
                className={classes.cell}
                style={{ textAlign: "center" }}
              >
                {index === 0 ? (
                  <StarsIcon color="secondary" />
                ) : (
                  <span className={`${highlightRow && classes.highlightRow}`}>
                    {index + 1}
                  </span>
                )}
              </TableCell>
              <TableCell
                className={`${highlightRow && classes.highlightRow} ${
                  classes.cell
                }`}
              >
                <div className={classes.truncate}>
                  {user.displayName.split("@")[0]}
                </div>
              </TableCell>
              <TableCell
                className={`${highlightRow && classes.highlightRow} ${
                  classes.cell
                }`}
              >
                {user[config.LEADERBOARD_FIELD.field]}
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    );
  }

  render() {
    const { classes, label, handleClose, config } = this.props;

    return (
      <PageWrapper label={label} handleClose={handleClose} hasLogo={false}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell
                className={`${classes.th} ${classes.cell}`}
                style={{ width: "10%", textAlign: "center" }}
              >
                Rank
              </TableCell>
              <TableCell
                className={`${classes.th} ${classes.cell}`}
                style={{ width: "60%" }}
              >
                User
              </TableCell>
              <TableCell
                className={`${classes.th} ${classes.cell}`}
                style={{ width: "10%" }}
              >
                {[config.LEADERBOARD_FIELD.label]}
              </TableCell>
            </TableRow>
          </TableHead>

          {this.renderTableBody()}
        </Table>
      </PageWrapper>
    );
  }
}

export default withStyles(styles)(Leaderboard);
