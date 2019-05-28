import openSocket from 'socket.io-client';
import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Button from '@material-ui/core/Button';

const styles = theme => ({
  '@global': {
    body: {
      backgroundColor: theme.palette.common.white,
    },
  },
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
});

class App extends React.Component {
  socketEndpoint = 'http://10.0.0.176:5000';
  socket;

  constructor(props) {
    super(props);

    this.state = {
      connected: false,
      inProgress: false,
      numPlayers: 0,
      host: null,

      activeContestant: null,
      buzzerLocked: true,

      id: '',
      name: 'Player 1',
    };
  }

  updateName = (e) => {
    this.setState({ name: e.target.value });
  }

  onBuzzer = () => {
    this.socket.emit('Buzz', this.state.name);
  }

  onAskQuestion = () => {
    this.socket.emit('AskQuestion');
  }

  onUnlock = () => {
    this.socket.emit('UnlockBuzzer');
  }

  renderActiveContestant = () => {
    const { classes } = this.props;
    const { buzzerLocked, activeContestant } = this.state;

    return (
      <div>
        <Grid item xs={12}>
          <Button disabled={buzzerLocked || !!activeContestant} variant="contained" color="primary" className={classes.button} onClick={this.onBuzzer}>Buzz In</Button>
        </Grid>
        {activeContestant &&
          (
            <Grid item xs={12}>
              <Typography component="h1" variant="h5">
                {activeContestant.name} buzzed in!
              </Typography>
            </Grid>
          )
        }
      </div>);
  }

  renderActiveHost = () => {
    const { classes } = this.props;
    const { buzzerLocked, activeContestant } = this.state;
    return (
      <div>
        <Grid item xs={12}>
          <Button variant="contained" color="primary" className={classes.button} onClick={this.onUnlock}>Unlock</Button>
        </Grid>
        {activeContestant &&
          (
            <div>
              <Grid item xs={12}>
                <Typography component="h1" variant="h5">
                  {activeContestant.name} buzzed in!
                </Typography>
              </Grid>
            </div>
          )
        }
      </div>
    );
  }

  renderActiveGame = () => {
    const { host, id } = this.state;
    return host === id
      ? (this.renderActiveHost())
      : (this.renderActiveContestant());
  }

  renderGame = () => {
    const { classes } = this.props;
    const { inProgress } = this.state;
    return inProgress
      ? (this.renderActiveGame())
      : (
        <div>
          <Grid item xs={12}>
            <Typography component="h1" variant="h5">
              Waiting for host...
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Button variant="contained" color="primary" className={classes.button} onClick={this.onAskQuestion}>Ask Question</Button>
          </Grid>
        </div >
      );
  }

  componentDidMount = () => {
    this.socket = openSocket(this.socketEndpoint);
    this.socket.on('connect', () => {

      // TODO: This is probably unnecessary
      this.setState({ id: this.socket.id });
    });

    this.socket.on('StateChange', data => {
      this.setState({ ...data, connected: true }, () => console.log(this.state))
    });
  }

  render() {
    const { classes } = this.props;
    const { numPlayers, name, connected } = this.state;

    return (
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div className={classes.paper}>
          <Typography component="h1" variant="h3">
            Jeopardy! {this.state.testVal}
          </Typography>
          <Typography component="h1" variant="h5">
            Players {numPlayers}
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                autoComplete="name"
                name="name"
                fullWidth
                id="firstName"
                label="Name"
                value={name}
                onChange={this.updateName}
                autoFocus
              />
            </Grid>
            {connected
              ? (this.renderGame())
              : (
                <div>
                  <Typography component="h1" variant="h5">
                    Connecting...
                  </Typography>
                </div>
              )
            }
          </Grid>
        </div>
      </Container >
    );
  }
}

App.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(App);
