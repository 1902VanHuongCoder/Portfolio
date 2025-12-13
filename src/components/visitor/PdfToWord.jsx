import { useContext, useState, useRef } from "react";
import { motion } from "framer-motion";
import { FaUpload, FaDownload, FaTrash, FaFilePdf, FaFileWord } from "react-icons/fa";
import { ThemeContext } from "../../contexts/ThemeContext";
import NavigationBar from "../partials/NavigationBar";
import { ToastContext } from "../../lib/toast-context";
import ThemeCanvas from "../partials/ThemeCanvas";

const PdfToWord = () => {
  const [pdfFile, setPdfFile] = useState(null);
  const [pdfFileName, setPdfFileName] = useState("");
  const [convertedDoc, setConvertedDoc] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState("");
  const fileInputRef = useRef(null);

  const { theme } = useContext(ThemeContext);
  const { showToast } = useContext(ToastContext);

  const styleBasedOnTheme = () => {
    if (theme?.themeSlug === "christmas") {
      return {
        primaryColor: "text-white",
        secondaryColor: "text-white/80",
        gradientColor: "from-white via-gray-200 to-white",
        buttonBg: "bg-white/20 hover:bg-white/30 text-white border-white/50",
        cardBg: "backdrop-blur-xl bg-white/10 border-white/20",
        accentColor: "#FFF",
      };
    } else if (theme?.themeSlug === "new-year") {
      return {
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
      if (file.type !== "application/pdf") {
        showToast("error", "Vui lòng tải lên một file PDF hợp lệ!");
        return;
      }
      if (file.size > 50 * 1024 * 1024) {
        // 50MB limit
        showToast("error", "Kích thước file PDF không được vượt quá 50MB!");
        return;
      }

      setPdfFile(file);
      setPdfFileName(file.name);
      setConvertedDoc(null);
      setProcessingProgress("");
    }
  };

  // Convert PDF to Word using API
  const convertPdfToWord = async () => {
    if (!pdfFile) {
      showToast("warning", "Vui lòng tải lên file PDF trước!");
      return;
    }

    setIsProcessing(true);
    setProcessingProgress("Đang tải file lên...");
    showToast("info", "Đang xử lý file PDF... Vui lòng đợi một chút.");

    try {
      // Convert file to base64
      const reader = new FileReader();
      reader.onload = async (e) => {
        const fileData = e.target.result;
        
        setProcessingProgress("Đang chuyển đổi PDF sang Word...");

        try {
          // Call Netlify function
          const response = await fetch('/.netlify/functions/pdf-to-word', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              fileData: fileData,
              fileName: pdfFileName,
            }),
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Conversion failed');
          }

          const result = await response.json();
          
          if (result.success && result.fileData) {
            // Convert base64 to blob
            const byteCharacters = atob(result.fileData);
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
              byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);
            const blob = new Blob([byteArray], { 
              type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' 
            });

            setConvertedDoc(blob);
            setIsProcessing(false);
            setProcessingProgress("");
            showToast("success", "Chuyển đổi thành công! Bạn có thể tải xuống file Word.");
          } else {
            throw new Error('Invalid response from server');
          }
        } catch (error) {
          setIsProcessing(false);
          setProcessingProgress("");
          showToast("error", error.message || "Đã xảy ra lỗi khi chuyển đổi file PDF.");
          console.error("PDF to Word conversion error:", error);
        }
      };

      reader.onerror = () => {
        setIsProcessing(false);
        setProcessingProgress("");
        showToast("error", "Không thể đọc file PDF.");
      };

      reader.readAsDataURL(pdfFile);
    } catch (error) {
      setIsProcessing(false);
      setProcessingProgress("");
      showToast("error", "Đã xảy ra lỗi khi xử lý file PDF.");
      console.error("PDF to Word conversion error:", error);
    }
  };

  // Download Word document
  const downloadWord = () => {
    if (!convertedDoc) {
      showToast("warning", "Chưa có file Word để tải xuống!");
      return;
    }

    const link = document.createElement("a");
    link.href = URL.createObjectURL(convertedDoc);
    const originalName = pdfFileName.replace(".pdf", "");
    link.download = `${originalName}-converted-${Date.now()}.docx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
    showToast("success", "File Word đã được tải xuống thành công!");
  };

  // Reset everything
  const handleReset = () => {
    setPdfFile(null);
    setPdfFileName("");
    setConvertedDoc(null);
    setProcessingProgress("");
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
      <div className="relative pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1
            className={`text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-4 ${styles.primaryColor}`}
          >
            PDF to Word Converter
          </h1>
          <p
            className={`text-lg sm:text-xl ${styles.secondaryColor} max-w-2xl mx-auto`}
          >
            Chuyển đổi file PDF sang Word dễ dàng. Nhanh chóng, đơn giản và hoàn toàn miễn phí!
          </p>
        </motion.div>

        {/* Upload Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className={`${styles.cardBg} border-2 rounded-2xl p-8 shadow-xl mb-8`}
        >
          <div className="flex flex-col items-center">
            <input
              ref={fileInputRef}
              type="file"
              accept="application/pdf"
              onChange={handleFileChange}
              className="hidden"
              id="file-upload"
            />

            {!pdfFile ? (
              <label
                htmlFor="file-upload"
                className="cursor-pointer w-full max-w-lg"
              >
                <div
                  className={`border-4 border-dashed rounded-xl p-12 text-center transition-all duration-300 hover:scale-105 ${
                    theme?.themeSlug === "christmas"
                      ? "border-white/40 hover:border-white/60 bg-white/5"
                      : theme?.themeSlug === "new-year"
                      ? "border-yellow-400/40 hover:border-yellow-400/60 bg-yellow-400/5"
                      : "border-[#33A1E0]/40 hover:border-[#33A1E0]/60 bg-[#33A1E0]/5"
                  }`}
                >
                  <FaFilePdf
                    size={64}
                    className={`mx-auto mb-4 ${styles.secondaryColor}`}
                  />
                  <p
                    className={`text-xl font-semibold mb-2 ${styles.primaryColor}`}
                  >
                    Nhấp để tải lên file PDF
                  </p>
                  <p className={`text-sm ${styles.secondaryColor}`}>
                    Hỗ trợ file PDF tối đa 50MB
                  </p>
                </div>
              </label>
            ) : (
              <div className="w-full max-w-4xl">
                {/* File Info */}
                <div className={`mb-6 ${styles.cardBg} border-2 rounded-xl p-6`}>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <FaFilePdf size={40} className={styles.secondaryColor} />
                      <div>
                        <p className={`font-bold text-lg ${styles.primaryColor}`}>
                          {pdfFileName}
                        </p>
                        <p className={`text-sm ${styles.secondaryColor}`}>
                          {(pdfFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    {convertedDoc && (
                      <FaFileWord size={40} className="text-blue-600" />
                    )}
                  </div>

                  {isProcessing && (
                    <div className="mt-4 flex items-center justify-center">
                      <div className="text-center">
                        <div
                          className={`animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 mx-auto mb-4 ${
                            theme?.themeSlug === "christmas"
                              ? "border-white"
                              : theme?.themeSlug === "new-year"
                              ? "border-yellow-400"
                              : "border-[#33A1E0]"
                          }`}
                        ></div>
                        <p className={`font-semibold ${styles.primaryColor}`}>
                          {processingProgress || "Đang xử lý..."}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-4 justify-center">
                  {!convertedDoc ? (
                    <>
                      <button
                        onClick={convertPdfToWord}
                        disabled={isProcessing}
                        className={`${styles.buttonBg} px-8 py-4 rounded-xl font-bold text-lg shadow-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3 border-2`}
                      >
                        <FaFileWord size={20} />
                        Chuyển đổi sang Word
                      </button>
                      <label
                        htmlFor="file-upload"
                        className={`${styles.buttonBg} px-8 py-4 rounded-xl font-bold text-lg shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center gap-3 cursor-pointer border-2`}
                      >
                        <FaFilePdf size={20} />
                        Chọn file khác
                      </label>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={downloadWord}
                        className={`${styles.buttonBg} px-8 py-4 rounded-xl font-bold text-lg shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center gap-3 border-2`}
                      >
                        <FaDownload size={20} />
                        Tải xuống Word
                      </button>
                      <button
                        onClick={handleReset}
                        className={`${styles.buttonBg} px-8 py-4 rounded-xl font-bold text-lg shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center gap-3 border-2`}
                      >
                        <FaTrash size={20} />
                        Bắt đầu lại
                      </button>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Features Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {[
            {
              icon: <FaUpload size={32} />,
              title: "Dễ dàng tải lên",
              description: "Chỉ cần kéo thả hoặc nhấp để tải lên file PDF của bạn",
            },
            {
              icon: <FaFileWord size={32} />,
              title: "Xử lý nhanh chóng",
              description:
                "Chuyển đổi PDF sang Word trong vài giây với thuật toán thông minh",
            },
            {
              icon: <FaDownload size={32} />,
              title: "Tải xuống miễn phí",
              description:
                "Tải xuống file Word đã chuyển đổi hoàn toàn miễn phí",
            },
          ].map((feature, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05 }}
              className={`${styles.cardBg} border-2 rounded-xl p-6 shadow-lg text-center`}
            >
              <div
                className={`inline-block p-4 rounded-full mb-4 ${
                  theme?.themeSlug === "christmas"
                    ? "bg-white/20"
                    : theme?.themeSlug === "new-year"
                    ? "bg-yellow-400/20"
                    : "bg-[#33A1E0]/20"
                }`}
              >
                <div className={styles.secondaryColor}>{feature.icon}</div>
              </div>
              <h3 className={`text-xl font-bold mb-2 ${styles.primaryColor}`}>
                {feature.title}
              </h3>
              <p className={styles.secondaryColor}>{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Note Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className={`mt-12 ${styles.cardBg} border-2 rounded-xl p-6 shadow-lg`}
        >
          <p className={`text-center ${styles.secondaryColor} text-sm`}>
            <strong className={styles.primaryColor}>Lưu ý:</strong> Công cụ này
            sử dụng API chuyển đổi chuyên nghiệp để giữ nguyên format, hình ảnh, 
            bảng biểu và định dạng gốc của PDF. Để sử dụng, bạn cần cấu hình API key:
            <br/><br/>
            <strong className={styles.primaryColor}>Tùy chọn 1 (Đề xuất):</strong> ConvertAPI - Miễn phí 250 lượt/tháng
            <br/>
            • Đăng ký tại: <a href="https://www.convertapi.com/" target="_blank" rel="noopener noreferrer" className={styles.primaryColor}>convertapi.com</a>
            <br/>
            • Thêm biến môi trường: <code className={styles.primaryColor}>CONVERTAPI_SECRET</code>
            <br/><br/>
            <strong className={styles.primaryColor}>Tùy chọn 2:</strong> CloudConvert - Miễn phí 25 lượt/ngày
            <br/>
            • Đăng ký tại: <a href="https://cloudconvert.com/" target="_blank" rel="noopener noreferrer" className={styles.primaryColor}>cloudconvert.com</a>
            <br/>
            • Thêm biến môi trường: <code className={styles.primaryColor}>CLOUDCONVERT_API_KEY</code>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default PdfToWord;
