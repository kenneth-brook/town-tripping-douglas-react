import React from 'react';
import '../sass/LandingPage.scss';
import RoundButton from './components/RoundButton';

const LandingPage = () => {
    return (
        <div className="landing-page">
            <div className="container">
                <RoundButton />
            </div>
        </div>
    );
}

export default LandingPage;