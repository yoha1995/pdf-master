import React, { useState } from 'react';
import { FileText } from 'lucide-react';
import EditorSection from './components/EditorSection';
import Dashboard from './components/Dashboard';
import OrganizeSection from './components/OrganizeSection';
import EncryptSection from './components/EncryptSection';
import CompressSection from './components/CompressSection';
import SignSection from './components/SignSection';
import './App.css';

function App() {
  const [view, setView] = useState('dashboard'); // 'dashboard', 'editor', 'organize', 'encrypt'
  const [pdfFile, setPdfFile] = useState(null);
  const [fileData, setFileData] = useState(null);

  // Trigger file input
  const handleOpenPdf = (targetView = 'editor') => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/pdf';
    input.onchange = async (e) => {
      const file = e.target.files[0];
      if (file) {
        setPdfFile(file);
        const buffer = await file.arrayBuffer();
        setFileData(buffer);
        setView(targetView);
      }
    };
    input.click();
  };

  const handleCreateNew = async () => {
    // Basic valid PDF
    const blankPdfBase64 = "JVBERi0xLjcKCjEgMCBvYmogICUgZW50cnkgcG9pbnQKPDwKICAvVHlwZSAvQ2F0YWxvZwogIC9QYWdlcyAyIDAgUgo+PgRlbmRvYmoKCjIgMCBvYmoKPDwKICAvVHlwZSAvUGFnZXwKICAvTWVkaWFCb3ggWyAwIDAgNTk1LjI4IDg0MS44OSBdCiAgL0NvdW50IDEKICAvS2lkcyBbIDMgMCBSIF0KPj4KZW5kb2JqCgozIDAgb2JqCjw8CiAgL1R5cGUgL1BhZ2UKICAvUGFyZW50IDIgMCBSC4+PgRlbmRvYmoKCnhyZWYKMCA0CjAwMDAwMDAwMDAgNjU1MzUgZgpS0MDAwMDAwMDEwIDAwMDAwIG4KMDAwMDAwMDA2MCAwMDAwMCBuCjAwMDAwMDAxNTcgMDAwMDAgbgCjRyYWlsZXIKPDwKICAvU2l6ZSA0CiAgL1Jvb3QgMSAwIFIKPj4Kc3RhcnR4cmVmCjIyNQolJUVPRgo=";
    const binaryString = window.atob(blankPdfBase64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    setFileData(bytes.buffer);
    setPdfFile({ name: "Untitled.pdf" });
    setView('editor');
  };

  const navigateTo = (route) => {
    if (route === 'create') {
      handleCreateNew();
    } else if (route === 'print') {
      handleOpenPdf('editor'); // Print from editor
    } else {
      handleOpenPdf(route);
    }
  };

  const handleBackToDashboard = () => {
    setPdfFile(null);
    setFileData(null);
    setView('dashboard');
  };

  return (
    <div className="app-container">
      {view === 'dashboard' && <Dashboard onNavigate={navigateTo} />}

      {view === 'editor' && (
        <EditorSection
          fileData={fileData}
          fileName={pdfFile?.name}
          onBack={handleBackToDashboard}
        />
      )}

      {view === 'organize' && (
        <OrganizeSection
          fileData={fileData}
          fileName={pdfFile?.name}
          onBack={handleBackToDashboard}
        />
      )}

      {view === 'encrypt' && (
        <EncryptSection
          fileData={fileData}
          fileName={pdfFile?.name}
          onBack={handleBackToDashboard}
        />
      )}

      {view === 'compress' && (
        <CompressSection
          fileData={fileData}
          fileName={pdfFile?.name}
          onBack={handleBackToDashboard}
        />
      )}

      {view === 'sign' && (
        <SignSection
          fileData={fileData}
          fileName={pdfFile?.name}
          onBack={handleBackToDashboard}
        />
      )}
    </div>
  );
}

export default App;
