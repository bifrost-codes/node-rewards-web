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
import Keyring from '@polkadot/keyring';

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
    fontSize: '12px',
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
  root: {
    fontSize: 12,
    backgroundColor: '#525252',
    borderBottom: '1px solid #696969',
    color: theme.palette.common.white,
  },
} ))(TableCell);

const StyledTableCell2 = withStyles((theme) => ( {
  root: {
    fontSize: 12,
    color: theme.palette.common.white,
    backgroundColor: '#414141',
    borderBottom: '1px solid #696969',
  },
} ))(TableCell);

const StyledTableCell3 = withStyles((theme) => ( {
  root: {
    fontSize: 12,
    backgroundColor: '#313131',
    color: theme.palette.common.white,
    borderBottom: '1px solid #696969',
  },
} ))(TableCell);

const StyledTableCell4 = withStyles((theme) => ( {
  root: {
    fontSize: 12,
    backgroundColor: '#ca3e47',
    color: theme.palette.common.white,
    borderBottom: '1px solid #696969',
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
      timeLeft: 1604073600000,
      nodesList: [],
      total_block: 0,
      total_crosschain: 0,
      total_vtoken: 0,
      total_validator: 0,
      tableRows: [],
    };
  }

  async componentDidMount() {
    this.queryNodeData();
  }

  milliFormat(num) {
    return num && num.toString().replace(/\d+/, function(s) {
      return s.replace(/(\d)(?=(\d{3})+$)/g, '$1,');
    });
  }

  createData(
      address, block_num, block_reward_est, eos_bifrost, bifrost_eos,
      cross_chain_reward_est, vksm, vdot, vtoken_reward_est, total_reward_est) {
    block_num = this.milliFormat(block_num);
    block_reward_est = this.milliFormat(Number(block_reward_est).toFixed(2));
    eos_bifrost = this.milliFormat(eos_bifrost);
    bifrost_eos = this.milliFormat(bifrost_eos);
    cross_chain_reward_est = this.milliFormat(
        Number(cross_chain_reward_est).toFixed(2));
    vksm = this.milliFormat(Number(vksm).toFixed(2));
    vdot = this.milliFormat(Number(vdot).toFixed(2));
    vtoken_reward_est = this.milliFormat(Number(vtoken_reward_est).toFixed(2));
    total_reward_est = this.milliFormat(Number(total_reward_est).toFixed(2));

    return {
      address,
      block_num,
      block_reward_est,
      eos_bifrost,
      bifrost_eos,
      cross_chain_reward_est,
      vksm,
      vdot,
      vtoken_reward_est,
      total_reward_est,
    };
  }

  queryNodeData = () => {
    fetch('https://api.liebi.com/v1/bifrost/incentive').
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
            nodesList: data.data['list'],
            total_block: this.milliFormat(data.data['total_block']),
            total_crosschain: this.milliFormat(data.data['total_crosschain']),
            total_vtoken: this.milliFormat(data.data['total_vtoken']),
            total_validator: this.milliFormat(data.data['total_validator']),
          }, async () => {
            await this.setTableData();
          });
        }.bind(this));
  };

  setTableData = async () => {
    const {nodesList} = this.state;

    let tableRows = [];

    for (let node in nodesList) {
      tableRows.push(
          this.createData(nodesList[node].address, nodesList[node].block_num,
              nodesList[node].block_reward_est,
              nodesList[node].cross_chain.eos_bifrost,
              nodesList[node].cross_chain.bifrost_eos,
              nodesList[node].cross_chain_reward_est,
              nodesList[node].vtoken_balance.vksm,
              nodesList[node].vtoken_balance.vdot,
              nodesList[node].vtoken_reward_est,
              nodesList[node].total_reward_est));
    }

    this.setState({
      tableRows: tableRows,
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
      return <span>9,000 BNC</span>;
    }
  };

  CrossChainCountdownRenderer = ({days, hours, minutes, seconds, completed}) => {
    if (!completed) {
      let d = days <= 1 ? 'day' : 'days';
      let h = hours < 10 ? '0' : '';
      let m = minutes < 10 ? '0' : '';
      let s = seconds < 10 ? '0' : '';

      return (
          <span>3,000 BNC Launch in { days } { d } { h }{ hours }:{ m }{ minutes }:{ s }{ seconds }</span>
      );
    }
    else {
      return (
          <span>3,000 BNC</span>
      );
    }
  };

  vTokenCountdownRenderer = ({days, hours, minutes, seconds, completed}) => {
    if (!completed) {
      let d = days <= 1 ? 'day' : 'days';
      let h = hours < 10 ? '0' : '';
      let m = minutes < 10 ? '0' : '';
      let s = seconds < 10 ? '0' : '';

      return (
          <span>6,000 BNC Launch in { days } { d } { h }{ hours }:{ m }{ minutes }:{ s }{ seconds }</span>
      );
    }
    else {
      return (
          <span>6,000 BNC</span>
      );
    }
  };

  render() {
    const classes = useStyles;
    const {
      timeLeft,
      tableRows,
      total_validator,
      total_block,
      total_crosschain,
      total_vtoken,
    } = this.state;

    let panel = `# Phase 1. Execute the following command to run a validator, share 9,000 BNC
docker run \\
-it \\
-p 30333:30333 \\
bifrostnetwork/bifrost:asgard-v0.5.0 \\
--name "NodeName" \\
--validator
    
# Phase 2. Cross chain EOS <-> Bifrost, share 3,000 BNC
# Phase 3. Convert Token (DOT/KSM) to vToken (vDOT/vKSM), share 6,000 BNC

# Validator tutorial (Phase 1): https://wiki.bifrost.finance/en/help/validator-tutorial.html
# Cross-chain tutorial (Phase 2): https://wiki.bifrost.finance/en/help/eos-transfer-tutorial.html
# vToken tutorial (Phase 3): https://wiki.bifrost.finance/en/help/eos-veos-tutorial.html

# Homepage: https://bifrost.finance
# Dashboard: https://dash.bifrost.finance
`;

    let sortTables = [...tableRows];

    sortTables = sortTables.sort(function(a, b) {
      return b.total_reward_est - a.total_reward_est;
    });

    let tableBody = (
        <TableBody>
          { sortTables.map((row, key) => (
              <StyledTableRow hover key={ key }>
                <StyledTableCell1 align="left">
                  { row.address }
                </StyledTableCell1>
                <StyledTableCell1 align="right">
                  { row.block_num }
                </StyledTableCell1>
                <StyledTableCell1 align="right" style={ {color: 'yellow'} }>
                  { row.block_reward_est } BNC
                </StyledTableCell1>
                <StyledTableCell2 align="right">
                  { row.eos_bifrost }
                </StyledTableCell2>
                <StyledTableCell2 align="right">
                  { row.bifrost_eos }
                </StyledTableCell2>
                <StyledTableCell2 align="right" style={ {color: 'yellow'} }>
                  { row.cross_chain_reward_est } BNC
                </StyledTableCell2>
                <StyledTableCell3 align="right">
                  { row.vksm }
                </StyledTableCell3>
                <StyledTableCell3 align="right">
                  { row.vdot }
                </StyledTableCell3>
                <StyledTableCell3 align="right" style={ {color: 'yellow'} }>
                  { row.vtoken_reward_est } BNC
                </StyledTableCell3>
                <StyledTableCell4 align="right" style={ {color: 'yellow'} }>
                  { row.total_reward_est } BNC
                </StyledTableCell4>
              </StyledTableRow>
          )) }
        </TableBody>
    );

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
                            style={ {color: 'yellow'} }>18,000 BNC</span></p>
                        <p>Timeleft: <Countdown date={ timeLeft }
                                                renderer={ this.countdownRenderer }/>
                        </p>
                      </Grid>
                      <Grid item xs={ 6 } style={ {float: 'right'} }
                            align="right">
                        <p>Validators: { total_validator }</p>
                        <p>Block: { total_block }</p>
                        <p>Cross-chain: { total_crosschain }</p>
                        <p>vToken: { total_vtoken }</p>
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
                      <StyledTableCell1 align="center" colSpan={ 3 }>
                        Validator Production Block Competition&nbsp;
                        <div style={ {
                          display: 'inline-block',
                          verticalAlign: 'inherit',
                          lineHeight: '16px',
                          paddingRight: '3px',
                        } }>
                          <Tooltip placement="top"
                                   title="Calculate: BlockNum / SUM(BlockNum) * 9,000 BNC">
                            <InfoIcon fontSize="small"/>
                          </Tooltip>
                        </div>
                        <br/>
                        <span style={ {color: 'yellow'} }>9,000 BNC</span>
                      </StyledTableCell1>
                      <StyledTableCell2 align="center" colSpan={ 3 }>
                        EOS Cross-chain Competition&nbsp;
                        <div style={ {
                          display: 'inline-block',
                          verticalAlign: 'inherit',
                          lineHeight: '16px',
                          paddingRight: '3px',
                        } }>
                          <Tooltip placement="top"
                                   title="Calculate: Cross-chain Times / SUM(Cross-chain Times) * 3,000 BNC">
                            <InfoIcon fontSize="small"/>
                          </Tooltip>
                        </div>
                        <br/>
                        <span style={ {color: 'yellow'} }><Countdown
                            date={ 1601438400000 }
                            renderer={ this.CrossChainCountdownRenderer }/></span>
                      </StyledTableCell2>
                      <StyledTableCell3 align="center" colSpan={ 3 }>
                        vToken Balance Competition&nbsp;
                        <div style={ {
                          display: 'inline-block',
                          verticalAlign: 'inherit',
                          lineHeight: '16px',
                          paddingRight: '3px',
                        } }>
                          <Tooltip placement="top"
                                   title="Calculate: (vKSM + vDOT) / SUM(vKSM + vDOT) * 6,000 BNC">
                            <InfoIcon fontSize="small"/>
                          </Tooltip>
                        </div>
                        <br/>
                        <span style={ {color: 'yellow'} }><Countdown
                            date={ 1602302400000 }
                            renderer={ this.vTokenCountdownRenderer }/></span>
                      </StyledTableCell3>
                      <StyledTableCell4 align="right">
                        Total
                      </StyledTableCell4>
                    </StyledTableRow>
                    <StyledTableRow>
                      <StyledTableCell1 align="center">
                        Address
                      </StyledTableCell1>
                      <StyledTableCell1 align="center">
                        Block
                      </StyledTableCell1>
                      <StyledTableCell1 align="center">
                        est.
                      </StyledTableCell1>
                      <StyledTableCell2 align="center">
                        to Bifrost&nbsp;
                        <div style={ {
                          display: 'inline-block',
                          verticalAlign: 'inherit',
                          lineHeight: '16px',
                          paddingRight: '3px',
                        } }>
                          <Tooltip placement="top"
                                   title="From EOS to Bifrost transfer amount ≥ 50 EOS, count 1 time of cross-chain">
                            <InfoIcon fontSize="small"/>
                          </Tooltip>
                        </div>
                      </StyledTableCell2>
                      <StyledTableCell2 align="center">
                        to EOS&nbsp;
                        <div style={ {
                          display: 'inline-block',
                          verticalAlign: 'inherit',
                          lineHeight: '16px',
                          paddingRight: '3px',
                        } }>
                          <Tooltip placement="top"
                                   title="From Bifrost to EOS transfer amount ≥ 50 EOS, count 1 time of cross-chain">
                            <InfoIcon fontSize="small"/>
                          </Tooltip>
                        </div>
                      </StyledTableCell2>
                      <StyledTableCell2 align="center">
                        est.
                      </StyledTableCell2>
                      <StyledTableCell3 align="center">
                        vKSM
                      </StyledTableCell3>
                      <StyledTableCell3 align="right">
                        vDOT
                      </StyledTableCell3>
                      <StyledTableCell3 align="right">
                        est.
                      </StyledTableCell3>
                      <StyledTableCell4 align="right">
                        est.
                      </StyledTableCell4>
                    </StyledTableRow>
                  </TableHead>
                  { tableBody }
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
