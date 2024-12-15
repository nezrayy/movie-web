"use client";

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
    accept: { "image/*": [] },
  });

  return (
    <div
      {...getRootProps()}
      className={`w-full max-w-[200px] bg-gray-100 rounded-lg overflow-hidden cursor-pointer relative shadow-md mx-auto ${
        isDragActive ? "bg-gray-200" : ""
      }`}
      style={{ aspectRatio: "3 / 4" }}
    >
      <input
        {...getInputProps()}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
      />
      {value ? (
        <img
          src={URL.createObjectURL(value)}
          alt="Preview"
          className="absolute inset-0 w-full h-full object-cover rounded-lg"
        />
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
          <p className="text-gray-500 text-sm font-medium">
            {isDragActive
              ? "Drop the image here ..."
              : "Drag & drop an image, or click to select one"}
          </p>
          <span className="mt-2 text-xs text-gray-400">Recommended 3:4 ratio</span>
        </div>
      )}
    </div>
  );
};

export default ImageDropzone;
