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
import {a11yDark as CodeStyle} from 'react-syntax-highlighter/dist/esm/styles/hljs';

import parameter from './parameter.json';
import {
  ApiPromise,
  WsProvider,
} from '@polkadot/api';

import './App.css';

const useStyles = makeStyles((theme) => ( {
  root: {
    flexGrow: 1,
  },
  panel: {
    marginBottom: '30px',
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

const CustomPaper = withStyles((theme) => ( {
  root: {
    backgroundColor: '#333',
  },
} ))(Paper);

const StyledTableCell1 = withStyles((theme) => ( {
  head: {
    backgroundColor: '#525252',
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

const StyledTableCell2 = withStyles((theme) => ( {
  head: {
    backgroundColor: '#414141',
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

const StyledTableCell3 = withStyles((theme) => ( {
  head: {
    backgroundColor: '#313131',
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

const StyledTableCell4 = withStyles((theme) => ( {
  head: {
    backgroundColor: '#ca3e47',
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
      timePointRewards: 5000,
      totalTimePoint: 0,
      validatorRewards: 4000,
      totalValidator: 0,
      eosRewards: 6000,
      totalEosCross: 0,
      totalVEosBalance: 0,
      timeLeft: 1597982400000,
      liveNode: [],
      totalPoints: 0,
      totalNode: 0,
      matchCount: 0,
      tableRows: [],
    };
  }

  async componentDidMount() {
    this.queryNodeData();
    // await this.queryBifrostNode();
  }

  createData(
      name, address, fullAddress, timePoint, timePointEst, validator, validatorEst, eosCross,
      vEosBalance, eosEst, totalEst) {
    return {
      name,
      address,
      fullAddress,
      timePoint,
      timePointEst,
      validator,
      validatorEst,
      eosCross,
      vEosBalance,
      eosEst,
      totalEst,
    };
  }

  queryNodeData = () => {
    fetch('https://api.liebi.com/v1/bifrost/node_monitoring').
        then(function(response) {
          if (response.status === 200) {
            return response.json();
          }
          else {
            return [];
          }
        }).
        then(function(data) {
          this.setState({
            liveNode: data.data,
          }, () => this.setTableData());
        }.bind(this));
  };

  // async vEosBalance(address) {
  //   const wsProvider = new WsProvider('wss://n2.testnet.liebi.com/');
  //   const api = await ApiPromise.create({
  //     provider: wsProvider,
  //     types: parameter,
  //   });
  //
  //   return await api.query.assets.accountAssets(['vEOS', address], (res) => {
  //     return Number(res['balance']) / 1000000000000
  //   });
  // }

  // async validator(address) {
  //   const wsProvider = new WsProvider('wss://n2.testnet.liebi.com/');
  //   const api = await ApiPromise.create({
  //     provider: wsProvider,
  //     types: parameter,
  //   });
  //
  //   return await api.query.assets.accountAssets(['vEOS', address], (res) => {
  //     return Number(res['balance']) / 1000000000000
  //   });
  // }

  setTableData = () => {
    const {liveNode, timePointRewards} = this.state;

    let totalTimePoint = 0;
    let totalNode = 0;
    for (let key in liveNode) {
      totalNode++;
      totalTimePoint += liveNode[key].timePoints;
    }

    let tableRows = [];
    for (let key in liveNode) {
      let node = liveNode[key];
      let address = node.address;

      if (address) {
        let suffix = ' ❌';
        if (node.fullAddress) {
          suffix = ' ✅';
        }

        address += suffix;
      }
      else {
        address = '-';
      }

      let timePointEst = Number(node.timePoints / ( totalTimePoint === 0 ? 1 : totalTimePoint ) * timePointRewards).toFixed(4);

      tableRows.push(this.createData(node.name, address, node.fullAddress, node.timePoints, timePointEst, 0, 0, 0, 0, 0, 0));
    }

    this.setState({
      totalTimePoint: totalTimePoint,
      totalNode: totalNode,
      tableRows: tableRows,
    });
  };

  async queryBifrostNode() {
    const { tableRows } = this.state;
    console.log('aaa');

    const wsProvider = new WsProvider('wss://n2.testnet.liebi.com/');
    const api = await ApiPromise.create({
      provider: wsProvider,
      types: parameter,
    });

    let updateRows = tableRows;

    updateRows.map(function (item, key) {
      console.log('aaa',item)
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
    const {
      timePointRewards,
      totalTimePoint,
      validatorRewards,
      totalValidator,
      eosRewards,
      totalEosCross,
      totalVEosBalance,
      timeLeft,
      liveNode,
      totalPoints,
      totalNode,
      matchCount,
      tableRows,
    } = this.state;

    let panel = `# Step 1. Execute the following command to join network
# Step 2. Join telegram (https://t.me/bifrost_faucet)
# Step 3. Say '/want + BNCAddress' in telegram group (trigger bot and record BNC address)
    
docker run \\
-it \\
-p 30333:30333 \\
-p 9944:9944 \\
-v /tmp/bifrost-node:/node \\
bifrostnetwork/bifrost:asgard-v0.4.0 \\
--base-path '/node' \\
--name "NodeName | BNCAddress" \\
--rpc-cors 'all' \\
--unsafe-ws-external \\
--validator

# BNCAddress is the top 10 digits of the Bifrost address
# Match the full address need trigger bot (Step 3)

# Node tutorial: https://wiki.bifrost.finance/en/help/node-general-tutorial.html
# Validator tutorial: https://wiki.bifrost.finance/en/help/validator-tutorial.html
# Cross-chain tutorial: https://wiki.bifrost.finance/en/help/eos-transfer-tutorial.html

# Homepage: https://bifrost.finance
# Dashboard: https://dash.bifrost.finance
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
                        <p>Rewards: <span
                            style={ {color: 'yellow'} }>15,000 BNC</span></p>
                        <p>Timeleft: <Countdown date={ timeLeft } renderer={ this.countdownRenderer }/>
                        </p>
                      </Grid>
                      <Grid item xs={ 6 } style={ {float: 'right'} }
                            align="right">
                        <p>Total Points: { totalTimePoint }</p>
                        <p>Nodes: { Object.keys(liveNode).length }</p>
                      </Grid>
                    </div>
                  </Grid>
                </Grid>
              </div>
              <Grid item xs={ 12 } style={ {marginBottom: '10px'} }>
                <StyledPanel>
                  <ExpansionPanelSummary
                      expandIcon={ <ExpandMoreIcon
                          style={ {color: '#FFFFFF'} }/> }
                      aria-controls="panel1a-content"
                      id="panel1a-header"
                  >
                    <Typography className={ classes.heading }>How to join and
                      get 💰 rewards?</Typography>
                  </ExpansionPanelSummary>
                  <ExpansionPanelDetails>
                    <SyntaxHighlighter className="highlightCode"
                                       language="powershell"
                                       style={ CodeStyle }>
                      { panel }
                    </SyntaxHighlighter>
                  </ExpansionPanelDetails>
                </StyledPanel>
              </Grid>
              <TableContainer component={ CustomPaper }>
                <Table className={ classes.table } aria-label="simple table">
                  <TableHead>
                    <StyledTableRow>
                      <StyledTableCell1 align="center" colSpan={ 4 }>
                        Node Duration Competition&nbsp;
                        <div style={{
                          display: 'inline-block',
                          verticalAlign: 'inherit',
                          lineHeight: '16px',
                          paddingRight: '3px',
                        }}>
                          <Tooltip placement="top" title="Calculate: TimePoint / SUM(TimePoint) * 5,000 BNC">
                            <InfoIcon fontSize="small"/>
                          </Tooltip>
                        </div>
                      </StyledTableCell1>
                      <StyledTableCell2 align="center" colSpan={ 2 }>
                        Validator King Contest&nbsp;
                        <div style={{
                          display: 'inline-block',
                          verticalAlign: 'inherit',
                          lineHeight: '16px',
                          paddingRight: '3px',
                        }}>
                          <Tooltip placement="top" title="Calculate: 4,000 BNC / SUM(Validator ✅)">
                            <InfoIcon fontSize="small"/>
                          </Tooltip>
                        </div><br />
                        <span style={{color: 'yellow'}}>Launch time &nbsp;<Countdown date={ 1595563200000 } renderer={ this.countdownRenderer }/></span>
                      </StyledTableCell2>
                      <StyledTableCell3 align="center" colSpan={ 3 }>
                        EOS Cross-chain Contest&nbsp;
                        <div style={{
                          display: 'inline-block',
                          verticalAlign: 'inherit',
                          lineHeight: '16px',
                          paddingRight: '3px',
                        }}>
                          <Tooltip placement="top" title="Calculate: (Cross-chain Times / SUM(Cross-chain Times) * 0.7 + vEOS Balance / SUM(vEOS Balance) * 0.3) * 6,000 BNC">
                            <InfoIcon fontSize="small"/>
                          </Tooltip>
                        </div><br />
                        <span style={{color: 'yellow'}}>Launch time &nbsp;<Countdown date={ 1595822400000 } renderer={ this.countdownRenderer }/></span>
                      </StyledTableCell3>
                      <StyledTableCell4 align="right">
                        Total
                      </StyledTableCell4>
                    </StyledTableRow>
                    <StyledTableRow>
                      <StyledTableCell1 align="center">
                        Node Name
                      </StyledTableCell1>
                      <StyledTableCell1 align="center">
                        Address
                      </StyledTableCell1>
                      <StyledTableCell1 align="center">
                        TimePoint
                      </StyledTableCell1>
                      <StyledTableCell1 align="center">
                        est.
                      </StyledTableCell1>
                      <StyledTableCell2 align="center">
                        Validator
                      </StyledTableCell2>
                      <StyledTableCell2 align="center">
                        est.
                      </StyledTableCell2>
                      <StyledTableCell3 align="center">
                        Cross-chain&nbsp;
                        <div style={{
                          display: 'inline-block',
                          verticalAlign: 'inherit',
                          lineHeight: '16px',
                          paddingRight: '3px',
                        }}>
                          <Tooltip placement="top" title="EOS Jungle Testnet <-> Bifrost transfer amount ≥ 50 EOS, count 1 time of cross-chain">
                            <InfoIcon fontSize="small"/>
                          </Tooltip>
                        </div>
                      </StyledTableCell3>
                      <StyledTableCell3 align="center">
                        vEOS Balance
                      </StyledTableCell3>
                      <StyledTableCell3 align="center">
                        est.
                      </StyledTableCell3>
                      <StyledTableCell4 align="right">
                        est.
                      </StyledTableCell4>
                    </StyledTableRow>
                  </TableHead>
                  <TableBody>
                    { tableRows.map((row, key) => (
                        <StyledTableRow hover key={ key }>
                          <StyledTableCell1 component="th" scope="row" align="left">
                            { row.name }
                          </StyledTableCell1>
                          <StyledTableCell1 align="left">
                            { row.address }
                            </StyledTableCell1>
                          <StyledTableCell1 align="right">
                            { row.timePoint }
                            </StyledTableCell1>
                          <StyledTableCell1 align="right" style={ {color: '#ffffa6'} }>
                            { row.timePointEst } BNC
                            </StyledTableCell1>
                          <StyledTableCell2 align="right">
                            {/*{ row.validator }*/} -
                            </StyledTableCell2>
                          <StyledTableCell2 align="right" style={ {color: '#ffffa6'} }>
                            {/*{ row.validatorEst } BNC*/} -
                          </StyledTableCell2>
                          <StyledTableCell3 align="center">
                            {/*{ row.eosCross }*/} -
                          </StyledTableCell3>
                          <StyledTableCell3 align="center">
                            {/*{ row.vEosBalance }*/} -
                          </StyledTableCell3>
                          <StyledTableCell3 align="right" style={ {color: '#ffffa6'} }>
                            {/*{ row.eosEst } BNC*/} -
                          </StyledTableCell3>
                          <StyledTableCell4 align="right" style={ {color: 'yellow'} }>
                            { row.timePointEst } BNC
                          </StyledTableCell4>
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