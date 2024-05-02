import React from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import '../sass/componentsass/HomeContent.scss';

const Stay = ({ pageTitle }) => {
    return (
        <div className="sample-page">
            <Header />
            <main className='main-content'>
                <h1>{pageTitle}</h1>
                {/* You can add more content here as needed */}
            </main>
            <Footer />
        </div>
    );
};

export default Stay;