import {useEffect, useState} from 'react';
import {api, handleError} from 'helpers/api';
import {Button} from 'components/ui/Button';
import {Link, useHistory} from 'react-router-dom';
import BaseContainer from "components/ui/BaseContainer";
import "styles/views/Game.scss";
import {format} from "date-fns";

const Game = () => {
    // Use react-router-dom's hook to access the history.
    const history = useHistory();

    // Define a state variable (using the state hook).
    // If this variable changes, the component will re-render, but the variable will
    // keep its value throughout render cycles.
    // A component can have as many state variables as you like.
    // More information can be found under https://reactjs.org/docs/hooks-state.html
    const [users, setUsers] = useState(null);

    // Updates the user's status in the back-end when the function doLogout() is called.
    const updateOfflineStatus = (callback) => {
        const token = sessionStorage.getItem('token')
        const currentUser = {...users.find(value => value.token === token)}
        currentUser.creation_date = format(new Date(currentUser.creation_date), 'dd.MM.yyyy')
        currentUser.birthday = format(new Date(currentUser.birthday), 'dd.MM.yyyy')
        currentUser.status = 'OFFLINE'
        const requestBody = JSON.stringify({...currentUser});
        api.put(`/users/${currentUser.id}`, requestBody)
            .then(value => {
                if (!!callback) {
                    callback()
                }
            });
    }

    const logout = () => {
        updateOfflineStatus(() => {
            sessionStorage.removeItem('token');
            history.push('/login');
        })
    }

    // The effect hook can be used to react to change in your component.
    // In this case, the effect hook is only run once, the first time the component is mounted.
    // This can be achieved by leaving the second argument an empty array.
    // For more information on the effect hook, please see https://reactjs.org/docs/hooks-effect.html
    useEffect(() => {
        // Effect callbacks are synchronous to prevent race conditions. So we put the async function inside:
        async function fetchData() {
            try {
                const response = await api.get('/users');

                // Get the returned users and update the state.
                setUsers(response.data);

                console.log('request to:', response.request.responseURL);
                console.log('status code:', response.status);
                console.log('status text:', response.statusText);
                console.log('requested data:', response.data);
                console.log(response);

            } catch (error) {
                console.error(`Something went wrong while fetching the users: \n${handleError(error)}`);
                console.error("Details:", error);
                alert("Something went wrong while fetching the users! See the console for details.");
            }
        }

        fetchData();
    }, []);

    let content;

    if (users) {
        // Unordered list of users displayed on the dashboard
        content = (
            <div className="game">
                <ul className="game user-list">
                    {users.map(user => (
                        <Link to={`/game/dashboard/${user.id}`} style={{ textDecoration: "none" }}>
                            <div className="player container">
                                <div className="player username">{user.username}</div>
                            </div>
                        </Link>
                    ))}
                </ul>
                <Button
                    width="100%"
                    onClick={() => logout()}
                >
                    LOGOUT
                </Button>
            </div>
        );
    }

    console.log("Dashboard is loaded")

    return (
        <BaseContainer className="game container">
            <h2>Registered users</h2>
            <p className="game paragraph">
                Choose a user:
            </p>
            {content}
        </BaseContainer>
    );

}

export default Game;
