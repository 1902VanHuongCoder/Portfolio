import { useContext, useState, useRef } from "react";
import { motion } from "framer-motion";
import { FaUpload, FaDownload, FaTrash, FaImage } from "react-icons/fa";
import { ThemeContext } from "../../contexts/ThemeContext";
import NavigationBar from "../partials/NavigationBar";
import { ToastContext } from "../../lib/toast-context";
import { removeBackground } from "@imgly/background-removal";
import ThemeCanvas from "../partials/ThemeCanvas";

const RemoveBackground = () => {
  const [originalImage, setOriginalImage] = useState(null);
  const [processedImage, setProcessedImage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [previewUrl, setPreviewUrl] = useState(null);
  const fileInputRef = useRef(null);
  const canvasRef = useRef(null);

  const { theme } = useContext(ThemeContext);
  const { showToast } = useContext(ToastContext);

  const styleBasedOnTheme = () => {
    if (theme?.themeSlug === "christmas") {
      return {
        titleColor: "text-white",
        primaryColor: "text-[#33A1E0]",
        secondaryColor: "text-[#33A1E0]/80",
        gradientColor: "from-white via-gray-200 to-white",
        buttonBg: "bg-white/20 hover:bg-white/30 text-[#33A1E0] border-white/50",
        cardBg: "bg-white border-white/20",
        accentColor: "#FFF",
      };
    } else if (theme?.themeSlug === "new-year") {
      return {
        titleColor: "text-white",
        primaryColor: "text-[#EEBF17]",
        secondaryColor: "text-[#F17B00]",
        gradientColor: "from-yellow-600 via-yellow-400 to-yellow-600",
        buttonBg:
          "bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white",
        cardBg: "backdrop-blur-xl bg-white/10 border-[#EEBF17]/30",
        accentColor: "#EEBF17",
      };
    } else {
      return {
        titleColor: "text-[#154D71]",
        primaryColor: "text-[#154D71]",
        secondaryColor: "text-[#33A1E0]",
        gradientColor: "from-[#154D71] via-[#33A1E0] to-[#154D71]",
        buttonBg:
          "bg-gradient-to-r from-[#154D71] to-[#33A1E0] hover:from-[#33A1E0] hover:to-[#154D71] text-white",
        cardBg: "bg-white/80 backdrop-blur-sm border-[#33A1E0]/30",
        accentColor: "#33A1E0",
      };
    }
  };

  const styles = styleBasedOnTheme();

  // Handle file upload
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        showToast("error", "Please upload a valid image file!");
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        // 10MB limit
        showToast("error", "Image size should be less than 10MB!");
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        setOriginalImage(event.target.result);
        setPreviewUrl(event.target.result);
        setProcessedImage(null);
      };
      reader.readAsDataURL(file);
    }
  };

  // AI-powered background removal using @imgly/background-removal
  const removeBackgroundAI = async () => {
    if (!originalImage) {
      showToast("warning", "Please upload an image first!");
      return;
    }

    setIsProcessing(true);
    setProgress(0);
    showToast("info", "Processing image with AI... This may take a moment.");

    try {
      // Convert data URL to blob
      const response = await fetch(originalImage);
      const blob = await response.blob();

      // Use @imgly/background-removal to remove background
      const imageBlob = await removeBackground(blob, {
        progress: (key, current, total) => {
          // Update progress state
          const percentage = ((current / total) * 100).toFixed(0);
          setProgress(percentage);
          console.log(`Processing: ${percentage}%`);
        },
      });

      // Convert blob to data URL for display
      const reader = new FileReader();
      reader.onloadend = () => {
        const processedDataUrl = reader.result;
        setProcessedImage(processedDataUrl);
        setPreviewUrl(processedDataUrl);
        setIsProcessing(false);
        setProgress(0);
        showToast("success", "Background removed successfully with AI!");
      };
      reader.readAsDataURL(imageBlob);
    } catch (error) {
      setIsProcessing(false);
      setProgress(0);
      showToast("error", "An error occurred while processing the image.");
      console.error("Background removal error:", error);
    }
  };

  // Download processed image
  const downloadImage = () => {
    if (!processedImage) {
      showToast("warning", "No processed image to download!");
      return;
    }

    const link = document.createElement("a");
    link.href = processedImage;
    link.download = `no-background-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("success", "Image downloaded successfully!");
  };

  // Reset everything
  const handleReset = () => {
    setOriginalImage(null);
    setProcessedImage(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

    const colorBasedOnTheme = {
      christmas: "bg-[rgba(0,0,0,.9)] text-white",
      default: "bg-white",
      "new-year": "bg-[#9F0D18] text-white",
      "dark-mode": "bg-[rgba(0,0,0,.9)]",
    };

  return (
    <div
      className={`min-h-screen w-full relative overflow-x-hidden ${
        colorBasedOnTheme[theme?.themeSlug] || colorBasedOnTheme["default"]
      }`}
    >
      {/* Theme Canvas Background */}
      <ThemeCanvas />

      {/* Navigation */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <NavigationBar />
      </div>

      {/* Main Content */}
      <div className="relative pt-[10rem] pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1
            className={`text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-4 ${styles.titleColor}`}
          >
            Remove Background Tool
          </h1>
          <p
            className={`text-lg sm:text-xl ${styles.titleColor} max-w-2xl mx-auto`}
          >
            Upload your image and remove the background instantly. Simple, fast,
            and free!
          </p>
        </motion.div>

        {/* Upload Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className={`${styles.cardBg} rounded-2xl p-8 shadow-xl mb-8`}
        >
          <div className="flex flex-col items-center">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
              id="file-upload"
            />

            {!previewUrl ? (
              <label
                htmlFor="file-upload"
                className="cursor-pointer w-full max-w-lg"
              >
                <div
                  className={`border-4 border-dashed rounded-xl p-12 text-center transition-all duration-300 hover:scale-105 ${
                    theme?.themeSlug === "christmas"
                      ? "border-[#33A1E0]/40"
                      : theme?.themeSlug === "new-year"
                      ? "border-yellow-400/40 hover:border-yellow-400/60 bg-yellow-400/5"
                      : "border-[#33A1E0]/40 hover:border-[#33A1E0]/60 bg-[#33A1E0]/5"
                  }`}
                >
                  <FaImage
                    size={64}
                    className={`mx-auto mb-4 ${styles.secondaryColor}`}
                  />
                  <p
                    className={`text-xl font-semibold mb-2 ${styles.primaryColor}`}
                  >
                    Click to upload an image
                  </p>
                  <p className={`text-sm ${styles.secondaryColor}`}>
                    PNG, JPG, JPEG up to 10MB
                  </p>
                </div>
              </label>
            ) : (
              <div className="w-full max-w-4xl">
                {/* Image Preview */}
                <div className="relative mb-6">
                  <div className="relative flex justify-center items-center">
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="max-h-[500px] w-auto mx-auto rounded-lg shadow-2xl"
                      style={{
                        background:
                          "repeating-conic-gradient(#e5e5e5 0% 25%, #f5f5f5 0% 50%) 50% / 20px 20px",
                      }}
                    />
                    {isProcessing && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-lg">
                        <div className="text-white text-center px-8">
                          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-white mx-auto mb-4"></div>
                          <p className="text-lg font-semibold mb-4">Processing...</p>
                          
                          {/* Progress Bar */}
                          <div className="w-full max-w-md mx-auto">
                            <div className="bg-white/20 rounded-full h-3 overflow-hidden mb-2">
                              <div 
                                className="h-full bg-gradient-to-r from-blue-400 to-blue-600 transition-all duration-300 ease-out rounded-full"
                                style={{ width: `${progress}%` }}
                              ></div>
                            </div>
                            <p className="text-sm font-medium">{progress}%</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-4 justify-center">
                  {!processedImage ? (
                    <>
                      <button
                        onClick={removeBackgroundAI}
                        disabled={isProcessing}
                        className={`${styles.buttonBg} px-8 py-4 rounded-xl font-bold text-lg shadow-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3 border-2`}
                      >
                        <FaUpload size={20} />
                        Remove Background (AI)
                      </button>
                      <label
                        htmlFor="file-upload"
                        className={`${styles.buttonBg} px-8 py-4 rounded-xl font-bold text-lg shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center gap-3 cursor-pointer border-2`}
                      >
                        <FaImage size={20} />
                        Choose Another
                      </label>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={downloadImage}
                        className={`${styles.buttonBg} px-8 py-4 rounded-xl font-bold text-lg shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center gap-3 border-2`}
                      >
                        <FaDownload size={20} />
                        Download
                      </button>
                      <button
                        onClick={() => setPreviewUrl(originalImage)}
                        className={`${styles.buttonBg} px-8 py-4 rounded-xl font-bold text-lg shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center gap-3 border-2`}
                      >
                        <FaImage size={20} />
                        View Original
                      </button>
                      <button
                        onClick={() => setPreviewUrl(processedImage)}
                        className={`${styles.buttonBg} px-8 py-4 rounded-xl font-bold text-lg shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center gap-3 border-2`}
                      >
                        <FaImage size={20} />
                        View Result
                      </button>
                      <button
                        onClick={handleReset}
                        className={`${styles.buttonBg} px-8 py-4 rounded-xl font-bold text-lg shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center gap-3 border-2`}
                      >
                        <FaTrash size={20} />
                        Start Over
                      </button>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          {[
            {
              icon: <FaUpload size={24} />,
              title: "Easy Upload",
              description: "Simply drag and drop or click to upload your image",
            },
            {
              icon: <FaImage size={24} />,
              title: "Instant Processing",
              description:
                "Remove background in seconds with our smart algorithm",
            },
            {
              icon: <FaDownload size={24} />,
              title: "Free Download",
              description:
                "Download your processed image with transparent background",
            },
          ].map((feature, index) => (
            <div
              key={index}
              className={`p-5 text-center bg-white rounded-md`}
            >
              <div
                className={`inline-flex items-center justify-center w-12 h-12 rounded-lg mb-3 ${
                  theme?.themeSlug === "christmas"
                    ? "bg-white/10"
                    : theme?.themeSlug === "new-year"
                    ? "bg-yellow-400/10"
                    : "bg-[#33A1E0]/10"
                }`}
              >
                <div className={styles.secondaryColor}>{feature.icon}</div>
              </div>
              <h3 className={`text-lg font-semibold mb-1 ${styles.primaryColor}`}>
                {feature.title}
              </h3>
              <p className={`text-sm ${styles.secondaryColor} opacity-75`}>{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Note Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className={`mt-12 ${styles.cardBg} border-2 rounded-xl p-6 shadow-lg`}
        >
          <p className={`text-center ${styles.secondaryColor} text-sm`}>
            <strong className={styles.primaryColor}>Note:</strong> This tool is developed by Paul To and free to use. For best results, use images with clear
          </p>
        </motion.div>
      </div>

      {/* Hidden canvas for processing */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default RemoveBackground;
