"use client";
import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";

const Uploader = () => {
  const onDrop = useCallback((acceptedFiles: any) => {
    console.log(acceptedFiles);
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });
  return (
    <div className="w-full flex items-center justify-center flex-col gap-3">
      <div {...getRootProps()}>
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop the files here ...</p>
        ) : (
          <p>Drag 'n' drop some files here, or click to select files</p>
        )}
      </div>
      <button>Upload Image</button>
    </div>
  );
};

export default Uploader;
