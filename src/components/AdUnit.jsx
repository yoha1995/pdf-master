import React from 'react';

const AdUnit = ({ slot, format = 'auto', style = {} }) => {
    // This is a placeholder for Google AdSense.
    // In production, you would place the <ins> tag here.
    return (
        <div
            className="ad-unit-placeholder"
            style={{
                width: '100%',
                minHeight: '250px',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                border: '1px dashed rgba(255, 255, 255, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'rgba(255, 255, 255, 0.4)',
                fontSize: '0.9rem',
                borderRadius: '8px',
                margin: '1rem 0',
                ...style
            }}
        >
            <span>Advertisement Space ({style.width || 'Responsive'} x {style.height || 'Auto'})</span>
            {/* 
      <ins className="adsbygoogle"
           style={{display: 'block'}}
           data-ad-client="ca-pub-XXXXXXXXXXXXXX"
           data-ad-slot={slot}
           data-ad-format={format}
           data-full-width-responsive="true"></ins>
      */}
        </div>
    );
};

export default AdUnit;
