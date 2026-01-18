import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { FileText } from 'lucide-react';
import EditorSection from './components/EditorSection';
import Dashboard from './components/Dashboard';
import OrganizeSection from './components/OrganizeSection';
import EncryptSection from './components/EncryptSection';
import CompressSection from './components/CompressSection';
import SignSection from './components/SignSection';
import PrivacyPolicy from './components/PrivacyPolicy';
import TermsOfService from './components/TermsOfService';
import AboutUs from './components/AboutUs';
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
      {view === 'dashboard' && (
        <>
          <Helmet>
            <title>PDF Master - Online PDF Dashboard</title>
            <meta name="description" content="Access all your PDF tools in one place. Edit, compress, sign, and organize your PDF files with PDF Master's dashboard." />
          </Helmet>
          <Dashboard onNavigate={navigateTo} />
        </>
      )}

      {view === 'editor' && (
        <>
          <Helmet>
            <title>Edit PDF - PDF Master</title>
            <meta name="description" content="Edit your PDF files online with our powerful and easy-to-use editor. Add text, images, and more." />
          </Helmet>
          <EditorSection
            fileData={fileData}
            fileName={pdfFile?.name}
            onBack={handleBackToDashboard}
          />
        </>
      )}

      {view === 'organize' && (
        <>
          <Helmet>
            <title>Organize PDF - PDF Master</title>
            <meta name="description" content="Organize your PDF pages effortlessly. Merge, split, or reorder pages in your PDF files." />
          </Helmet>
          <OrganizeSection
            fileData={fileData}
            fileName={pdfFile?.name}
            onBack={handleBackToDashboard}
          />
        </>
      )}

      {view === 'encrypt' && (
        <>
          <Helmet>
            <title>Encrypt PDF - PDF Master</title>
            <meta name="description" content="Secure your PDF files with password protection. Encrypt your documents and keep them safe." />
          </Helmet>
          <EncryptSection
            fileData={fileData}
            fileName={pdfFile?.name}
            onBack={handleBackToDashboard}
          />
        </>
      )}

      {view === 'compress' && (
        <>
          <Helmet>
            <title>Compress PDF - PDF Master</title>
            <meta name="description" content="Reduce the file size of your PDFs without losing quality. Optimize your documents for sharing." />
          </Helmet>
          <CompressSection
            fileData={fileData}
            fileName={pdfFile?.name}
            onBack={handleBackToDashboard}
          />
        </>
      )}

      {view === 'sign' && (
        <>
          <Helmet>
            <title>Sign PDF - PDF Master</title>
            <meta name="description" content="Sign your PDF documents electronically. Fast, secure, and legally binding digital signatures." />
          </Helmet>
          <SignSection
            fileData={fileData}
            fileName={pdfFile?.name}
            onBack={handleBackToDashboard}
          />
        </>
      )}

      {view === 'privacy' && (
        <PrivacyPolicy onBack={handleBackToDashboard} />
      )}

      {view === 'terms' && (
        <TermsOfService onBack={handleBackToDashboard} />
      )}

      {view === 'about' && (
        <AboutUs onBack={handleBackToDashboard} />
      )}
    </div>
  );
}

export default App;
