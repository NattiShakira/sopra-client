import {useEffect, useState} from 'react';
import {useParams, useHistory} from "react-router-dom";
import {api, handleError} from "../../helpers/api";
import {Button} from "../ui/Button";
import PropTypes from "prop-types";
import 'styles/views/Profile.scss';
import {format} from 'date-fns'
import {Spinner} from "components/ui/Spinner";


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

const Profile = () => {
    const history = useHistory();
    const params = useParams();
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [disabled, setDisabled] = useState(true);

    useEffect(() => {
        let userId = !!params.id ? parseInt(params.id) : -1;

        // Effect callbacks are synchronous to prevent race conditions. So we put the async function inside:
        async function fetchData() {
            try {
                const response = await api.get(`/users/${userId}`);

                // Get the returned user and update the state.
                setUser(response.data);
                setIsLoading(false)
                setDisabled(sessionStorage.getItem('token') !== response.data.token)

                console.log('request to:', response.request.responseURL);
                console.log('status code:', response.status);
                console.log('status text:', response.statusText);
                console.log('requested data:', response.data);
                console.log(response);

            } catch (error) {
                console.error(`Something went wrong while fetching the user: \n${handleError(error)}`);
                console.error("Details:", error);
                alert("Something went wrong while fetching the user! See the console for details.");
            }
        }

        fetchData();
    }, [params.id]);

    const inputChanged = (field) => (e) => {
        const copyUser = {...user}
        copyUser[field] = e
        setUser(copyUser)
    }
    const dateInputChanged = (field) => (e) => {
        const copyUser = {...user}
        copyUser[field] = !!e ? new Date(e) : null
        setUser(copyUser)
    }

    const doSave = async (sendUser) => {
        try {
            // sendUser.creation_date = format(new Date(sendUser.creation_date), 'dd.MM.yyyy')
            sendUser.birthday = format(new Date(sendUser.birthday), 'dd.MM.yyyy')
            const requestBody = JSON.stringify({...sendUser});
            await api.put(`/users/${sendUser.id}`, requestBody);

        } catch (error) {
            alert(`Something went wrong during changing the user's profile: \n${handleError(error)}`);
        }
    };

    const goDashboard = async () => {
        try {
            history.push('/game/dashboard')
        } catch (error) {
            alert(`Something went wrong during returning to dashboard: \n${handleError(error)}`);
        }
    };

    return (
        <div>
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
                            value={!!user.birthday ? format(new Date(user.birthday), 'yyyy-MM-dd').toString() : null}
                            onChange={dateInputChanged('birthday')}
                        />
                        <div className="dashboard button-container">
                            <Button
                                disabled={disabled}
                                width="100%"
                                onClick={() => doSave(user)}>
                                SAVE
                            </Button>
                            <Button width="100%" onClick={() => goDashboard()}>
                                TO DASHBOARD
                            </Button>
                        </div>
                    </div>
                </div>
            }
        </div>
    );
};

export default Profile;