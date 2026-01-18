import React from 'react';
import { ArrowLeft, ShieldCheck } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

const PrivacyPolicy = ({ onBack }) => {
    return (
        <div className="tool-view-container">
            <Helmet>
                <title>Privacy Policy - PDF Master</title>
                <meta name="description" content="Privacy Policy for PDF Master. Learn how we handle your data and protect your privacy." />
            </Helmet>
            <header className="tool-header">
                <button className="menu-btn" onClick={onBack}>
                    <ArrowLeft size={18} /> Back
                </button>
                <h2>Privacy Policy</h2>
                <div style={{ width: 50 }}></div>
            </header>

            <div className="tool-body centered-body">
                <div className="glass-panel" style={{ maxWidth: '800px', width: '100%', padding: '2.5rem', textAlign: 'left' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                        <ShieldCheck size={40} color="#fbbf24" />
                        <h3 style={{ margin: 0, fontSize: '1.8rem' }}>Protecting Your Privacy</h3>
                    </div>

                    <section style={{ marginBottom: '2rem' }}>
                        <h4 style={{ color: '#fbbf24', fontSize: '1.2rem' }}>1. Data Collection & Processing</h4>
                        <p style={{ color: '#cbd5e1', lineHeight: '1.6' }}>
                            At <strong>PDF Master</strong>, we prioritize the security of your documents. We do not store, view, or share any PDF files you upload.
                            Most of our tools process files locally within your browser, meaning your data never even leaves your computer.
                            For tools that require server-side processing, files are kept in temporary secure sessions and are automatically deleted immediately after processing.
                        </p>
                    </section>

                    <section style={{ marginBottom: '2rem' }}>
                        <h4 style={{ color: '#fbbf24', fontSize: '1.2rem' }}>2. Cookies & Tracking</h4>
                        <p style={{ color: '#cbd5e1', lineHeight: '1.6' }}>
                            We use standard technologies like cookies to improve your user experience. We also use <strong>Google AdSense</strong> to show relevant advertisements and <strong>Google Analytics</strong> to understand how our site is used.
                            These third-party services may use cookies to serve ads based on your prior visits to our website or other websites.
                        </p>
                    </section>

                    <section style={{ marginBottom: '2rem' }}>
                        <h4 style={{ color: '#fbbf24', fontSize: '1.2rem' }}>3. Third-Party Disclosure</h4>
                        <p style={{ color: '#cbd5e1', lineHeight: '1.6' }}>
                            We do not sell, trade, or otherwise transfer your personally identifiable information to outside parties. This does not include trusted third parties who assist us in operating our website, so long as those parties agree to keep this information confidential.
                        </p>
                    </section>

                    <section style={{ marginBottom: '2rem' }}>
                        <h4 style={{ color: '#fbbf24', fontSize: '1.2rem' }}>4. Consent</h4>
                        <p style={{ color: '#cbd5e1', lineHeight: '1.6' }}>
                            By using our site, you consent to our website's privacy policy.
                        </p>
                    </section>

                    <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginTop: '3rem', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1rem' }}>
                        Last updated: {new Date().toLocaleDateString()}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
