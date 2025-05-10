import { useEffect, useState } from 'react'
import './pageStyles/common_styles.css'
import './pageStyles/playerpage.css'
import { getPlayers } from '../services/players_service'
import { useNavigate } from 'react-router-dom'

interface Player {
  player_id: number,
  first_name: string,
  last_name: string,
  date_of_birth: string,
  gender_id: number,
  bio: string
}

const Player = () => {
  const [ playerData, setPlayerData ] = useState<Player[] | null>([]);
  const [ isLoading, setIsLoading ] = useState<boolean>(false);
  const navigate = useNavigate();

  const fetchData = async () => {
    setIsLoading(true);
    
      try {
          const data = await getPlayers();
          setPlayerData(data);
      } catch (error) {
          console.error('Error fetching players data:', error);
      } finally {
          setIsLoading(false);
      }
  }

  useEffect(() => {
    fetchData();
  }, [])

  const handleSportClick = (player_id: number) => {
    const playerUrl = `/players/player_profile/${player_id}`;
    console.log("Navigating to:", playerUrl);
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
    navigate(playerUrl);
};

  return (
    <>
        <div className='page_container'>
            <h1 className='header1'>Players</h1>

            <div className='players_container'>
                {isLoading ? (
                    <p>Loading players...</p>
                ) : (
                  <div className='player_button_container'>
                    {playerData && playerData.map((player) => (
                        <button 
                            key={player.player_id}
                            className='player_button'
                            onClick={() => handleSportClick(player.player_id)}
                        >
                            <img className='profile_image' src='/empty_user_image.png'></img>
                            {`${player.first_name} ${player.last_name}`}
                        </button>
                    ))}
                  </div>
                )}
            </div>
        </div>
    </>
  )
}

export default Player
