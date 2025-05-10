import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getPlayerDetails } from "../services/players_service";

interface Player {
    player_id: number,
    first_name: string,
    last_name: string,
    date_of_birth: string,
    gender_id: number,
    bio: string
  }

const PlayerDetailsPage = () => {
    const { player_id } = useParams();
    const [playerData, setPlayerData] = useState<Player | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
  
    const fetchData = async () => {
        try {
            const data = await getPlayerDetails(`${player_id}`);
            setPlayerData(data);
        } catch (error) {
            console.log("error: ", error);
            setError("error");
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        fetchData();
    }, [player_id])

    if (isLoading) {
        return (
            <div className="page_container">
                <h2>Loading...</h2>
            </div>
        );
    }

    if (error || !playerData) {
        return (
            <div className="page_container">
                <h2>Error: {error || 'Player not found'}</h2>
                <button className="sport_button" onClick={() => {
                    navigate('/players');
                    document.body.scrollTop = 0;
                    document.documentElement.scrollTop = 0;
                    }}>
                    Back to Players
                </button>
            </div>
        );
    }
  
    return (
        <div className="page_container">
            {!isLoading && playerData && (
                <>
                    <h1 className="header1">{`${playerData.first_name} ${playerData.last_name}`}</h1>
                    <div className="sport_detail_container">
                        <p className="sport_description">{playerData.bio}</p>
                        <div className="sport_info">
                            <p>Player ID: {playerData.player_id}</p>
                            <p>Data of Birth: {playerData.date_of_birth}</p>
                        </div>
                    </div>
                </>
            )}
            <button className="sport_button" onClick={() => {
                navigate('/players');
                document.body.scrollTop = 0;
                document.documentElement.scrollTop = 0;
                }}>
                Back to Players
            </button>
        </div>
    )
}

export default PlayerDetailsPage
