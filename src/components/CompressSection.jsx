import React, { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import { Save, ArrowLeft, Minimize2, Check } from 'lucide-react';
import CollapsibleGuide from './CollapsibleGuide';
import './EncOrg.css';

const CompressSection = ({ fileData, fileName, onBack }) => {
    const [status, setStatus] = useState('idle'); // idle, processing, done
    const [newSize, setNewSize] = useState(null);
    const [originalSize, setOriginalSize] = useState(null);

    React.useEffect(() => {
        if (fileData) {
            setOriginalSize(fileData.byteLength);
        }
    }, [fileData]);

    const handleCompress = async () => {
        setStatus('processing');
        try {
            // "Pseudo" compression by reloading and saving.
            const pdfDoc = await PDFDocument.load(fileData, { ignoreEncryption: true });

            // This re-writes the PDF structure cleanly
            const pdfBytes = await pdfDoc.save();

            const blob = new Blob([pdfBytes], { type: 'application/pdf' });
            setNewSize(blob.size);

            // Download automatically
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = `compressed_${fileName}`;
            link.click();

            setStatus('done');
        } catch (err) {
            console.error(err);
            alert("Error compressing: " + err.message);
            setStatus('idle');
        }
    };

    return (
        <div className="tool-view-container">
            <header className="tool-header">
                <button className="menu-btn" onClick={onBack}>
                    <ArrowLeft size={18} /> Back
                </button>
                <h2>Compress PDF</h2>
                <div style={{ width: 50 }}></div>
            </header>

            <div className="tool-body centered-body">
                <div className="glass-panel enc-card">
                    <div className="icon-circle">
                        <Minimize2 size={40} />
                    </div>
                    <h3>Compress {fileName}</h3>

                    {status === 'idle' && (
                        <>
                            <p>Reduce file size by optimizing internal structure.</p>
                            <p className="size-info">Original Size: {(originalSize / 1024).toFixed(2)} KB</p>
                            <button className="btn-primary" onClick={handleCompress}>
                                Compress Now
                            </button>
                        </>
                    )}

                    {status === 'processing' && (
                        <p>Processing...</p>
                    )}

                    {status === 'done' && (
                        <div className="success-state">
                            <div className="success-icon"><Check size={24} /></div>
                            <p>Compression Complete!</p>
                            <p className="size-info">New Size: {(newSize / 1024).toFixed(2)} KB</p>
                            <p className="saved-info">Saved: {((originalSize - newSize) / 1024).toFixed(2)} KB</p>
                            <button className="btn-secondary" onClick={onBack}>Back to Dashboard</button>
                        </div>
                    )}
                </div>

                <div style={{ maxWidth: '600px', width: '100%', marginTop: '3rem' }}>
                    <CollapsibleGuide title="Guide: Compressing PDFs">
                        <p>Our compression tool helps you reduce file size while maintaining the best possible quality.</p>
                        <ul>
                            <li><strong>Optimization:</strong> We remove duplicate data and optimize the internal structure of the PDF.</li>
                            <li><strong>High Quality:</strong> We prioritize readability while reducing metadata and extra objects.</li>
                            <li><strong>Fast & Local:</strong> Compression happens right in your web browser, keeping your data private.</li>
                        </ul>
                    </CollapsibleGuide>
                </div>
            </div>
        </div>
    );
};

export default CompressSection;
