import React from 'react';
import {withStyles, makeStyles} from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import logo from './bifrost-logo.svg';
import Countdown from 'react-countdown-now';
import Tooltip from '@material-ui/core/Tooltip';
import InfoIcon from '@material-ui/icons/Info';

import './App.css';

const useStyles = makeStyles((theme) => ( {
  root: {
    flexGrow: 1,
  },
  footer: {
    width: 500,
  },
  table: {
    minWidth: 600,
  },
} ));

const StyledTableCell = withStyles((theme) => ( {
  head: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  body: {
    fontSize: 14,
    color: theme.palette.common.white,
  },
  root: {
    borderBottom: '1px solid rgba(81, 81, 81, 1)',
  },
} ))(TableCell);

const StyledTableRow = withStyles((theme) => ( {
  root: {
    backgroundColor: '#424242',
  },
} ))(TableRow);

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      rewards: 3000,
      timeLeft: 1591416000000,
      liveNode: [],
      totalPoints: 0,
      tableRows: [],
      timeInterval: 3,
    };
  }

  componentDidMount() {
    this.getJsonData();
  }

  createData(name, wallet, networkId, timePoints, estimate) {
    return {name, wallet, networkId, timePoints, estimate};
  }

  getJsonData = () => {
    fetch('./sumarized_report.json').then(function(response) {
      if (response.status === 200) {
        return response.json();
      }
      else {
        return [];
      }
    }).then(function(data) {
      this.setState({
        liveNode: data,
      }, () => this.setTableData());
    }.bind(this)).catch(function(e) {
      console.log(e);
    });
  }

  setTableData = () => {
    const {liveNode, timeInterval, rewards} = this.state;

    let points = 0;
    for (let key in liveNode) {
      points += liveNode[key].duration * timeInterval;
    }

    let rows = [];
    for (let key in liveNode) {
      let node = liveNode[key];
      let version = node.peer_version.match(/\([\s\S]*\)/);
      let nameString = version[0].replace(/^\(*|\)*$/g, '').split('|');
      let name = nameString[0].replace(/(^\s*)|(\s*$)/g, '');

      let wallet = 'x';
      if (nameString[1]) {
        wallet = nameString[1].replace(/(^\s*)|(\s*$)/g, '');
      }

      let networkId = key;
      let timePoints = node.duration * timeInterval;
      let estimate = timePoints / ( points === 0 ? 1 : points ) * rewards;

      rows.push(this.createData(name, wallet, networkId, timePoints,
          Number(estimate).toFixed(4)));
    }

    this.setState({
      totalPoints: points,
      tableRows: rows,
    });
  }

  countdownRenderer = ({days, hours, minutes, seconds, completed}) => {
    if (!completed) {
      let d = days <= 1 ? 'day' : 'days';
      let h = hours < 10 ? '0' : '';
      let m = minutes < 10 ? '0' : '';
      let s = seconds < 10 ? '0' : '';

      return (
          <span>{ days } { d } { h }{ hours }:{ m }{ minutes }:{ s }{ seconds }</span>
      );
    }
    else {
      return null;
    }
  };

  render() {
    const classes = useStyles;
    const {rewards, timeLeft, liveNode, totalPoints, tableRows} = this.state;

    return (
        <div className={ classes.root }>
          <Grid container direction="column" justify="center"
                alignItems="center">
            <Grid item xs={ 10 }>
              <div className="header">
                <div className="logo">
                  <img src={ logo }/>
                </div>

                <Grid container direction="row" justify="space-between">
                  <Grid item xs={ 12 }>
                    <div className="rules">
                      <Grid item xs={ 6 } style={ {float: 'left'} }>
                        <p>Rewards: { rewards.toString().
                            replace(/(\d)(?=(\d{3})+(?:\.\d+)?$)/g,
                                '$1,') } BNC</p>
                        <p>Remaining: <Countdown date={ timeLeft }
                                                 renderer={ this.countdownRenderer }/>
                        </p>
                      </Grid>
                      <Grid item xs={ 6 } style={ {float: 'right'} }
                            align="right">
                        <p>Total Points: { totalPoints }</p>
                        <p>Nodes: { Object.keys(liveNode).length }</p>
                      </Grid>
                    </div>
                  </Grid>
                </Grid>
              </div>
              <TableContainer component={ Paper }>
                <Table className={ classes.table } aria-label="simple table">
                  <TableHead>
                    <StyledTableRow>
                      <StyledTableCell>Node Name</StyledTableCell>
                      <StyledTableCell align="left">
                        Network ID
                      </StyledTableCell>
                      <StyledTableCell align="left">
                        BNC Address
                      </StyledTableCell>
                      <StyledTableCell align="right">
                        Time Points&nbsp;(Point/Min)
                      </StyledTableCell>
                      <StyledTableCell align="right">
                        <div style={ {
                          display: 'inline-block',
                          verticalAlign: 'inherit',
                          lineHeight: '16px',
                          paddingRight: '3px',
                        } }>
                          <Tooltip placement="top"
                                   title="Calculate: NodeTimePoints / SUM(TimePoints) * Rewards">
                            <InfoIcon fontSize="small"/>
                          </Tooltip>
                        </div>
                        Rewards .est
                      </StyledTableCell>
                    </StyledTableRow>
                  </TableHead>
                  <TableBody>
                    { tableRows.map((row) => (
                        <StyledTableRow hover key={ row.name }>
                          <StyledTableCell component="th" scope="row">
                            { row.name }
                          </StyledTableCell>
                          <StyledTableCell
                              align="left">{ row.networkId }</StyledTableCell>
                          <StyledTableCell
                              align="left">{ row.wallet }</StyledTableCell>
                          <StyledTableCell
                              align="right">{ row.timePoints }</StyledTableCell>
                          <StyledTableCell align="right"
                                           style={ {color: 'yellow'} }>{ row.estimate } BNC</StyledTableCell>
                        </StyledTableRow>
                    )) }
                  </TableBody>
                </Table>
              </TableContainer>
              <div className="footer"></div>
            </Grid>
          </Grid>
        </div>
    );
  }
}

export default App;