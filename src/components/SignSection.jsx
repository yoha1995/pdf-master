import React, { useState, useRef, useEffect } from 'react';
import { PDFDocument } from 'pdf-lib';
import { Save, ArrowLeft, PenTool, Eraser, Download, X } from 'lucide-react';
import CollapsibleGuide from './CollapsibleGuide';
import './EncOrg.css';

const SignSection = ({ fileData, fileName, onBack }) => {
    const [status, setStatus] = useState('idle');
    const [loading, setLoading] = useState(false);
    const canvasRef = useRef(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [hasSignature, setHasSignature] = useState(false);

    useEffect(() => {
        if (canvasRef.current) {
            const ctx = canvasRef.current.getContext('2d');
            ctx.strokeStyle = '#000000';
            ctx.lineWidth = 2;
            ctx.lineCap = 'round';
        }
    }, [status]);

    const startDrawing = (e) => {
        const rect = canvasRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const ctx = canvasRef.current.getContext('2d');
        ctx.beginPath();
        ctx.moveTo(x, y);
        setIsDrawing(true);
    };

    const draw = (e) => {
        if (!isDrawing) return;
        const rect = canvasRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const ctx = canvasRef.current.getContext('2d');
        ctx.lineTo(x, y);
        ctx.stroke();
        setHasSignature(true);
    };

    const endDrawing = () => {
        setIsDrawing(false);
    };

    const clearCanvas = () => {
        const ctx = canvasRef.current.getContext('2d');
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        setHasSignature(false);
    };

    const handleSignPDF = async () => {
        if (!hasSignature) {
            alert("Please draw your signature first.");
            return;
        }

        setLoading(true);
        try {
            const pdfDoc = await PDFDocument.load(fileData);
            const signatureDataUrl = canvasRef.current.toDataURL('image/png');
            const signatureImage = await pdfDoc.embedPng(signatureDataUrl);

            const pages = pdfDoc.getPages();
            const lastPage = pages[pages.length - 1]; // Sign the last page by default
            const { width, height } = lastPage.getSize();

            // Draw signature in bottom right corner
            const sigWidth = 150;
            const sigHeight = (sigWidth / canvasRef.current.width) * canvasRef.current.height;

            lastPage.drawImage(signatureImage, {
                x: width - sigWidth - 50,
                y: 50,
                width: sigWidth,
                height: sigHeight,
            });

            const pdfBytes = await pdfDoc.save();
            const blob = new Blob([pdfBytes], { type: 'application/pdf' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = `signed_${fileName}`;
            link.click();

            setStatus('done');
        } catch (err) {
            console.error(err);
            alert("Error signing PDF: " + err.message);
        }
        setLoading(false);
    };

    return (
        <div className="tool-view-container">
            <header className="tool-header">
                <button className="menu-btn" onClick={onBack}>
                    <ArrowLeft size={18} /> Back
                </button>
                <h2>Sign PDF</h2>
                <div style={{ width: 50 }}></div>
            </header>

            <div className="tool-body centered-body">
                <div className="glass-panel sign-card" style={{ maxWidth: '600px', width: '100%' }}>
                    <div className="icon-circle">
                        <PenTool size={40} />
                    </div>
                    <h3>Add Signature to {fileName}</h3>

                    <div className="signature-pad-container" style={{ margin: '2rem 0', background: 'white', borderRadius: '8px', border: '2px dashed #cbd5e1' }}>
                        <p style={{ color: '#64748b', fontSize: '0.8rem', padding: '0.5rem', margin: 0 }}>Draw your signature below:</p>
                        <canvas
                            ref={canvasRef}
                            width={500}
                            height={200}
                            style={{ width: '100%', cursor: 'crosshair', touchAction: 'none' }}
                            onMouseDown={startDrawing}
                            onMouseMove={draw}
                            onMouseUp={endDrawing}
                            onMouseLeave={endDrawing}
                        />
                        <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '0.5rem', gap: '1rem', borderTop: '1px solid #e2e8f0' }}>
                            <button className="btn-small" onClick={clearCanvas} style={{ background: '#f1f5f9', color: '#475569', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                                <Eraser size={14} /> Clear
                            </button>
                        </div>
                    </div>

                    <p style={{ fontSize: '0.9rem', color: '#94a3b8', marginBottom: '1.5rem' }}>
                        Your signature will be placed on the <strong>bottom right</strong> of the <strong>last page</strong>.
                    </p>

                    <button className="btn-primary" onClick={handleSignPDF} disabled={loading || !hasSignature}>
                        {loading ? 'Processing...' : 'Sign & Download PDF'}
                    </button>

                    {status === 'done' && (
                        <p style={{ color: '#10b981', marginTop: '1rem', fontWeight: 600 }}>Successfully signed and downloaded!</p>
                    )}
                </div>

                <div style={{ maxWidth: '600px', width: '100%', marginTop: '3rem' }}>
                    <CollapsibleGuide title="Guide: Signing PDFs">
                        <p>Our secure signing tool allows you to add handwritten-style signatures without printing.</p>
                        <ul>
                            <li><strong>Draw naturally:</strong> Use your mouse or touch screen to draw your signature.</li>
                            <li><strong>Placement:</strong> For now, signatures are placed on the last page. Full drag-and-drop placement coming soon.</li>
                            <li><strong>Privacy:</strong> Like all our tools, the signing process happens entirely in your browser.</li>
                        </ul>
                    </CollapsibleGuide>
                </div>
            </div>
        </div>
    );
};

export default SignSection;
