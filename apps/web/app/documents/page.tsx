"use client";

import React, { useState } from "react";
import { useUploadedFilesStore } from "@/stores/useUploadedFilesStore";

const DocumentsPage: React.FC = () => {
  const uploadedFiles = useUploadedFilesStore((state) => state.uploadedFiles);
  const removeFile = useUploadedFilesStore((state) => state.removeFile); // Assuming removeFile is implemented in the store
  const [expandedFolder, setExpandedFolder] = useState<string | null>(null);

  const toggleFolder = (folder: string) => {
    setExpandedFolder(expandedFolder === folder ? null : folder);
  };

  const handleRemove = (folder: string, fileName: string) => {
    removeFile(folder, fileName);
  };

  return (
    <div className="p-6 max-w-[1600px] w-full mx-auto">
    <div className="bg-gradient-to-r from-black-50 to-black-100 p-6 rounded-xl border border-black-100 shadow-sm mb-8">
      <h1 className="text-2xl font-bold text-gray-800">Document Library</h1>
      <p className="text-gray-600 mt-1">All your uploaded receipts and files</p>
    </div>
  
    <div className="mt-6">
      {uploadedFiles && Object.keys(uploadedFiles).length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-lg p-8 text-center shadow-sm">
          <div className="mb-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v16M19 3v16M3 5h18M3 19h18M5 7h14M5 11h14M5 15h14" />
            </svg>
          </div>
          <p className="text-gray-700 font-medium">No documents available</p>
        </div>
      ) : (
        <div className="space-y-6">
          { uploadedFiles && Object.keys(uploadedFiles).map((folder) => (
            <div key={folder} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div 
                className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex justify-between items-center cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => toggleFolder(folder)}
              >
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-black-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <h3 className="font-medium text-gray-800">{folder}</h3>
                </div>
                <div className="flex items-center">
                  <span className="bg-green-100 text-indigo-800 text-xs px-2 py-1 rounded mr-3">
                    {uploadedFiles && uploadedFiles[folder]?.length} files
                  </span>
                  <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 text-gray-500 transition-transform ${expandedFolder === folder ? 'transform rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
  
              {expandedFolder === folder && (
                <div className="divide-y divide-gray-100">
                  {uploadedFiles && uploadedFiles[folder]?.map((file, idx) => (
                    <div key={idx} className="py-3 px-4 flex justify-between items-center">
                      <div className="flex items-center max-w-xl">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                        <a
                          href={URL.createObjectURL(file)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 truncate"
                        >
                          {file.name}
                        </a>
                      </div>
                      <div className="flex space-x-2 ml-4">
                        <a
                          href={URL.createObjectURL(file)}
                          download={file.name}
                          className="text-gray-600 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 rounded-md p-1"
                          title="Download"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                          </svg>
                        </a>
                        <button
                          onClick={() => handleRemove(folder, file.name)}
                          className="text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 rounded-md p-1"
                          title="Remove"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  </div>
  );
};

export default DocumentsPage;
