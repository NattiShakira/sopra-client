import {Redirect, Route} from "react-router-dom";
import Game from "components/views/Game";
import PropTypes from 'prop-types';
import Player from 'components/views/Player'
import Dashboard from "../../views/Dashboard";

const GameRouter = props => {
  /**
   * "this.props.base" is "/app" because as been passed as a prop in the parent of GameRouter, i.e., App.js
   */

  // <Route path="/vans/:id" element={<VanDetail />} />
  return (
      <div style={{display: 'flex', flexDirection: 'column'}}>
          <Route exact path={`${props.base}/dashboard`}>
              <Game/>
          </Route>
          <Route exact path={`${props.base}/dashboard/:id`}>
              <Dashboard/>
          </Route>
      </div>
  )
};

/*
* Don't forget to export your component!
 */

GameRouter.propTypes = {
  base: PropTypes.string
}

export default GameRouter;
