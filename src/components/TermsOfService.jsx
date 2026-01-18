import React from 'react';
import { ArrowLeft, FileText } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

const TermsOfService = ({ onBack }) => {
    return (
        <div className="tool-view-container">
            <Helmet>
                <title>Terms of Service - PDF Master</title>
                <meta name="description" content="Terms of Service for PDF Master. Please read our terms and conditions for using our PDF tools." />
            </Helmet>
            <header className="tool-header">
                <button className="menu-btn" onClick={onBack}>
                    <ArrowLeft size={18} /> Back
                </button>
                <h2>Terms of Service</h2>
                <div style={{ width: 50 }}></div>
            </header>

            <div className="tool-body centered-body">
                <div className="glass-panel" style={{ maxWidth: '800px', width: '100%', padding: '2.5rem', textAlign: 'left' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                        <FileText size={40} color="#fbbf24" />
                        <h3 style={{ margin: 0, fontSize: '1.8rem' }}>Terms & Conditions</h3>
                    </div>

                    <section style={{ marginBottom: '2rem' }}>
                        <h4 style={{ color: '#fbbf24', fontSize: '1.2rem' }}>1. Acceptance of Terms</h4>
                        <p style={{ color: '#cbd5e1', lineHeight: '1.6' }}>
                            By accessing and using <strong>PDF Master</strong>, you accept and agree to be bound by the terms and provision of this agreement.
                            Our services are provided on an "AS IS" and "AS AVAILABLE" basis.
                        </p>
                    </section>

                    <section style={{ marginBottom: '2rem' }}>
                        <h4 style={{ color: '#fbbf24', fontSize: '1.2rem' }}>2. Use of Service</h4>
                        <p style={{ color: '#cbd5e1', lineHeight: '1.6' }}>
                            You agree to use PDF Master only for lawful purposes. You are solely responsible for the content of the files you upload and process using our tools.
                            We do not guarantee the accuracy, integrity, or quality of the processed files.
                        </p>
                    </section>

                    <section style={{ marginBottom: '2rem' }}>
                        <h4 style={{ color: '#fbbf24', fontSize: '1.2rem' }}>3. Disclaimer of Liability</h4>
                        <p style={{ color: '#cbd5e1', lineHeight: '1.6' }}>
                            <strong>PDF Master</strong> and its developers shall not be liable for any direct, indirect, incidental, special, or consequential damages resulting from the use or the inability to use the service or for the cost of procurement of substitute goods and services.
                            Use the tools at your own risk. We are not responsible for any data loss during the processing of your files.
                        </p>
                    </section>

                    <section style={{ marginBottom: '2rem' }}>
                        <h4 style={{ color: '#fbbf24', fontSize: '1.2rem' }}>4. Modifications to Service</h4>
                        <p style={{ color: '#cbd5e1', lineHeight: '1.6' }}>
                            We reserve the right at any time to modify or discontinue, temporarily or permanently, the service (or any part thereof) with or without notice.
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

export default TermsOfService;
