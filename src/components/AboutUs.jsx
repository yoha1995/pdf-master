import React from 'react';
import { ArrowLeft, Info } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

const AboutUs = ({ onBack }) => {
    return (
        <div className="tool-view-container">
            <Helmet>
                <title>About Us - PDF Master</title>
                <meta name="description" content="Learn more about PDF Master, your all-in-one online PDF solution for editing, signing, and organizing documents." />
            </Helmet>
            <header className="tool-header">
                <button className="menu-btn" onClick={onBack}>
                    <ArrowLeft size={18} /> Back
                </button>
                <h2>About Us</h2>
                <div style={{ width: 50 }}></div>
            </header>

            <div className="tool-body centered-body">
                <div className="glass-panel" style={{ maxWidth: '800px', width: '100%', padding: '2.5rem', textAlign: 'left' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                        <Info size={40} color="#fbbf24" />
                        <h3 style={{ margin: 0, fontSize: '1.8rem' }}>Welcome to PDF Master</h3>
                    </div>

                    <p style={{ color: '#cbd5e1', lineHeight: '1.8', fontSize: '1.1rem', marginBottom: '2rem' }}>
                        <strong>PDF Master</strong> was born out of a simple need: to provide a powerful, easy-to-use, and secure PDF utility that works entirely in the browser.
                        We believe that editing and managing documents should be accessible to everyone without the need for expensive software or complex installations.
                    </p>

                    <h4 style={{ color: '#fbbf24', fontSize: '1.3rem', marginBottom: '1rem' }}>Our Mission</h4>
                    <p style={{ color: '#cbd5e1', lineHeight: '1.6', marginBottom: '2rem' }}>
                        Our mission is to simplify document workflows by providing high-quality tools that respect user privacy.
                        By leveraging modern web technologies, we enable processing directly on your device, ensuring that your sensitive information remains private.
                    </p>

                    <h4 style={{ color: '#fbbf24', fontSize: '1.3rem', marginBottom: '1rem' }}>Key Features</h4>
                    <ul style={{ color: '#cbd5e1', lineHeight: '2', paddingLeft: '1.5rem' }}>
                        <li><strong>Security First:</strong> Private documents stay in your browser.</li>
                        <li><strong>All-in-One:</strong> Edit, Sign, Compress, Protect, and Organize in one place.</li>
                        <li><strong>Fast & Light:</strong> No downloads required, works on any modern browser.</li>
                        <li><strong>Free to Use:</strong> Professional tools accessible for everyone.</li>
                    </ul>

                    <div style={{ marginTop: '3rem', padding: '1.5rem', background: 'rgba(251, 191, 36, 0.1)', borderRadius: '12px', borderLeft: '4px solid #fbbf24' }}>
                        <p style={{ color: '#fbbf24', margin: 0, fontWeight: 600 }}>
                            Thank you for choosing PDF Master. We are constantly working to improve our tools and add new features to help you manage your documents better.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AboutUs;
