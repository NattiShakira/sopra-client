import React, {useEffect, useState} from 'react'; // We could just write import React from..., but we take
// specific methods from React, that's why we write {useEffect, useState} (it's called destructuring), useState is a HOOK
import {api, handleError} from 'helpers/api';
import {useParams} from 'react-router-dom';
import BaseContainer from "components/ui/BaseContainer";
import "styles/views/Game.scss";

export default function Player() {
    const {id} = useParams()
    const [player, setPlayer] = useState(null)

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await api.get(`/users/${id}`);

                await new Promise(resolve => setTimeout(resolve, 1000));

                // Get the returned users and update the state.
                setPlayer(response.data);

                // This is just some data for you to see what is available.
                // Feel free to remove it.
                console.log('request to:', response.request.responseURL);
                console.log('status code:', response.status);
                console.log('status text:', response.statusText);
                console.log('requested data:', response.data);

                // See here to get more data.
                console.log(response);
            } catch (error) {
                console.error(`Something went wrong while fetching the user: \n${handleError(error)}`);
                console.error("Details:", error);
                alert("Something went wrong while fetching the user! See the console for details.");
            }
        }

        fetchData();
    }, [id]);

    console.log(player)

    return (
        <BaseContainer>
            <div className="player-container">
                <div className="player-detail">
                    <p className="player username">Username: {player.username}</p>
                    <input/>
                    <button className="link-button">SUBMIT</button>
                    <p className="player id">Online status: {player.status}</p>
                    <p className="player id">Creation date {player.creation_date}</p>
                    <p className="player id">Birthday: {player.birthday}</p>
                    <input/>
                    <button className="link-button">SUBMIT</button>
                </div>
            </div>
        </BaseContainer>
    )
};
