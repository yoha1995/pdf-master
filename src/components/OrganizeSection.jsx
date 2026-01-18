import React, { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { PDFDocument } from 'pdf-lib';
import { Save, ArrowLeft, Trash2, ArrowUp, ArrowDown } from 'lucide-react';
import AdUnit from './AdUnit';
import CollapsibleGuide from './CollapsibleGuide';
import './EncOrg.css';

pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

const OrganizeSection = ({ fileData, fileName, onBack }) => {
    const [numPages, setNumPages] = useState(null);
    const [pages, setPages] = useState([]); // [{ pageIndex: 0, removed: false, originalIndex: 0 }]

    // We can't easily reorder visually with react-pdf unless we render each page.
    // For large PDFs, rendering thumbnails for "Organize" is heavy.
    // We will render small thumbnails.

    const onDocumentLoadSuccess = ({ numPages }) => {
        setNumPages(numPages);
        setPages(Array.from(new Array(numPages), (_, i) => ({
            id: i,
            originalIndex: i,
            removed: false
        })));
    };

    const handleRemove = (index) => {
        setPages(ws => ws.map((p, i) => i === index ? { ...p, removed: !p.removed } : p));
    };

    const movePage = (index, direction) => {
        // Simple swap logic
        if (direction === -1 && index > 0) {
            const newPages = [...pages];
            const temp = newPages[index - 1];
            newPages[index - 1] = newPages[index];
            newPages[index] = temp;
            setPages(newPages);
        } else if (direction === 1 && index < pages.length - 1) {
            const newPages = [...pages];
            const temp = newPages[index + 1];
            newPages[index + 1] = newPages[index];
            newPages[index] = temp;
            setPages(newPages);
        }
    };

    const saveOrganized = async () => {
        try {
            const pdfDoc = await PDFDocument.load(fileData);
            const newPdf = await PDFDocument.create();

            // Allow copying pages
            // We need to map our current 'pages' state to the indices of the original doc
            const indicesToCopy = pages.filter(p => !p.removed).map(p => p.originalIndex);

            if (indicesToCopy.length > 0) {
                const copiedPages = await newPdf.copyPages(pdfDoc, indicesToCopy);
                copiedPages.forEach(p => newPdf.addPage(p));
            } else {
                alert("Cannot save empty PDF");
                return;
            }

            const pdfBytes = await newPdf.save();
            const blob = new Blob([pdfBytes], { type: 'application/pdf' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = `organized_${fileName}`;
            link.click();

        } catch (err) {
            console.error(err);
            alert("Error saving: " + err.message);
        }
    };

    return (
        <div className="tool-view-container">
            <header className="tool-header">
                <button className="menu-btn" onClick={onBack}>
                    <ArrowLeft size={18} /> Back
                </button>
                <h2>Organize Pages</h2>
                <button className="save-btn" onClick={saveOrganized}>
                    <Save size={16} /> Save
                </button>
            </header>

            <div className="tool-body">
                <Document
                    file={fileData}
                    onLoadSuccess={onDocumentLoadSuccess}
                    className="pdf-document-hidden" // Only for loading context
                >
                    <div className="organize-grid">
                        {pages.map((page, index) => (
                            <div key={page.id} className={`org-page-card ${page.removed ? 'removed' : ''}`}>
                                <div className="org-thumb-wrapper">
                                    <Page
                                        pageNumber={page.originalIndex + 1}
                                        width={150}
                                        renderTextLayer={false}
                                        renderAnnotationLayer={false}
                                    />
                                    {page.removed && <div className="removed-overlay">REMOVED</div>}
                                </div>
                                <div className="org-controls">
                                    <span>Page {page.originalIndex + 1}</span>
                                    <div className="org-actions">
                                        <button onClick={() => movePage(index, -1)} disabled={index === 0}><ArrowLeft size={14} /></button>
                                        <button onClick={() => movePage(index, 1)} disabled={index === pages.length - 1}><ArrowLeft size={14} style={{ transform: 'rotate(180deg)' }} /></button>
                                        <button className="del-btn" onClick={() => handleRemove(index)}>
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </Document>

                <div style={{ marginTop: '3rem', display: 'flex', justifyContent: 'center' }}>
                    <AdUnit style={{ height: '90px', maxWidth: '728px', width: '100%' }} />
                </div>

                <div style={{ maxWidth: '800px', margin: '2rem auto' }}>
                    <CollapsibleGuide title="How to Organize Pages">
                        <p>Easily manage your document structure:</p>
                        <ul>
                            <li><strong>Move:</strong> Use the Left/Right arrows to change page sequence.</li>
                            <li><strong>Delete:</strong> Click the trash icon to mark a page for removal (it will be highlighted red).</li>
                            <li><strong>Save:</strong> Click Save to generate and download your new organized PDF.</li>
                        </ul>
                    </CollapsibleGuide>
                </div>
            </div>
        </div>
    );
};

export default OrganizeSection;
