import React, { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import { Save, ArrowLeft, Lock } from 'lucide-react';
import CollapsibleGuide from './CollapsibleGuide';
import './EncOrg.css';

const EncryptSection = ({ fileData, fileName, onBack }) => {
    // ... rest of the logic ...
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleEncrypt = async () => {
        if (!password) {
            alert('Please enter a password');
            return;
        }
        setLoading(true);
        try {
            const { encrypt } = await import('@pdfsmaller/pdf-encrypt-lite');

            // Ensure we have Uint8Array for the encryption library
            const inputBytes = new Uint8Array(fileData);

            const encryptedBytes = await encrypt(inputBytes, {
                userPassword: password,
                ownerPassword: password,
                permissions: {
                    printing: 'highResolution',
                    modifying: false,
                    copying: false,
                    annotating: false,
                    fillingForms: false,
                    contentAccessibility: false,
                    documentAssembly: false,
                }
            });

            const blob = new Blob([encryptedBytes], { type: 'application/pdf' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = `encrypted_${fileName}`;
            link.click();
        } catch (err) {
            console.error(err);
            alert("Error encrypting: " + err.message);
        }
        setLoading(false);
    };

    return (
        <div className="tool-view-container">
            <header className="tool-header">
                <button className="menu-btn" onClick={onBack}>
                    <ArrowLeft size={18} /> Back
                </button>
                <h2>Encrypt PDF</h2>
                <div style={{ width: 50 }}></div>
            </header>

            <div className="tool-body centered-body">
                <div className="glass-panel enc-card">
                    <div className="icon-circle">
                        <Lock size={40} />
                    </div>
                    <h3>Protect {fileName}</h3>
                    <p>Enter a password to encrypt this file.</p>

                    <input
                        type="password"
                        placeholder="Enter Password"
                        className="password-input"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <button className="btn-primary" onClick={handleEncrypt} disabled={loading}>
                        {loading ? 'Encrypting...' : 'Protect PDF'}
                    </button>
                </div>

                <div style={{ maxWidth: '600px', width: '100%', marginTop: '3rem' }}>
                    <CollapsibleGuide title="Guide: Protecting your PDF">
                        <p>Encrypting your PDF adds a layer of security to your documents.</p>
                        <ul>
                            <li><strong>User Password:</strong> Required by anyone who wants to open the document.</li>
                            <li><strong>Permissions:</strong> Our tool automatically restricts copying and editing when you set a password.</li>
                            <li><strong>Privacy:</strong> Encryption happens locally in your browser. Your password is never sent to our servers.</li>
                        </ul>
                    </CollapsibleGuide>
                </div>
            </div>
        </div>
    );
};

export default EncryptSection;
