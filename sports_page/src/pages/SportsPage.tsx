import { useState, useEffect } from 'react'
import './pageStyles/sportspage.css'
import './pageStyles/common_styles.css'
import { useNavigate } from 'react-router-dom'
import { getSports } from '../services/sports_service'

interface Sport {
    sport_id: number,
    sport_name: string,
    sport_description: string,
    has_gender_division: boolean,
}

const SportsPage = () => {
    const [ sportsData, setSportsData ] = useState<Sport[]>([]);
    const [ isLoading, setIsLoading ] = useState<boolean>(false);
    const navigate = useNavigate();

    const fetchData = async () => {
        setIsLoading(true);
    
        try {
            const data = await getSports();
            setSportsData(data);
        } catch (error) {
            console.error('Error fetching sports data:', error);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        fetchData();
    }, []);

    const handleSportClick = (sportName: string) => {
        const sportUrl = `/sports/${sportName.toLowerCase()}`;
        console.log("Navigating to:", sportUrl);
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
        navigate(sportUrl);
    };

    return (
        <div className='page_container'>
            <h1 className='header1'>Sports</h1>

            <div className='sports_container'>
                {isLoading ? (
                    <p>Loading sports...</p>
                ) : (
                    sportsData.map((sport) => (
                        <button 
                            key={sport.sport_id}
                            className='sport_button'
                            onClick={() => handleSportClick(sport.sport_name)}
                        >
                            {sport.sport_name}
                        </button>
                    ))
                )}
            </div>
        </div>
    )
}

export default SportsPage;