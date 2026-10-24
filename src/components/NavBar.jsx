import {NavLink} from 'react-router-dom'

function NavBar() {
    return (<nav className="navbar navbar-expand navbar-dark bg-dark px-3">
        <span className="navbar-brand">Aurora CS Course Scheduler</span>
        <div className="navbar-nav ms-auto">
            <NavLink className="nav-link" to="/" end>Home</NavLink>
            <NavLink className="nav-link" to="/about" end>About</NavLink>
        </div>
    </nav>
    )
}

export default NavBar