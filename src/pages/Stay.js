import React from 'react';
import Header from './components/Header';
import Footer from './components/Footer';

const Stay = ({ pageTitle }) => {
    return (
        <>
            <Header />
            <main className='main-content'>
                <h1>{pageTitle}</h1>
                {/* You can add more content here as needed */}
            </main>
            <Footer showCircles={true} />
        </>
    );
};

export default Stay;