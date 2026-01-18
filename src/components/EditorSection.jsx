import React, { useState, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { PDFDocument, rgb, degrees, StandardFonts } from 'pdf-lib';
import {
    Save, Type, RotateCw, X, ArrowLeft, Image as ImageIcon, Eraser,
    Link, Minimize2, MousePointer, LayoutGrid, Printer
} from 'lucide-react';
import AdUnit from './AdUnit';
import CollapsibleGuide from './CollapsibleGuide';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import './EditorSection.css';

// Set worker
pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

const EditorSection = ({ fileData, fileName, onBack }) => {
    const [numPages, setNumPages] = useState(null);
    const [scale, setScale] = useState(1.0);
    const [pageDimensions, setPageDimensions] = useState({}); // { pageIndex: { width, height } }
    const [error, setError] = useState(null);

    // Editing States
    const [textFields, setTextFields] = useState([]);
    const [images, setImages] = useState([]);
    const [erasures, setErasures] = useState([]);
    const [pageRotations, setPageRotations] = useState({});

    // Selection
    const [selectedId, setSelectedId] = useState(null);
    const [selectedType, setSelectedType] = useState(null);

    // Sidebar
    const [activeSidebar, setActiveSidebar] = useState('thumbnails'); // thumbnails | layers

    const onDocumentLoadSuccess = ({ numPages }) => {
        setNumPages(numPages);
        setError(null);
    };

    const onDocumentLoadError = (err) => {
        console.error('PDF Load Error:', err);
        setError(err.message);
    };

    const handlePageLoadSuccess = (page, pageIndex) => {
        setPageDimensions(prev => ({
            ...prev,
            [pageIndex]: {
                width: page.originalWidth,
                height: page.originalHeight
            }
        }));
    };

    // --- Actions ---

    const handleRotatePage = (pageIndex) => {
        setPageRotations(prev => ({
            ...prev,
            [pageIndex]: ((prev[pageIndex] || 0) + 90) % 360
        }));
    };

    const addTextField = () => {
        const id = Date.now().toString();
        setTextFields([
            ...textFields,
            {
                id,
                text: 'New Text',
                pageIndex: 0,
                uiX: 50,
                uiY: 50,
                fontSize: 18,
            }
        ]);
        setSelectedId(id);
        setSelectedType('text');
    };

    const addEraser = () => {
        const id = Date.now().toString();
        setErasures([
            ...erasures,
            {
                id,
                pageIndex: 0,
                uiX: 100,
                uiY: 100,
                width: 150,
                height: 50
            }
        ]);
        setSelectedId(id);
        setSelectedType('eraser');
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const id = Date.now().toString();
            const img = new Image();
            img.onload = () => {
                let w = img.width;
                let h = img.height;
                if (w > 200) {
                    const ratio = 200 / w;
                    w = 200;
                    h = h * ratio;
                }

                setImages([
                    ...images,
                    {
                        id,
                        dataUrl: event.target.result,
                        pageIndex: 0,
                        uiX: 50,
                        uiY: 200,
                        width: w,
                        height: h
                    }
                ]);
                setSelectedId(id);
                setSelectedType('image');
            };
            img.src = event.target.result;
        };
        reader.readAsDataURL(file);
    };

    const deleteItem = () => {
        if (!selectedId) return;
        if (selectedType === 'text') setTextFields(textFields.filter(i => i.id !== selectedId));
        if (selectedType === 'image') setImages(images.filter(i => i.id !== selectedId));
        if (selectedType === 'eraser') setErasures(erasures.filter(i => i.id !== selectedId));
        setSelectedId(null);
        setSelectedType(null);
    };

    const updateItem = (id, type, updates) => {
        if (type === 'text') {
            setTextFields(items => items.map(i => i.id === id ? { ...i, ...updates } : i));
        } else if (type === 'image') {
            setImages(items => items.map(i => i.id === id ? { ...i, ...updates } : i));
        } else if (type === 'eraser') {
            setErasures(items => items.map(i => i.id === id ? { ...i, ...updates } : i));
        }
    };

    // --- Drag Logic ---
    const handlePointerDown = (e, id, type) => {
        e.stopPropagation();
        setSelectedId(id);
        setSelectedType(type);

        const elem = e.currentTarget;
        const rect = elem.getBoundingClientRect();
        const offsetX = e.clientX - rect.left;
        const offsetY = e.clientY - rect.top;

        const isResizeMap = (e.clientX - rect.right > -20 && e.clientY - rect.bottom > -20);

        const handlePointerMove = (moveEvent) => {
            const pageContainer = elem.parentElement;
            const containerRect = pageContainer.getBoundingClientRect();

            if (isResizeMap && (type === 'image' || type === 'eraser')) {
                const newWidth = Math.max(20, moveEvent.clientX - rect.left);
                const newHeight = Math.max(20, moveEvent.clientY - rect.top);
                updateItem(id, type, { width: newWidth, height: newHeight });
            } else {
                let newX = moveEvent.clientX - containerRect.left - offsetX;
                let newY = moveEvent.clientY - containerRect.top - offsetY;
                newX = Math.max(-50, Math.min(newX, containerRect.width - 10));
                newY = Math.max(-50, Math.min(newY, containerRect.height - 10));
                updateItem(id, type, { uiX: newX, uiY: newY });
            }
        };

        const handlePointerUp = () => {
            window.removeEventListener('pointermove', handlePointerMove);
            window.removeEventListener('pointerup', handlePointerUp);
        };

        window.addEventListener('pointermove', handlePointerMove);
        window.addEventListener('pointerup', handlePointerUp);
    };


    // Prevent buffer detachment by pdfjs worker
    const pdfSource = React.useMemo(() => {
        if (!fileData) return null;
        return { data: fileData.slice(0) };
    }, [fileData]);

    const generateEditedPdfBytes = async () => {
        // Always work on a copy to avoid detachment issues
        const pdfDoc = await PDFDocument.load(fileData.slice(0));
        const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
        const pages = pdfDoc.getPages();

        erasures.forEach(er => {
            const page = pages[er.pageIndex];
            if (!page) return;
            const { height } = page.getSize();
            const pdfY = height - (er.uiY / scale) - (er.height / scale);
            page.drawRectangle({
                x: er.uiX / scale,
                y: pdfY,
                width: er.width / scale,
                height: er.height / scale,
                color: rgb(1, 1, 1),
            });
        });

        for (const img of images) {
            const page = pages[img.pageIndex];
            if (!page) continue;
            const { height } = page.getSize();
            let embeddedImage;
            if (img.dataUrl.startsWith('data:image/png')) {
                embeddedImage = await pdfDoc.embedPng(img.dataUrl);
            } else {
                embeddedImage = await pdfDoc.embedJpg(img.dataUrl);
            }
            const pdfY = height - (img.uiY / scale) - (img.height / scale);
            page.drawImage(embeddedImage, {
                x: img.uiX / scale,
                y: pdfY,
                width: img.width / scale,
                height: img.height / scale,
            });
        }

        textFields.forEach(field => {
            const page = pages[field.pageIndex];
            if (!page) return;
            const { height } = page.getSize();
            const pdfY = height - (field.uiY / scale) - (12);
            page.drawText(field.text, {
                x: field.uiX / scale,
                y: pdfY,
                size: 18,
                color: rgb(0, 0, 0),
                font: helveticaFont
            });
        });

        Object.entries(pageRotations).forEach(([pageIndex, angle]) => {
            const page = pages[parseInt(pageIndex)];
            if (page) {
                const currentRot = page.getRotation().angle;
                page.setRotation(degrees(currentRot + angle));
            }
        });

        return await pdfDoc.save();
    };

    const handlePrint = async () => {
        try {
            const pdfBytes = await generateEditedPdfBytes();
            const blob = new Blob([pdfBytes], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);

            const iframe = document.createElement('iframe');
            iframe.style.display = 'none';
            iframe.src = url;
            document.body.appendChild(iframe);
            iframe.onload = () => {
                iframe.contentWindow.print();
            };
        } catch (err) {
            console.error(err);
            alert('Error printing PDF: ' + err.message);
        }
    };

    const savePdf = async () => {
        try {
            const pdfBytes = await generateEditedPdfBytes();
            const blob = new Blob([pdfBytes], { type: 'application/pdf' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = `edited_${fileName}`;
            link.click();
        } catch (err) {
            console.error(err);
            alert('Error saving PDF: ' + err.message);
        }
    };

    return (
        <div className="editor-shell">
            {/* Top Ribbon */}
            <header className="editor-header">
                <div className="menu-left">
                    <button className="menu-btn" onClick={onBack} title="Back to Dashboard">
                        <ArrowLeft size={18} />
                    </button>
                    <span className="file-name">{fileName || 'Untitled.pdf'}</span>
                </div>

                <div className="toolbar-center">
                    <button className="tool-btn active">
                        <MousePointer size={16} /> Edit All
                    </button>
                    <button className="tool-btn" onClick={addTextField}>
                        <Type size={16} /> Add Text
                    </button>
                    <label className="tool-btn">
                        <ImageIcon size={16} /> Add Image
                        <input type="file" accept="image/*" hidden onChange={handleImageUpload} />
                    </label>
                    <button className="tool-btn" onClick={addEraser}>
                        <Eraser size={16} /> Eraser
                    </button>

                    <div className="divider" />

                    <button className="tool-btn" onClick={deleteItem} disabled={!selectedId}>
                        <X size={16} /> Delete
                    </button>
                    <button className="tool-btn" onClick={handlePrint}>
                        <Printer size={16} /> Print
                    </button>
                    <button className="tool-btn" disabled>
                        <Minimize2 size={16} /> Compress
                    </button>
                </div>

                <div className="menu-right">
                    <button className="save-btn" onClick={savePdf}>
                        <Save size={16} /> Save
                    </button>
                </div>
            </header>

            <div className="editor-body">
                {/* Left Sidebar */}
                <div className="editor-sidebar">
                    <div className="sidebar-header">
                        <span>Thumbnails</span>
                        <div className="sidebar-controls">
                            <X size={14} className="close-icon" />
                        </div>
                    </div>
                    <div className="thumbnails-list">
                        {Array.from(new Array(numPages || 0), (el, index) => (
                            <div key={index} className="thumbnail-item">
                                <div className="thumb-preview">
                                    <LayoutGrid size={24} color="#64748b" />
                                </div>
                                <span>{index + 1}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Main Viewport */}
                <div className="pdf-viewport">
                    <Document
                        file={pdfSource}
                        onLoadSuccess={onDocumentLoadSuccess}
                        onLoadError={onDocumentLoadError}
                        className="pdf-document"
                    >
                        {error && (
                            <div className="error-banner">Error loading PDF: {error}</div>
                        )}
                        {Array.from(new Array(numPages), (el, index) => (
                            <div key={`page_${index}`} className="page-wrapper">
                                <div className="page-controls">
                                    <span className="page-label">Page {index + 1}</span>
                                    <button className="rotate-btn" onClick={() => handleRotatePage(index)} title="Rotate">
                                        <RotateCw size={14} />
                                    </button>
                                </div>

                                <div
                                    className="page-container"
                                    style={{
                                        position: 'relative',
                                        transform: `rotate(${pageRotations[index] || 0}deg)`,
                                        transition: 'transform 0.3s ease'
                                    }}
                                >
                                    <Page
                                        pageNumber={index + 1}
                                        scale={scale}
                                        onLoadSuccess={(page) => handlePageLoadSuccess(page, index)}
                                        renderTextLayer={false}
                                    />

                                    {/* Layers for Erasers, Images, Text */}
                                    {erasures.filter(i => i.pageIndex === index).map(item => (
                                        <div
                                            key={item.id}
                                            className={`item-overlay eraser ${selectedId === item.id ? 'selected' : ''}`}
                                            style={{ left: item.uiX, top: item.uiY, width: item.width, height: item.height }}
                                            onPointerDown={(e) => handlePointerDown(e, item.id, 'eraser')}
                                        >
                                            <div className="resize-handle" />
                                        </div>
                                    ))}

                                    {images.filter(i => i.pageIndex === index).map(item => (
                                        <div
                                            key={item.id}
                                            className={`item-overlay image ${selectedId === item.id ? 'selected' : ''}`}
                                            style={{ left: item.uiX, top: item.uiY, width: item.width, height: item.height }}
                                            onPointerDown={(e) => handlePointerDown(e, item.id, 'image')}
                                        >
                                            <img src={item.dataUrl} alt="added" style={{ width: '100%', height: '100%' }} draggable={false} />
                                            <div className="resize-handle" />
                                        </div>
                                    ))}

                                    {textFields.filter(f => f.pageIndex === index).map(field => (
                                        <div
                                            key={field.id}
                                            className={`item-overlay text ${selectedId === field.id ? 'selected' : ''}`}
                                            style={{ left: field.uiX, top: field.uiY, minWidth: '100px' }}
                                            onPointerDown={(e) => handlePointerDown(e, field.id, 'text')}
                                        >
                                            <input
                                                value={field.text}
                                                onChange={(e) => updateItem(field.id, 'text', { text: e.target.value })}
                                                style={{ fontSize: '18px', color: 'black' }}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}

                        <div className="editor-ad-container">
                            <AdUnit style={{ width: '100%', maxWidth: '728px', minHeight: '90px' }} />
                        </div>

                        <div className="editor-guide-container" style={{ maxWidth: '800px', margin: '2rem auto', padding: '0 1rem' }}>
                            <CollapsibleGuide title="Editor Quick Help">
                                <p>Welcome to the PDF Master Editor. Here's how to use the tools:</p>
                                <ul>
                                    <li><strong>Text Tool:</strong> Click anywhere on the PDF to add new text.</li>
                                    <li><strong>Image Tool:</strong> Upload and place images over your document.</li>
                                    <li><strong>Eraser/Whiteout:</strong> Hide sensitive information by drawing white boxes.</li>
                                    <li><strong>Rotate:</strong> Turn pages 90 degrees clockwise.</li>
                                    <li><strong>Save:</strong> All changes are applied and a new PDF is generated for download.</li>
                                </ul>
                            </CollapsibleGuide>
                        </div>
                    </Document>
                </div>
            </div>
        </div>
    );
};

export default EditorSection;
