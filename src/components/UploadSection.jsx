import React, { useRef } from 'react';
import { UploadCloud } from 'lucide-react';
import './UploadSection.css';

const UploadSection = ({ onFileSelect }) => {
    const fileInputRef = useRef(null);

    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const files = e.dataTransfer.files;
        if (files && files.length > 0 && files[0].type === 'application/pdf') {
            onFileSelect(files[0]);
        } else {
            alert("Please drop a valid PDF file.");
        }
    };

    const handleChange = (e) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            onFileSelect(files[0]);
        }
    };

    return (
        <div className="upload-container animate-fade-in">
            <div
                className="glass-panel upload-box"
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
            >
                <div className="icon-wrapper">
                    <UploadCloud size={64} className="upload-icon" />
                </div>
                <h1>Upload your PDF</h1>
                <p>Drag and drop your file here, or click to browse</p>
                <button className="btn-primary" style={{ marginTop: '2rem' }}>
                    Choose File
                </button>
                <input
                    type="file"
                    accept="application/pdf"
                    ref={fileInputRef}
                    onChange={handleChange}
                    hidden
                />
            </div>
        </div>
    );
};

// Add styles here or in index.css, sticking to one file is cleaner for components if small custom styles needed
// But let's keep it inline styling or simple class names defined in index.css or make a new css file.
// I'll add a styled-jsx approach or just standard css import if I created one.
// I will rely on the global index.css for general classes and add specific ones to App.css or a new UploadSection.css
// Let's create `src/components/UploadSection.css`? No, simpler to put in App.css or just style tag? 
// Actually I'll create `src/components/UploadSection.css`

export default UploadSection;
