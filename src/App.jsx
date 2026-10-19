import { Routes, Route } from 'react-router-dom'
import NavBar from './components/NavBar.jsx'
import HomePage from './pages/HomePage.jsx'
import AboutPage from './pages/AboutPage.jsx'

function App() {
    return (
        <>
            <NavBar />
            <div className="container">
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/about" element={<AboutPage />} />
                </Routes>
            </div>
        </>
    )
}

export default App