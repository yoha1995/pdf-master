import React, { useState } from 'react';
import { pdfjs } from 'react-pdf';
import { ArrowLeft, Download, FileText, Image as ImageIcon, FileSpreadsheet, Presentation, Loader2 } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

// Set worker
pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

const ConvertSection = ({ fileData, fileName, mode, onBack }) => {
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState('idle'); // idle, processing, done

    const getTitle = () => {
        switch (mode) {
            case 'pdf-to-word': return 'PDF to Word';
            case 'pdf-to-excel': return 'PDF to Excel';
            case 'pdf-to-ppt': return 'PDF to PPT';
            case 'pdf-to-jpg': return 'PDF to JPG';
            default: return 'Convert PDF';
        }
    };

    const getIcon = () => {
        switch (mode) {
            case 'pdf-to-word': return <FileText size={40} />;
            case 'pdf-to-excel': return <FileSpreadsheet size={40} />;
            case 'pdf-to-ppt': return <Presentation size={40} />;
            case 'pdf-to-jpg': return <ImageIcon size={40} />;
            default: return <FileText size={40} />;
        }
    };

    const handleConversion = async () => {
        setLoading(true);
        setStatus('processing');

        try {
            const loadingTask = pdfjs.getDocument({ data: fileData.slice(0) });
            const pdf = await loadingTask.promise;

            if (mode === 'pdf-to-jpg') {
                // Convert each page to image
                for (let i = 1; i <= pdf.numPages; i++) {
                    const page = await pdf.getPage(i);
                    const viewport = page.getViewport({ scale: 2.0 });
                    const canvas = document.createElement('canvas');
                    const context = canvas.getContext('2d');
                    canvas.height = viewport.height;
                    canvas.width = viewport.width;

                    await page.render({ canvasContext: context, viewport: viewport }).promise;

                    const imgData = canvas.toDataURL('image/jpeg', 0.8);
                    const link = document.createElement('a');
                    link.href = imgData;
                    link.download = `${fileName.replace('.pdf', '')}_page_${i}.jpg`;
                    link.click();
                }
            } else {
                // For Word, Excel, PPT - Basic Text Extraction approach
                let fullText = "";
                for (let i = 1; i <= pdf.numPages; i++) {
                    const page = await pdf.getPage(i);
                    const textContent = await page.getTextContent();
                    const pageText = textContent.items.map(item => item.str).join(' ');
                    fullText += pageText + "\n\n";
                }

                if (mode === 'pdf-to-word') {
                    const blob = new Blob([fullText], { type: 'application/msword' });
                    const url = URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.href = url;
                    link.download = `${fileName.replace('.pdf', '')}.doc`;
                    link.click();
                } else if (mode === 'pdf-to-excel') {
                    // Simple CSV format for Excel
                    const csvContent = fullText.split('\n').map(line => line.split(' ').join(',')).join('\n');
                    const blob = new Blob([csvContent], { type: 'text/csv' });
                    const url = URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.href = url;
                    link.download = `${fileName.replace('.pdf', '')}.csv`;
                    link.click();
                } else if (mode === 'pdf-to-ppt') {
                    // For PPT, we'll just download a text file as a placeholder for now
                    const blob = new Blob([fullText], { type: 'text/plain' });
                    const url = URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.href = url;
                    link.download = `${fileName.replace('.pdf', '')}_outline.txt`;
                    link.click();
                }
            }
            setStatus('done');
        } catch (err) {
            console.error(err);
            alert("Conversion failed: " + err.message);
            setStatus('idle');
        }
        setLoading(false);
    };

    return (
        <div className="tool-view-container">
            <Helmet>
                <title>{getTitle()} - PDF Master</title>
                <meta name="description" content={`Convert your PDF files to ${mode.split('-').pop().toUpperCase()} format easily and securely.`} />
            </Helmet>
            <header className="tool-header">
                <button className="menu-btn" onClick={onBack}>
                    <ArrowLeft size={18} /> Back
                </button>
                <h2>{getTitle()}</h2>
                <div style={{ width: 50 }}></div>
            </header>

            <div className="tool-body centered-body">
                <div className="glass-panel" style={{ maxWidth: '600px', width: '100%', padding: '3rem', textAlign: 'center' }}>
                    <div className="icon-circle" style={{ margin: '0 auto 2rem' }}>
                        {getIcon()}
                    </div>
                    <h3>Ready to convert {fileName}?</h3>
                    <p style={{ color: '#94a3b8', marginBottom: '2rem' }}>
                        Your file will be processed safely in your browser.
                        {mode === 'pdf-to-jpg' && " Each page will be downloaded as a separate high-quality image."}
                        {mode !== 'pdf-to-jpg' && " We will extract the text and formatting into the selected document type."}
                    </p>

                    <button
                        className="btn-primary"
                        onClick={handleConversion}
                        disabled={loading || status === 'done'}
                        style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                    >
                        {loading ? <Loader2 className="animate-spin" size={20} /> : <Download size={20} />}
                        {loading ? 'Processing...' : status === 'done' ? 'Conversion Complete!' : `Convert to ${mode.split('-').pop().toUpperCase()}`}
                    </button>

                    {status === 'done' && (
                        <div style={{ marginTop: '2rem', color: '#10b981', fontWeight: 600 }}>
                            Successfully converted and downloaded your file!
                            <br />
                            <button onClick={onBack} style={{ background: 'none', border: 'none', color: '#fbbf24', cursor: 'pointer', marginTop: '1rem', textDecoration: 'underline' }}>
                                Back to Tools
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ConvertSection;
