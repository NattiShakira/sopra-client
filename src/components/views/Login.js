import React, {useState} from 'react';
import {api, handleError} from 'helpers/api';
import User from 'models/User';
import {useHistory} from 'react-router-dom';
import {Button} from 'components/ui/Button';
import 'styles/views/Login.scss';
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";

/**
 * It is possible to add multiple components inside a single file,
 * however be sure not to clutter your files with an endless amount!
 * As a rule of thumb, use one file per component and only add small,
 * specific components that belong to the main one in the same file.
 */
const FormField = props => {
    return (
        <div className="login field">
            <label className="login label">
                {props.label}
            </label>
            <input
                className="login input"
                placeholder="enter here"
                value={props.value}
                onChange={e => props.onChange(e.target.value)}
            />
        </div>
    );
};

FormField.propTypes = {
    label: PropTypes.string,
    value: PropTypes.string,
    onChange: PropTypes.func
};

const Login = () => {
    const history = useHistory();
    /**
     * Array destructuring: username is a state, setUsername is a function to change state.
     * We cannot just write something like username="Username".
     */
    const [username, setUsername] = useState(null);
    const [password, setPassword] = useState(null);

    /**
     * This function sends info in a JSON file to an api, waits for a response, after that creates a user and puts
     * his token to a sessionStorage. If registration is successful, a user is redirected to game/dashboard route (useHistory hook)
     * @returns {Promise<void>}
     */
    const doRegister = async () => {
        try {
            const requestBody = JSON.stringify({username, password});
            const response = await api.post('/users', requestBody);

            // Get the returned user and update a new object.
            const user = new User(response.data);

            // Store the token into the local storage.
            sessionStorage.setItem('token', user.token);

            // Registration successfully worked, navigate to the route /game/dashboard.
            history.push(`/game/dashboard`);
        } catch (error) {
            alert(`Something went wrong during registration: \n${handleError(error)}`);
        }
    };

    const doLogin = async () => {
        try {
            const requestBody = JSON.stringify({username, password});
            const response = await api.post('/registered', requestBody);

            // Get the returned user and update a new object.
            const user = new User(response.data);

            // Store the token into the local storage.
            sessionStorage.setItem('token', user.token);

            // Login successfully worked, navigate to the route /game/dashboard.
            history.push(`/game/dashboard`);

        } catch (error) {
            alert(`Something went wrong during login: \n${handleError(error)}`);
        }
    };

    return (
        <BaseContainer>
            <div className="login container">
                <div className="login form">
                    <FormField
                        label="Username"
                        value={username}
                        onChange={un => setUsername(un)}
                    />
                    <FormField
                        label="Password"
                        value={password}
                        onChange={p => setPassword(p)}
                    />
                    <div className="login button-container">
                        <Button
                            disabled={!username || !password}
                            width="100%"
                            onClick={() => doRegister()}
                        >
                            REGISTER
                        </Button>
                        <Button
                            disabled={!username || !password}
                            width="100%"
                            onClick={() => doLogin()}
                        >
                            LOGIN
                        </Button>
                    </div>
                </div>
            </div>
        </BaseContainer>
    );
};

export default Login;
