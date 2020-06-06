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
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { a11yDark as CodeStyle } from 'react-syntax-highlighter/dist/esm/styles/hljs';

import './App.css';

const useStyles = makeStyles((theme) => ( {
  root: {
    flexGrow: 1,
  },
  panel: {
    marginBottom: '30px'
  },
  table: {
    minWidth: 1095,
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
} ));

const StyledPanel = withStyles((theme) => ( {
  root: {
    backgroundColor: '#424242',
    color: theme.palette.common.white,
  },
} ))(ExpansionPanel);

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
      rewards: 5000,
      timeLeft: 1591416000000,
      liveNode: [],
      totalPoints: 0,
      tableRows: [],
      timeInterval: 3,
      activateAddress: [],
      matchCount: 0
    };
  }

  componentDidMount() {
    this.getJsonData();
  }

  createData(name, wallet, activate, networkId, timePoints, estimate) {
    return {name, wallet, activate, networkId, timePoints, estimate};
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
      }, () => this.getActivateData());
    }.bind(this)).catch(function(e) {
      console.log(e);
    });
  }

  getActivateData = () => {
    fetch('./activate_address.json').then(function(response) {
      if (response.status === 200) {
        return response.json();
      }
      else {
        return [];
      }
    }).then(function(data) {
      this.setState({
        activateAddress: data,
      }, () => this.setTableData());
    }.bind(this)).catch(function(e) {
      console.log(e);
    });
  }

  setTableData = () => {
    const {liveNode, activateAddress, timeInterval, rewards} = this.state;

    let points = 0;
    for (let key in liveNode) {
      points += liveNode[key].duration * timeInterval;
    }

    let rows = [];
    let match = 0;
    for (let key in liveNode) {
      let node = liveNode[key];
      let version = node.peer_version.match(/\([\s\S]*\)/);

      if(version && version.length > 0) {
        let nameString = version[0].replace(/^\(*|\)*$/g, '').split('|');
        let name = nameString[0].replace(/(^\s*)|(\s*$)/g, '');

        let wallet = '-';
        if (nameString[1]) {
          wallet = nameString[1].replace(/(^\s*)|(\s*$)/g, '');
        }

        let networkId = key;
        let timePoints = node.duration * timeInterval;
        let estimate = timePoints / ( points === 0 ? 1 : points ) * rewards;

        let activate = '❌';
        if(wallet !== '-' && wallet.length >= 10) {
          activateAddress.map(function (item) {
            if(item.indexOf(wallet) === 0) {
              activate = '✅';
              match ++;
            }
          })
        }

        rows.push(this.createData(name, wallet, activate, networkId, timePoints, Number(estimate).toFixed(4)));
      }
    }

    this.setState({
      totalPoints: points,
      tableRows: rows,
      matchCount: match
    });
  };

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
    const {matchCount, timeLeft, liveNode, totalPoints, tableRows} = this.state;

    let panel = `# Step 1. Execute the following command to join network
# Step 2. Join telegram (https://t.me/bifrost_network)
# Step 3. Say '/want@bifrost_faucet_bot BNCAddress' in telegram group (trigger bot and record BNC address)
    
docker run \\
-p 30333:30333 \\
-p 9944:9944 \\
bifrostnetwork/bifrost:latest \\
--rpc-cors all \\
--unsafe-ws-external \\
--name "NodeName | BNCAddress" 

# BNCAddress is the top 10 digits of the Bifrost address
# Match the full address need trigger bot (Step 3)

# Distribution: 2020/06/10 12:00:00 (UTC+8)
# Please match address successful before distribution

# Homepage: https://bifrost.codes
# Dashboard: https://dashboard.bifrost.codes
`;

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
                        <p>Rewards: 3,000 BNC  <span style={{color:'yellow'}}> + 2,000 BNC</span> = 5,000 BNC</p>
                        <p>Congratulation! Waiting for distribution</p>
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
              <Grid item xs={ 12 } style={{ marginBottom: '10px' }}>
                <StyledPanel defaultExpanded>
                  <ExpansionPanelSummary
                      expandIcon={<ExpandMoreIcon style={{ color:'#FFFFFF' }}/>}
                      aria-controls="panel1a-content"
                      id="panel1a-header"
                  >
                    <Typography className={classes.heading}>How to join and get 💰 rewards?</Typography>
                  </ExpansionPanelSummary>
                  <ExpansionPanelDetails>
                    <SyntaxHighlighter className="highlightCode" language="powershell" style={CodeStyle}>
                      {panel}
                    </SyntaxHighlighter>
                  </ExpansionPanelDetails>
                </StyledPanel>
              </Grid>
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
                      <StyledTableCell align="center">
                        <div style={ {
                          display: 'inline-block',
                          verticalAlign: 'inherit',
                          lineHeight: '16px',
                          paddingRight: '3px',
                        } }>
                          <Tooltip placement="top"
                                   title="Only matched addresses can receive BNC (Step 2 & Step 3)">
                            <InfoIcon fontSize="small"/>
                          </Tooltip>
                        </div>
                        Match ({matchCount})
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
                          <StyledTableCell component="th" scope="row">{ row.name }
                          </StyledTableCell>
                          <StyledTableCell
                              align="left">{ row.networkId }</StyledTableCell>
                          <StyledTableCell align="left">{ row.wallet }</StyledTableCell>
                          <StyledTableCell align="center">{ row.activate }</StyledTableCell>
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