"use client";
import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";

const Uploader = () => {
  const [selectedImage, setSelectedImage] = useState<any>(null);

  const onDrop = useCallback((acceptedFiles: any) => {
    const file = acceptedFiles[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedImage(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      alert("Please select a valid image file.");
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div className="w-full h-screen flex items-center justify-center flex-col gap-3">
      <div
        {...getRootProps()}
        className="w-[400px] h-[400px] rounded-md border-2 border-blue-400 p-5 flex items-center justify-center"
      >
        <input {...getInputProps()} accept="image/*" />
        {selectedImage ? (
          <img
            src={selectedImage}
            alt="Selected"
            className="w-[300px]"
          />
        ) : (
          <>
            {isDragActive ? (
              <p className="text-gray-500 text-center text-lg">
                Drop the files here ...
              </p>
            ) : (
              <p className="text-gray-500 text-center text-lg">
                Drag 'n' drop an image here, or click to select an image
              </p>
            )}
          </>
        )}
      </div>
      <button className="bg-blue-500 px-4 py-2 rounded-lg text-white">
        Get 3D Model
      </button>
    </div>
  );
};

export default Uploader;
