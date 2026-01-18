import React, { useState } from 'react';
import { FileText, Layers, Zap, FilePlus, Printer, Lock, BookOpen, Star, FileType, Image as ImageIcon, FileSpreadsheet, Presentation, PenTool, ArrowLeft } from 'lucide-react';
import AdUnit from './AdUnit';
import CollapsibleGuide from './CollapsibleGuide';
import './Dashboard.css';

const ToolCard = ({ icon: Icon, title, desc, onClick, badge }) => (
    <div className="tool-card" onClick={onClick}>
        <div className="tool-card-content">
            <div className="tool-icon-wrapper">
                <Icon size={24} className="tool-icon" />
            </div>
            <div className="tool-info">
                <h3>{title}</h3>
                <p>{desc}</p>
            </div>
        </div>
        {badge && <span className="tool-badge">{badge}</span>}
    </div>
);

const Dashboard = ({ onNavigate }) => {
    const [activeArticle, setActiveArticle] = useState(null);

    const articles = {
        hacks: {
            title: "Top 5 PDF Productivity Hacks",
            content: `
                <p>Speed up your workflow with these expert PDF tricks:</p>
                <ul>
                    <li><strong>1. Keyboard Shortcuts:</strong> Use Ctrl+S to save and Ctrl+Z to undo edits instantly.</li>
                    <li><strong>2. Batch Processing:</strong> Organize multiple pages at once instead of one by one.</li>
                    <li><strong>3. Whiteout Tool:</strong> Instead of deleting text, use the whiteout tool for quick corrections.</li>
                    <li><strong>4. Compress Before Sharing:</strong> Always shrink your PDF to save recipient's time and storage.</li>
                    <li><strong>5. Digital Signatures:</strong> Skip the printer and sign documents directly using our Sign tool.</li>
                </ul>
            `
        },
        signing: {
            title: "How to Sign PDFs Without a Printer",
            content: `
                <p>Printing and scanning is a thing of the past. Follow these steps to sign digitally:</p>
                <ol>
                    <li>Open our <strong>Sign PDF</strong> tool.</li>
                    <li>Upload your document.</li>
                    <li>Draw your signature using your mouse or touch screen.</li>
                    <li>The tool will automatically place it on the signature line.</li>
                    <li>Download and send!</li>
                </ol>
            `
        },
        compliance: {
            title: "Understanding PDF/A Compliance",
            content: `
                <p>PDF/A is an ISO-standardized version of the Portable Document Format (PDF) specialized for use in the archiving and long-term preservation of electronic documents.</p>
                <p>Unlike standard PDFs, PDF/A requires all fonts to be embedded and prohibits features unsuitable for long-term archiving, such as JavaScript and encryption.</p>
            `
        }
    };

    if (activeArticle) {
        return (
            <div className="dashboard-container-full">
                <nav className="dashboard-nav">
                    <div className="nav-brand" onClick={() => setActiveArticle(null)} style={{ cursor: 'pointer' }}>
                        <ArrowLeft size={24} color="#fbbf24" />
                        <span>Back to Dashboard</span>
                    </div>
                </nav>
                <div className="article-reader-view" style={{ padding: '4rem 10%', maxWidth: '1000px', margin: '0 auto' }}>
                    <h1 style={{ color: '#fbbf24', fontSize: '2.5rem', marginBottom: '2rem' }}>{articles[activeArticle].title}</h1>
                    <div
                        className="article-body"
                        style={{ color: '#cbd5e1', lineHeight: '1.8', fontSize: '1.1rem' }}
                        dangerouslySetInnerHTML={{ __html: articles[activeArticle].content }}
                    />
                    <button className="btn-primary" style={{ marginTop: '3rem' }} onClick={() => setActiveArticle(null)}>
                        Finished Reading
                    </button>

                    <div style={{ marginTop: '4rem' }}>
                        <AdUnit style={{ width: '100%', height: '90px' }} />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="dashboard-container-full">
            {/* Navigation */}
            <nav className="dashboard-nav">
                <div className="nav-brand">
                    <FileText size={28} color="#fbbf24" />
                    <span>PDF Master</span>
                </div>
                <div className="nav-links">
                    {/* Add login/signup later */}
                </div>
            </nav>

            {/* Hero */}
            <header className="dashboard-hero">
                <h1 className="hero-title">All-in-One PDF Tools for Everyone</h1>
                <p className="hero-subtitle">Make your life easier with our comprehensive suite of PDF utilities. Edit, organize, compress, and secure your documents in seconds.</p>
            </header>

            <div className="dashboard-layout-3col">

                {/* Left Ad Column */}
                <aside className="ad-column left">
                    <div className="sticky-ad">
                        <AdUnit style={{ width: '160px', height: '600px' }} />
                    </div>
                </aside>

                {/* Main Content Area */}
                <main className="main-content-centered">
                    <section className="tools-section">
                        <div className="tools-grid">
                            <ToolCard
                                icon={FileText}
                                title="Edit PDF"
                                desc="Add text, images, shapes and whiteout to your PDF."
                                onClick={() => onNavigate('editor')}
                            />
                            <ToolCard
                                icon={PenTool}
                                title="Sign PDF"
                                desc="Add digital signatures to your PDF documents."
                                badge="NEW"
                                onClick={() => onNavigate('sign')}
                            />
                            <ToolCard
                                icon={Layers}
                                title="Organize PDF"
                                desc="Rearrange, delete, or rotate pages in your PDF."
                                onClick={() => onNavigate('organize')}
                            />
                            <ToolCard
                                icon={Zap}
                                title="Compress PDF"
                                desc="Reduce file size while maintaining quality."
                                badge="HOT"
                                onClick={() => onNavigate('compress')}
                            />
                            <ToolCard
                                icon={Lock}
                                title="Protect PDF"
                                desc="Encrypt your PDF with a secure password."
                                onClick={() => onNavigate('encrypt')}
                            />
                            <ToolCard
                                icon={FilePlus}
                                title="Create PDF"
                                desc="Start from scratch with a blank document."
                                onClick={() => onNavigate('create')}
                            />
                            <ToolCard
                                icon={Printer}
                                title="Print PDF"
                                desc="Print your document with applied edits."
                                onClick={() => onNavigate('print')}
                            />
                        </div>
                    </section>

                    <section className="tools-section">
                        <h2 className="section-title"><FileType size={20} color="#fbbf24" /> Convert from PDF</h2>
                        <div className="tools-grid">
                            <ToolCard
                                icon={FileText}
                                title="PDF to Word"
                                desc="Convert your PDF files to editable Word documents."
                                onClick={() => alert("PDF to Word conversion coming soon!")}
                            />
                            <ToolCard
                                icon={FileSpreadsheet}
                                title="PDF to Excel"
                                desc="Extract data from PDF tables to Excel spreadsheets."
                                onClick={() => alert("PDF to Excel conversion coming soon!")}
                            />
                            <ToolCard
                                icon={Presentation}
                                title="PDF to PPT"
                                desc="Turn your PDF slides into PowerPoint presentations."
                                onClick={() => alert("PDF to PowerPoint conversion coming soon!")}
                            />
                            <ToolCard
                                icon={ImageIcon}
                                title="PDF to JPG"
                                desc="Convert each PDF page into a high-quality image."
                                onClick={() => alert("PDF to Image conversion coming soon!")}
                            />
                        </div>
                    </section>

                    <AdUnit style={{ margin: '2rem 0' }} />

                    <section className="content-section">
                        <h2 className="section-title"><BookOpen size={20} color="#fbbf24" /> Knowledge Base & Tutorials</h2>

                        <CollapsibleGuide title="How to Edit a PDF File Online">
                            <p>Editing a PDF file doesn't have to be complicated. With PDF Master, you can make changes directly in your browser without installing heavy software.</p>
                            <ul>
                                <li><strong>Step 1:</strong> Click on the "Edit PDF" tool.</li>
                                <li><strong>Step 2:</strong> Upload your PDF file.</li>
                                <li><strong>Step 3:</strong> Use the toolbar to add text, images, or whiteout.</li>
                                <li><strong>Step 4:</strong> Click "Save PDF" to download.</li>
                            </ul>
                        </CollapsibleGuide>

                        <CollapsibleGuide title="Why Compress PDF Files?">
                            <p>Large PDF files can be difficult to share. Compressing your PDF reduces its file size by optimizing images and internal structures.</p>
                            <p>Use our <strong>Compress PDF</strong> tool to shrink your files securely and efficiently.</p>
                        </CollapsibleGuide>

                        <CollapsibleGuide title="How to Organize PDF Pages">
                            <p>Rearrange your document exactly how you want it. Our Organize tool allows you to:</p>
                            <ul>
                                <li>Drag and drop pages to change their order.</li>
                                <li>Delete unwanted pages with a single click.</li>
                                <li>Rotate individual pages that might be upside down.</li>
                            </ul>
                        </CollapsibleGuide>

                        <CollapsibleGuide title="Secure Your Documents with Encryption">
                            <p>Protect sensitive information by adding a password to your PDF files. Our encryption tool uses standard security protocols to ensure your data stays safe.</p>
                            <p>Perfect for bank statements, contracts, and private letters.</p>
                        </CollapsibleGuide>

                        <CollapsibleGuide title="Convert PDF to Editable Word Documents">
                            <p>Need to make major changes to a PDF? Converting it to Word (.docx) is the best way to leverage powerful word processing tools.</p>
                            <p>Our upcoming converter preserves layout and formatting as much as possible.</p>
                        </CollapsibleGuide>

                        <CollapsibleGuide title="The Advantage of Local Browser Processing">
                            <p>Most online tools upload your files to their servers. <strong>PDF Master</strong> processes everything locally in your browser.</p>
                            <p>This means your private documents never leave your computer, providing maximum security and privacy.</p>
                        </CollapsibleGuide>

                        <CollapsibleGuide title="Common PDF Problems and Solutions">
                            <p>Troubleshooting common issues:</p>
                            <ul>
                                <li><strong>File too large:</strong> Use the Compress tool.</li>
                                <li><strong>Wrong orientation:</strong> Use the Organize tool to rotate.</li>
                                <li><strong>Can't edit:</strong> The file might be protected. Decrypt it first.</li>
                            </ul>
                        </CollapsibleGuide>
                    </section>

                    <section className="featured-posts">
                        <h2 className="section-title"><Star size={20} color="#fbbf24" /> Featured Articles</h2>
                        <div className="posts-grid">
                            <div className="post-card" onClick={() => setActiveArticle('hacks')} style={{ cursor: 'pointer' }}>
                                <h4>Top 5 PDF Productivity Hacks</h4>
                                <p>Learn how to speed up your workflow with simple PDF tricks like batch processing and keyboard shortcuts.</p>
                                <span className="read-more">Read Article →</span>
                            </div>
                            <div className="post-card" onClick={() => setActiveArticle('signing')} style={{ cursor: 'pointer' }}>
                                <h4>How to Sign PDFs Without a Printer</h4>
                                <p>Discover the best ways to add a digital signature to your contracts and documents instantly.</p>
                                <span className="read-more">Read Article →</span>
                            </div>
                            <div className="post-card" onClick={() => setActiveArticle('compliance')} style={{ cursor: 'pointer' }}>
                                <h4>Understanding PDF/A Compliance</h4>
                                <p>What is PDF/A and why does it matter for long-term document archiving? We break it down for you.</p>
                                <span className="read-more">Read Article →</span>
                            </div>
                        </div>
                    </section>
                </main>

                {/* Right Ad Column */}
                <aside className="ad-column right">
                    <div className="sticky-ad">
                        <AdUnit style={{ width: '160px', height: '600px' }} />
                    </div>
                </aside>

            </div>

            <footer className="dashboard-footer">
                <p>&copy; {new Date().getFullYear()} PDF Master. All rights reserved.</p>
                <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'center', gap: '1rem', fontSize: '0.9rem' }}>
                    <a href="#" style={{ color: '#64748b' }}>Privacy Policy</a>
                    <a href="#" style={{ color: '#64748b' }}>Terms of Service</a>
                    <a href="#" style={{ color: '#64748b' }}>Contact Us</a>
                </div>
            </footer>
        </div>
    );
};

export default Dashboard;
