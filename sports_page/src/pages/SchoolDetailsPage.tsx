import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { getSchoolDetails } from '../services/schools_services'

interface School {
  school_id: number,
  school_name: string,
  school_type_id: number,
  state: string,
  city: string,
  address: string,
  website: string,
}

const SchoolDetails = () => {
    const { school_id } = useParams();
    const [schoolData, setSchoolData] = useState<School | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
  
    const fetchData = async () => {
        try {
            const data = await getSchoolDetails(`${school_id}`);
            setSchoolData(data);
        } catch (error) {
            console.log("error: ", error);
            setError("error");
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        fetchData();
    }, [school_id])

    if (isLoading) {
        return (
            <div className="page_container">
                <h2>Loading...</h2>
            </div>
        );
    }

    if (error || !schoolData) {
        return (
            <div className="page_container">
                <h2>Error: {error || 'School not found'}</h2>
                <button className="sport_button" onClick={() => {
                    navigate('/schools');
                    document.body.scrollTop = 0;
                    document.documentElement.scrollTop = 0;
                    }}>
                    Back to Schools
                </button>
            </div>
        );
    }
  return (
    <div className="page_container">
            {!isLoading && schoolData && (
                <>
                    <h1 className="header1">{`${schoolData.school_name}`}</h1>
                    <div className="sport_detail_container">
                        <a target='_blank' href={`${schoolData.website}`} className="sport_description">{schoolData.website}</a>
                        <div className="sport_info">
                            <p>Location: {`${schoolData.address} ${schoolData.city}, ${schoolData.state}`}</p>
                            <p>School Type: { schoolData.school_type_id === 2 ? 
                                              'College' :
                                              'High School'
                                            }</p>
                        </div>
                    </div>
                </>
            )}
            <button className="sport_button" onClick={() => {
                navigate('/schools');
                document.body.scrollTop = 0;
                document.documentElement.scrollTop = 0;
                }}>
                Back to Schools
            </button>
        </div>
  )
}

export default SchoolDetails
