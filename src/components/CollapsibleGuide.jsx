import React, { useState } from 'react';
import { ChevronDown, ChevronUp, BookOpen } from 'lucide-react';

const CollapsibleGuide = ({ title, children, defaultOpen = false }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <div className="collapsible-guide">
            <div className="guide-header" onClick={() => setIsOpen(!isOpen)}>
                <h3><BookOpen size={18} /> {title}</h3>
                {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </div>
            {isOpen && (
                <div className="guide-content">
                    {children}
                </div>
            )}
        </div>
    );
};

export default CollapsibleGuide;
