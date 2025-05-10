import './pageStyles/homepage.css'
import './pageStyles/common_styles.css'
import { useNavigate } from 'react-router-dom'

const HomePage = () => {
    const navigate = useNavigate();
    
    return (
        <div className='page_container'>
            <section className='title_section'>
                <h1 className='header1'>Home</h1>
                <img src='home.png' className='home_logo'></img>
            </section>
            <section className='hero_section'>
                <h1 className='hero_title'>Welcome to Field Stats</h1>
                <p className='hero_subtitle'>Your Ultimate Sports Statistics and Information Platform</p>
            </section>

            <section className='features_section'>
                <div className='feature_card'>
                    <h2>Sports Coverage</h2>
                    <p>Comprehensive statistics across multiple sports</p>
                    <button onClick={() => {
                        navigate('/sports');
                        document.body.scrollTop = 0;
                        document.documentElement.scrollTop = 0;
                        }} 
                        className='feature_button'>
                        Explore Sports
                    </button>
                </div>

                <div className='feature_card'>
                    <h2>Player Stats</h2>
                    <p>Detailed player performance analytics</p>
                    <button onClick={() => {
                        navigate('/players');
                        document.body.scrollTop = 0;
                        document.documentElement.scrollTop = 0;
                        }} 
                        className='feature_button'>
                        View Players
                    </button>
                </div>

                <div className='feature_card'>
                    <h2>School Teams</h2>
                    <p>Track your favorite school teams</p>
                    <button onClick={() => {
                        navigate('/schools')
                        document.body.scrollTop = 0;
                        document.documentElement.scrollTop = 0;
                        }} 
                        className='feature_button'>
                        Find Schools
                    </button>
                </div>
            </section>

            <section className='news_preview'>
                <h2>Latest Sports News</h2>
                <button onClick={() => {
                    navigate('/news')
                    document.body.scrollTop = 0;
                    document.documentElement.scrollTop = 0;
                    }} 
                    className='news_button'>
                    Read More News
                </button>
            </section>
        </div>
    )
}

export default HomePage;
