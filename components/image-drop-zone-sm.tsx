"use client"

// import React, { useCallback, useState } from 'react';
// import { useDropzone } from 'react-dropzone';

// const ImageDropzone: React.FC<{ onImageUpload: (file: File) => void }> = ({ onImageUpload }) => {
//   const [imagePreview, setImagePreview] = useState<string | null>(null);

//   const onDrop = useCallback((acceptedFiles: File[]) => {
//     const file = acceptedFiles[0];
//     setImagePreview(URL.createObjectURL(file));
//     onImageUpload(file); // Pass the file to the parent component
//   }, [onImageUpload]);

//   const { getRootProps, getInputProps, isDragActive } = useDropzone({
//     onDrop,
//     accept: { 'image/*': [] },
//   });

//   return (
//     <div
//       {...getRootProps()}
//       className={`w-full max-w-xs bg-gray-300 rounded overflow-hidden cursor-pointer relative ${
//         isDragActive ? 'bg-gray-400' : ''
//       }`}
//       style={{ paddingBottom: '150%' }} // 2:3 Aspect Ratio
//     >
//       <input {...getInputProps()} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
//       {imagePreview ? (
//         <img
//           src={imagePreview}
//           alt="Preview"
//           className="absolute inset-0 w-full h-full object-cover"
//         />
//       ) : (
//         <div className="absolute inset-0 flex items-center justify-center">
//           <p className="text-gray-700">
//             {isDragActive ? 'Drop the files here ...' : 'Drag & drop an image, or click to select one'}
//           </p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ImageDropzone;

import { useDropzone } from "react-dropzone";

interface ImageDropzoneProps {
  value?: File | null;
  onChange: (file: File | null) => void;
}

const ImageDropzone: React.FC<ImageDropzoneProps> = ({ value, onChange }) => {
  const onDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onChange(acceptedFiles[0]);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
  });

  return (
    <div
      {...getRootProps()}
      className={`w-40 bg-gray-300 rounded overflow-hidden cursor-pointer relative ${
        isDragActive ? "bg-gray-400" : ""
      }`}
      style={{ paddingBottom: "66%" }}
    >
      <input {...getInputProps()} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
      {value ? (
        <img
          src={URL.createObjectURL(value)}
          alt="Preview"
          className="absolute inset-0 w-full h-full object-cover"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-gray-700">
            {isDragActive ? "Drop the files here ..." : "Drag & drop an image, or click to select one"}
          </p>
        </div>
      )}
    </div>
  );
};

export default ImageDropzone;
