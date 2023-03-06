import React, {useEffect, useState} from 'react';
import {Link, useHistory, useParams} from "react-router-dom";
import {api, handleError} from "../../helpers/api";
import {Button} from "../ui/Button";
import PropTypes from "prop-types";
import 'styles/views/Dashboard.scss';
import {format} from 'date-fns'
import {Spinner} from "../ui/Spinner";


const FormField = props => {
    return (
        <div className="dashboard field">
            <label className="dashboard label">
                {props.label}
            </label>
            <input
                type={props.type}
                className="dashboard input"
                placeholder="enter here.."
                disabled={props.disabled}
                value={props.value}
                onChange={e => props.onChange(e.target.value)}
            />
        </div>
    );
};

FormField.propTypes = {
    label: PropTypes.string,
    value: PropTypes.string,
    type: PropTypes.string,
    disabled: PropTypes.bool,
    onChange: PropTypes.func
};

const Dashboard = () => {
    const history = useHistory();
    const params = useParams();
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [disabled, setDisabled] = useState(true)

    useEffect(() => {

        let userId = !!params.id ? parseInt(params.id) : -1;
        console.log(userId)

        // effect callbacks are synchronous to prevent race conditions. So we put the async function inside:
        async function fetchData() {
            try {
                const response = await api.get(`/users/${userId}`);

                // delays continuous execution of an async operation for 1 second.
                // This is just a fake async call, so that the spinner can be displayed
                // feel free to remove it :)
                await new Promise(resolve => setTimeout(resolve, 1000));

                // Get the returned users and update the state.
                setUser(response.data);
                setIsLoading(false)
                setDisabled(sessionStorage.getItem('token') !== response.data.token)

                // This is just some data for you to see what is available.
                // Feel free to remove it.
                console.log('request to:', response.request.responseURL);
                console.log('status code:', response.status);
                console.log('status text:', response.statusText);
                console.log('requested data:', response.data);

                // See here to get more data.
                console.log(response);
            } catch (error) {
                console.error(`Something went wrong while fetching the users: \n${handleError(error)}`);
                console.error("Details:", error);
                alert("Something went wrong while fetching the users! See the console for details.");
            }
        }

        fetchData();
    }, []);

    const inputChanged = (field) => (e) => {
        console.log(new Date(e))
        const copyUser = {...user}
        copyUser[field] = e
        setUser(copyUser)
    }
    const dateInputChanged = (field) => (e) => {
        const copyUser = {...user}
        copyUser[field] = new Date(e)
        setUser(copyUser)
    }

    const doSave = async (sendUser) => {
        try {
            sendUser.creation_date = format(new Date(sendUser.creation_date), 'dd.MM.yyyy')
            sendUser.birthday = format(new Date(sendUser.birthday), 'dd.MM.yyyy')
            const requestBody = JSON.stringify({...sendUser});
            const response = await api.put(`/users/${sendUser.id}`, requestBody)
        } catch (error) {
            alert(`Something went wrong during changing profile: \n${handleError(error)}`);
        }
    };

    return (
        <>
            {isLoading ? <Spinner/> :
                <div className="dashboard container">
                    <div className="dashboard form">

                        <FormField
                            disabled={disabled}
                            label="Username"
                            value={user.username}
                            onChange={inputChanged('username')}
                        />

                        <FormField
                            disabled={true}
                            label="Online status"
                            value={user.status}
                        />
                        <FormField
                            label="Creation date"
                            type={'date'}
                            disabled={true}
                            value={format(new Date(user.creation_date), 'yyyy-MM-dd').toString()}
                        />
                        <FormField
                            label="Birthday"
                            disabled={disabled}
                            type={'date'}
                            value={format(new Date(user.birthday), 'yyyy-MM-dd').toString()}
                            onChange={dateInputChanged('birthday')}
                        />

                        <div className="login button-container">
                            <Button
                                disabled={disabled}
                                width="100%"
                                onClick={() => doSave(user)}>
                                SAVE
                            </Button>
                        </div>
                    </div>
                    <Link to={`/game/dashboard`}>
                        <div className="player container">
                            <div className="player username">BACK TO DASHBOARD</div>
                        </div>
                    </Link>
                </div>
            }
        </>
    );
};

export default Dashboard;