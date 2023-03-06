import React, {useState} from 'react';
import {api, handleError} from 'helpers/api';
import User from 'models/User';
import {useHistory} from 'react-router-dom';
import {Button} from 'components/ui/Button';
import 'styles/views/Login.scss'; // Change this?
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import {format} from "date-fns";

/*
It is possible to add multiple components inside a single file,
however be sure not to clutter your files with an endless amount!
As a rule of thumb, use one file per component and only add small,
specific components that belong to the main one in the same file.
 */
const FormField = props => {
    return (
        <div className="login field">
            <label className="login label">
                {props.label}
            </label>
            <input
                className="login input"
                placeholder="enter here.."
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

const Login = props => {
    const history = useHistory();
    const [password, setPassword] = useState(null);
    const [username, setUsername] = useState(null); // array destructuring, username is a state, setUsername is a function
    // This function allows to change state. We cannot just write: username="Something"
    // const creation_date = Date();

    // This function sends info in a json file to an api, waits for a response, after that creates a user and puts
    // him into a storage
    // If login is successfull => useHistory hook (adds /game to the history)
    const doRegister = async () => {
        try {
            const requestBody = JSON.stringify({username, password});
            const response = await api.post('/users', requestBody);

            // Get the returned user and update a new object.
            const user = new User(response.data);

            // Store the token into the local storage.
            sessionStorage.setItem('token', user.token);

            // Login successfully worked --> navigate to the route /game in the GameRouter
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

            const currentUser={...user}
            currentUser.creation_date = format(new Date(currentUser.creation_date), 'dd.MM.yyyy')
            currentUser.birthday = format(new Date(currentUser.birthday), 'dd.MM.yyyy')
            currentUser.status='ONLINE'

            const requestBodyUser = JSON.stringify({...currentUser});
            api.put(`/users/${currentUser.id}`, requestBodyUser)
                .then(value => {
                    // Store the token into the local storage.
                    sessionStorage.setItem('token', user.token);

                    // Login successfully worked --> navigate to the route /game in the GameRouter
                    history.push(`/game/dashboard`);
                });

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
                            Register
                        </Button>

                        <Button
                            disabled={!username || !password}
                            width="100%"
                            onClick={() => doLogin()}
                        >
                            Login
                        </Button>

                    </div>
                </div>
            </div>
        </BaseContainer>
    );
};

/**
 * You can get access to the history object's properties via the withRouter.
 * withRouter will pass updated match, location, and history props to the wrapped component whenever it renders.
 */
export default Login;
