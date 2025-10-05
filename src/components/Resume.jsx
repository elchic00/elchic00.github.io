// Resume.jsx (Refactored using Tailwind)

import React from 'react';

const ResumePage = () => {
  const pdfPath = `${process.env.PUBLIC_URL}/andrew_alagna_resume_2025.pdf`;

  return (
    <div className="w-full min-h-screen flex flex-col bg-gray-600 pt-20"> {/* Add pt-20 for navbar fixed header */}

      {/* Header with download/open button - Keep your existing inline styles for this part for simplicity */}
      <div style={{ 
        padding: '20px', 
        textAlign: 'center', 
        backgroundColor: '#2c3e50',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <a 
          href={pdfPath}
          download="Andrew_Alagna_Resume.pdf"
          style={{ 
            padding: '12px 24px', 
            backgroundColor: '#007bff', 
            color: 'white', 
            textDecoration: 'none', 
            borderRadius: '5px',
            display: 'inline-block',
            fontWeight: 'bold',
            marginRight: '10px'
          }}
        >
          Download PDF
        </a>
        <a 
          href={pdfPath}
          target="_blank"
          rel="noopener noreferrer"
          style={{ 
            padding: '12px 24px', 
            backgroundColor: '#6c757d', 
            color: 'white', 
            textDecoration: 'none', 
            borderRadius: '5px',
            display: 'inline-block',
            fontWeight: 'bold'
          }}
        >
          Open in New Tab
        </a>
      </div>

      {/* PDF viewer: Visible on Tablet (md) and Desktop, Hidden on Mobile */}
      <div className="flex-1 min-h-[80vh] hidden md:block"> {/* Key Change: hidden md:block */}
        <object
          data={pdfPath}
          type="application/pdf"
          width="100%"
          height="100%"
          className="min-h-[80vh]"
        >
          {/* This fallback div is still here, but it's now wrapped by the visible fallback below */}
          <div className="p-10 text-center bg-white m-5 rounded-lg">
            <h2 className="text-xl font-bold text-gray-800">Resume Preview</h2>
            <p className="text-gray-600">Your browser doesn't support inline PDF viewing.</p>
            {/* Download link removed from here to prevent duplication */}
          </div>
        </object>
      </div>

      {/* Explicit Mobile Fallback: Visible only on small screens (up to md) */}
      <div className="flex-1 min-h-[80vh] md:hidden"> {/* Key Change: md:hidden */}
          <div className="p-10 text-center bg-white m-5 rounded-lg mt-10">
            <h2 className="text-xl font-bold text-gray-800">Resume Preview</h2>
            <p className="text-gray-600">
              For the best experience, please download the PDF or view it in a new tab. 
              Inline viewing is not supported on your device.
            </p>
            <a 
              href={pdfPath}
              download="Andrew_Alagna_Resume.pdf"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded mt-5 transition duration-150"
            >
              Download Resume (Mobile)
            </a>
          </div>
      </div>
    </div>
  );
}

export default ResumePage;