"use client";

import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
  useContext,
  useReducer,
} from "react";

import { format, parseISO, addDays, differenceInDays } from "date-fns";
import { debounce, throttle, uniq, groupBy } from "lodash";
import clsx from "clsx";
import { FiRotateCcw, FiDownload } from "react-icons/fi";

import ImageTextInput from "../components/ImageTextInput";
import { LiveProvider, LiveError, LivePreview, LiveEditor } from "react-live";
import SnakeLoading from "../components/SnakeLoading";
import ImagePlaceholder from "../components/ImagePlaceholder";
interface Message {
  type: "text" | "image";
  content: string;
  result: string;
  code?: string;
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentPreview, setCurrentPreview] = useState<string | null>(null);
  const [hasStarted, setHasStarted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [previousCode, setPreviousCode] = useState<string | null>(null);
  const [, setCopySuccess] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDebugMode, setIsDebugMode] = useState(false);

  useEffect(() => {
    const debugMode = localStorage.getItem("debugMode") === "true";
    setIsDebugMode(debugMode);
  }, []);

  const handleAnalysisComplete = (result: string) => {
    const wrappedCode = result.includes("render(")
      ? result
      : `const Component = ${result};\nrender(<Component />);`;

    // Only update currentPreview and previousCode if the result is valid
    console.log("Result:", wrappedCode);
    if (
      !result.includes("Error:") &&
      !result.includes("error") &&
      !result.includes("SyntaxError")
    ) {
      setCurrentPreview(wrappedCode);
      setPreviousCode(wrappedCode);
      if (!hasStarted) {
        setHasStarted(true);
      }
      setMessages((prev) => {
        const newMessages = [...prev];
        if (newMessages.length > 0) {
          newMessages[newMessages.length - 1].code = wrappedCode;
        }
        return newMessages;
      });
    } else {
      // If there's an error, just update the current preview without affecting previousCode
      setCurrentPreview(wrappedCode);
    }
    setIsLoading(false);
  };

  const handleSubmit = (text: string) => {
    setMessages((prev) => [
      ...prev,
      { type: "text", content: text, result: "" },
    ]);
    setIsLoading(true);
    if (currentPreview) {
      setPreviousCode(currentPreview);
    }
  };

  const handleImageChange = (file: File | null) => {
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Image = reader.result as string;
        setMessages((prev) => [
          ...prev,
          { type: "image", content: base64Image, result: "" },
        ]);
        setIsLoading(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRestoreState = (code: string) => {
    setPreviousCode(code);
    setCurrentPreview(code);
  };

  const handleCopyCode = async () => {
    if (!currentPreview) return;

    try {
      await navigator.clipboard.writeText(currentPreview);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error("Failed to copy code:", err);
    }
  };

  if (!hasStarted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen min-w-screen font-geist-mono">
        <h1 className="text-4xl mb-4 font-bold">not v0</h1>
        <ImageTextInput
          onSubmit={handleSubmit}
          onImageChange={handleImageChange}
          onAnalysisComplete={handleAnalysisComplete}
          placeholder="Type something or upload an image..."
        />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      {/* Sidebar - Desktop */}
      <div className="hidden md:flex w-80 border-r border-gray-200 p-4 flex-col fixed left-0 top-0 bottom-0 bg-white">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">not v0</h1>
          {currentPreview && (
            <button
              onClick={handleCopyCode}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-md transition-all duration-200 hover:bg-gray-100"
              title="Copy code to clipboard"
            >
              <FiDownload className="w-5 h-5" />
            </button>
          )}
        </div>
        <div className="flex-1 overflow-y-auto">
          {messages.map((message, index) => (
            <div
              key={index}
              className="mb-2 p-2 bg-gray-50 rounded-lg group relative cursor-pointer hover:bg-gray-100/50 transition-colors"
              onClick={() => message.code && handleRestoreState(message.code)}
            >
              {message.type === "image" ? (
                <div className="relative">
                  <img
                    src={message.content}
                    alt="Uploaded"
                    className="w-full h-24 object-cover rounded-lg"
                  />
                  {message.code && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRestoreState(message.code!);
                      }}
                      className="absolute top-2 right-2 p-1.5 text-gray-400 hover:text-gray-600 rounded-md opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-gray-100"
                      title="Restore this state"
                    >
                      <FiRotateCcw className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <p className="text-gray-700 text-sm flex-1">
                    {message.content}
                  </p>
                  {message.code && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRestoreState(message.code!);
                      }}
                      className="p-1.5 text-gray-400 hover:text-gray-600 rounded-md opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-gray-100"
                      title="Restore this state"
                    >
                      <FiRotateCcw className="w-4 h-4" />
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="mt-4">
          <ImageTextInput
            onSubmit={handleSubmit}
            onImageChange={handleImageChange}
            onAnalysisComplete={handleAnalysisComplete}
            placeholder="Reply..."
            previousCode={previousCode}
          />
        </div>
      </div>

      {/* Sidebar - Mobile */}
      <div
        className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 transition-transform duration-300 ease-in-out z-50"
        style={{
          transform: isSidebarOpen
            ? "translateY(0)"
            : "translateY(calc(100% - 48px))",
        }}
      >
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="w-full p-3 flex items-center justify-center text-gray-400 hover:text-gray-600 bg-white border-t border-gray-200"
        >
          {!isSidebarOpen ? (
            <div className="w-12 h-1 bg-gray-300 rounded-full">
              <div className="absolute -top-2 left-0 right-0 flex items-center justify-center">
                <div className="bg-blue-500 text-white px-2 py-1 rounded-full">
                  Prompt
                </div>
              </div>
            </div>
          ) : null}
        </button>
        <div className="p-4 max-h-[80vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold">not v0</h1>
            {currentPreview && (
              <button
                onClick={handleCopyCode}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-md transition-all duration-200 hover:bg-gray-100"
                title="Copy code to clipboard"
              >
                <FiDownload className="w-5 h-5" />
              </button>
            )}
          </div>
          <div className="space-y-2">
            {messages.map((message, index) => (
              <div
                key={index}
                className="p-2 bg-gray-50 rounded-lg group relative cursor-pointer hover:bg-gray-100/50 transition-colors"
                onClick={() => message.code && handleRestoreState(message.code)}
              >
                {message.type === "image" ? (
                  <div className="relative">
                    <img
                      src={message.content}
                      alt="Uploaded"
                      className="w-full h-24 object-cover rounded-lg"
                    />
                    {message.code && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRestoreState(message.code!);
                        }}
                        className="absolute top-2 right-2 p-1.5 text-gray-400 hover:text-gray-600 rounded-md opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-gray-100"
                        title="Restore this state"
                      >
                        <FiRotateCcw className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <p className="text-gray-700 text-sm flex-1">
                      {message.content}
                    </p>
                    {message.code && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRestoreState(message.code!);
                        }}
                        className="p-1.5 text-gray-400 hover:text-gray-600 rounded-md opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-gray-100"
                        title="Restore this state"
                      >
                        <FiRotateCcw className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="mt-4">
            <ImageTextInput
              onSubmit={handleSubmit}
              onImageChange={handleImageChange}
              onAnalysisComplete={handleAnalysisComplete}
              placeholder={
                isSidebarOpen ? "" : "Change the background color..."
              }
              previousCode={previousCode}
              autoFocus={isSidebarOpen}
            />
          </div>
        </div>
      </div>

      {/* Preview Section */}
      <div className="flex-1 bg-gray-50 relative min-h-screen md:ml-80">
        <div className="h-full w-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]">
          <div className="h-full w-full flex items-center justify-center">
            {isLoading ? (
              <div className="w-1/3 h-1/3">
                <SnakeLoading />
              </div>
            ) : currentPreview ? (
              <div className="h-full w-full">
                <LiveProvider
                  code={currentPreview}
                  noInline={true}
                  scope={{
                    React,
                    useState,
                    useEffect,
                    useRef,
                    useMemo,
                    useCallback,
                    useContext,
                    useReducer,

                    // Components
                    ImagePlaceholder,

                    // Date utilities
                    format,
                    parseISO,
                    addDays,
                    differenceInDays,

                    // Data utilities
                    debounce,
                    throttle,
                    uniq,
                    groupBy,

                    // UI utilities
                    clsx,
                  }}
                >
                  <LivePreview className="p-[60px]" />
                  <LiveError className="text-red-500 p-4" />
                  {isDebugMode && <LiveEditor />}
                </LiveProvider>
              </div>
            ) : (
              <div className="text-gray-500 text-center py-8">
                No preview available. Start by typing or uploading an image.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
