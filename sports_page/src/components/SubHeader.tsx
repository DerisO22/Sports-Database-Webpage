import '../components/component_styles/subheader_menu.css'
import { Link } from 'react-router-dom'

const SubHeader = () => {

    const handleScrollTop = () => {
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
    }

    return (
        <div className="subheaderMenuContainer">
            {/* <div className="headerLogo">
                <img src={logo} alt="Logo" />
            </div> */}

            <div className="headerMenu">
                <Link onClick={() => handleScrollTop()} to="/" className="headerMenuItem">Home</Link>
                <Link onClick={() => handleScrollTop()} to="/sports" className="headerMenuItem">Sports</Link>
                <Link onClick={() => handleScrollTop()} to="/schools" className="headerMenuItem">Schools</Link>
                <Link onClick={() => handleScrollTop()} to="/news" className="headerMenuItem">News</Link>
                <Link onClick={() => handleScrollTop()} to='/players' className='headerMenuItem'>Players</Link>
            </div>
        </div>
    )
}

export default SubHeader
