import {Route, useHistory} from "react-router-dom";
import Game from "components/views/Game";
import PropTypes from 'prop-types';
import Profile from "components/views/Profile";

const GameRouter = props => {
    /**
    * Pushes a user to /game/dashboard if he attempts to go to /game or /game/
     */
    const history = useHistory();
    if (window.location.pathname.endsWith('/game') || window.location.pathname.endsWith('/game/')) {
        history.push('/game/dashboard')
    }

    /**
     * "this.props.base" is "/app" because as been passed as a prop in the parent of GameRouter, i.e., App.js
     */
    return (
        <div style={{display: 'flex', flexDirection: 'column'}}>
            <Route exact path={`${props.base}/dashboard`}>
                <Game/>
            </Route>
            <Route exact path={`${props.base}/dashboard/:id`}>
                <Profile/>
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
