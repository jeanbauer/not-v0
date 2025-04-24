import React, { useState, useRef, useEffect } from "react";
import { FiImage, FiX, FiSend } from "react-icons/fi";

interface ImageTextInputProps {
  onSubmit?: (text: string) => void;
  onImageChange?: (file: File | null) => void;
  onAnalysisComplete?: (result: string) => void;
  placeholder?: string;
  previousCode?: string | null;
  autoFocus?: boolean;
}

const ImageTextInput: React.FC<ImageTextInputProps> = ({
  onSubmit,
  onImageChange,
  onAnalysisComplete,
  placeholder = "Type something or upload an image...",
  previousCode = null,
  autoFocus = false,
}) => {
  const [text, setText] = useState("");
  const [, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      onImageChange?.(file);
      setIsLoading(true);

      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64Image = reader.result as string;
        setPreviewUrl(base64Image);

        try {
          const response = await fetch("/api/analyze", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              type: "image",
              content: base64Image,
            }),
          });

          const data = await response.json();
          onAnalysisComplete?.(data.result);
        } catch (error) {
          console.error("Error analyzing image:", error);
        } finally {
          setIsLoading(false);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    if (isLoading) return;
    setSelectedImage(null);
    setPreviewUrl(null);
    onImageChange?.(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async () => {
    if (!text.trim()) return;

    onSubmit?.(text);
    setIsLoading(true);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "text",
          content: text,
          previousCode: previousCode || null,
        }),
      });

      const data = await response.json();
      onAnalysisComplete?.(data.result);
      setText("");
    } catch (error) {
      console.error("Error analyzing text:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  return (
    <div className="flex justify-center w-full">
      <div className={`relative flex items-center w-[300px]`}>
        <div className="relative flex-1">
          <input
            ref={inputRef}
            type="text"
            value={text}
            onChange={handleTextChange}
            onKeyPress={handleKeyPress}
            placeholder={placeholder}
            className="w-full px-4 py-2 pr-24 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            disabled={isLoading}
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
            <button
              onClick={handleImageClick}
              className="text-gray-500 hover:text-blue-500 transition-colors"
              type="button"
              disabled={isLoading}
            >
              <FiImage className="w-5 h-5" />
            </button>
            <button
              onClick={handleSubmit}
              className="text-gray-500 hover:text-blue-500 transition-colors"
              type="button"
              disabled={isLoading}
            >
              <FiSend className="w-5 h-5" />
            </button>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
            disabled={isLoading}
          />
        </div>

        {previewUrl && !isLoading && (
          <div className="relative ml-2">
            <img
              src={previewUrl}
              alt="Preview"
              className="w-10 h-10 rounded-lg object-cover"
            />
            <button
              onClick={handleRemoveImage}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
              type="button"
              disabled={isLoading}
            >
              <FiX className="w-3 h-3" />
            </button>
          </div>
        )}

        {isLoading && (
          <div className="absolute inset-0 bg-white bg-opacity-50 flex items-center justify-center rounded-lg">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageTextInput;
