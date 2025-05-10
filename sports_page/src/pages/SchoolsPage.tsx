import './pageStyles/schoolspage.css'
import './pageStyles/common_styles.css'
import { useEffect, useState } from 'react'
import { getSchools } from '../services/schools_services'
import { useNavigate } from 'react-router-dom'

interface School {
  school_id: number,
  school_name: string,
  school_type_id: number,
  state: string,
  city: string,
  address: string,
  website: string,
}

const SchoolsPage = () => {
  const [ schoolData, setSchoolData ] = useState<School[]>([]);
  const [ isLoading, setIsLoading ] = useState<boolean>(false);
  const navigate = useNavigate();
  
  const fetchData = async () => {
    setIsLoading(true);

    try {
      const data = await getSchools();
      setSchoolData(data);
    } catch (error) {
      console.log("Error: ", error);
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData();
  }, [])

  const handleSchoolClick = (school_id: number) => {
    const schoolUrl = `/schools/${school_id}`;
    console.log("Navigating to:", schoolUrl);
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
    navigate(schoolUrl);
};

  return (
    <>
        <div className='page_container'>
            <h1 className='header1'>Schools</h1>

            <div className='sports_container'>
                {isLoading ? (
                    <p>Loading sports...</p>
                ) : (
                    schoolData.map((school) => (
                        <button 
                            key={school.school_id}
                            className='sport_button'
                            onClick={() => handleSchoolClick(school.school_id)}
                        >
                            {school.school_name}
                        </button>
                    ))
                )}
            </div>
        </div>
    </>
  )
}

export default SchoolsPage;