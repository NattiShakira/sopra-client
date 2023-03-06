import {Redirect, Route} from "react-router-dom";
import Game from "components/views/Game";
import PropTypes from 'prop-types';
import Player from 'components/views/Player'

const ProfileRouter = props => {
    /**
     * "this.props.base" is "/app" because as been passed as a prop in the parent of GameRouter, i.e., App.js
     */

    // <Route path="/vans/:id" element={<VanDetail />} />
    return (
        <div style={{display: 'flex', flexDirection: 'column'}}>
            <Route exact path={`${props.base}/dashboard/:id`}>
                <Player />
            </Route>
            <Route exact path={`${props.base}`}>
                <Redirect to={`${props.base}/dashboard`}/>
            </Route>
        </div>
    )
};

/*
* Don't forget to export your component!
 */

ProfileRouter.propTypes = {
    base: PropTypes.string
}

export default ProfileRouter;