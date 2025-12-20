import { useContext, useState, useRef } from "react";
import {
  FaUpload,
  FaDownload,
  FaTrash,
  FaImage,
  FaChevronLeft,
  FaRuler,
  FaSave,
  FaBrain,
  FaExclamationTriangle,
} from "react-icons/fa";
import { ToastContext } from "../../lib/toast-context";
import { removeBackground } from "@imgly/background-removal";
import { Link } from "react-router-dom";

const RemoveBackground = () => {
  const [originalImage, setOriginalImage] = useState(null);
  const [processedImage, setProcessedImage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [imageInfo, setImageInfo] = useState(null);
  const fileInputRef = useRef(null);
  const canvasRef = useRef(null);
  const maxProgressRef = useRef(0);

  const { showToast } = useContext(ToastContext);

  // Handle file upload
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        showToast(
          "error",
          "❌ Vui lòng tải lên file ảnh hợp lệ (PNG, JPG, JPEG)!"
        );
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        // 10MB limit
        const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
        showToast(
          "error",
          `❌ Ảnh quá lớn (${sizeMB}MB). Vui lòng chọn ảnh nhỏ hơn 10MB!`
        );
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          // Lưu thông tin ảnh
          const info = {
            width: img.width,
            height: img.height,
            size: file.size,
            sizeText: (file.size / (1024 * 1024)).toFixed(2) + " MB",
          };
          setImageInfo(info);

          // Cảnh báo nếu ảnh lớn
          if (file.size > 3 * 1024 * 1024) {
            showToast(
              "warning",
              `⚠️ Ảnh lớn (${info.sizeText}) sẽ xử lý chậm hơn. Khuyến nghị dùng ảnh < 3MB!`
            );
          } else if (img.width > 2000 || img.height > 2000) {
            showToast(
              "warning",
              `⚠️ Ảnh có độ phân giải cao (${img.width}x${img.height}px). Xử lý có thể mất vài phút!`
            );
          } else {
            showToast(
              "success",
              `✅ Tải ảnh thành công! ${img.width}x${img.height}px - ${info.sizeText}`
            );
          }

          setOriginalImage(event.target.result);
          setPreviewUrl(event.target.result);
          setProcessedImage(null);
          setProgress(0);
          maxProgressRef.current = 0;
        };
        img.src = event.target.result;
      };
      reader.onerror = () => {
        showToast("error", "❌ Không thể đọc file ảnh. Vui lòng thử lại.");
      };
      reader.readAsDataURL(file);
    }
  };

  // AI-powered background removal using @imgly/background-removal
  const removeBackgroundAI = async () => {
    if (!originalImage) {
      showToast("warning", "⚠️ Vui lòng tải ảnh lên trước!");
      return;
    }

    setIsProcessing(true);
    setProgress(0);
    maxProgressRef.current = 0;
    showToast("info", "🤖 AI đang xử lý ảnh... Vui lòng đợi trong giây lát.");

    try {
      // Convert data URL to blob
      const response = await fetch(originalImage);
      const blob = await response.blob();

      // Use @imgly/background-removal to remove background
      const imageBlob = await removeBackground(blob, {
        progress: (key, current, total) => {
          // Chỉ cập nhật progress khi giá trị mới lớn hơn giá trị hiện tại
          // Điều này ngăn thanh tiến trình bị giảm xuống
          const percentage = Math.round((current / total) * 100);

          if (percentage > maxProgressRef.current) {
            maxProgressRef.current = percentage;
            setProgress(percentage);
            console.log(`Processing: ${percentage}%`);
          }
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
        maxProgressRef.current = 0;
        showToast(
          "success",
          "✅ Xóa phông nền thành công! Ảnh đã sẵn sàng để tải về."
        );
      };
      reader.readAsDataURL(imageBlob);
    } catch (error) {
      setIsProcessing(false);
      setProgress(0);
      maxProgressRef.current = 0;
      showToast("error", "❌ Đã xảy ra lỗi khi xử lý ảnh. Vui lòng thử lại.");
      console.error("Background removal error:", error);
    }
  };

  // Download processed image
  const downloadImage = () => {
    if (!processedImage) {
      showToast("warning", "⚠️ Chưa có ảnh đã xử lý để tải về!");
      return;
    }

    const link = document.createElement("a");
    link.href = processedImage;
    link.download = `no-background-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("success", "📥 Tải ảnh thành công! Kiểm tra thư mục Downloads.");
  };

  // Reset everything
  const handleReset = () => {
    setOriginalImage(null);
    setProcessedImage(null);
    setPreviewUrl(null);
    setImageInfo(null);
    setProgress(0);
    maxProgressRef.current = 0;
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    showToast("info", "🔄 Đã làm mới. Bạn có thể tải ảnh mới lên.");
  };

  return (
    <div className="min-h-screen w-full font-test">
      {/* Button to back to homepage */}
      <Link
        to="/"
        className="fixed top-4 left-4 z-50 flex items-center gap-2 bg-[#33A1E0] pl-5 pr-6 py-3 text-white font-bold rounded-full hover:bg-[#154D71] shadow-lg transition-all duration-300"
      >
        <FaChevronLeft />
        {/* Arrow icon */}
        <span>Trang chủ</span>
      </Link>
      {/* Main Content */}
      <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-6xl font-bold  mb-4  bg-clip-text text-transparent bg-gradient-to-r from-[#33A1E0] to-blue-700 py-4">
            Remove Background Free
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Tốc độ xử lý ảnh tùy vào hiệu năng thiết bị và kích thước ảnh. Ảnh lớn
            sẽ xử lý chậm hơn. Khuyến nghị resize ảnh nhỏ hơn để tối ưu tốc độ!
          </p>
        </div>

        {/* Upload Section */}
        <div className="mb-8 ">
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
                className="cursor-pointer w-full max-w-2xl"
              >
                <div className="group border-4 border-dashed border-gray rounded-xl p-12 text-center transition-all duration-300 hover:border-blue-500 hover:bg-blue-50">
                  <FaImage
                    size={64}
                    className="mx-auto mb-4 text-gray-400 group-hover:text-blue-500 duration-300"
                  />
                  <p className="text-xl font-semibold mb-2 text-gray-800">
                    Ấn vào đây hoặc kéo thả ảnh để tải lên
                  </p>
                  <p className="text-sm text-gray-500">
                    Hỗ trợ định dạng PNG, JPG, JPEG. Dung lượng tối đa 10MB.
                  </p>
                </div>
              </label>
            ) : (
              <div className="w-fit">
                {/* Image Preview */}
                <div className="relative mb-6">
                  <div className="relative flex justify-center items-center">
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="max-h-[300px] w-auto mx-auto rounded-lg"
                      style={{
                        background:
                          "repeating-conic-gradient(#e5e5e5 0% 25%, #f5f5f5 0% 50%) 50% / 20px 20px",
                      }}
                    />
                    {isProcessing && (
                      <div className="absolute inset-0 flex items-center justify-center bg-[rgba(0,0,0,.6)] rounded-lg">
                        <div className="text-white text-center px-8">
                          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-white mx-auto mb-4"></div>
                          <p className="text-lg font-semibold mb-4">
                            Đang xử lý...
                          </p>

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

                  {/* Image Info */}
                  {imageInfo && (
                    <div className="mt-8 flex flex-wrap gap-4 justify-center items-center text-sm">
                      <div className="flex items-center gap-2 px-4 py-2 rounded-lg border-[1px] border-[rgba(0,0,0,.1)]">
                        <span className="font-semibold text-gray-700 flex items-center gap-2">
                          <span>
                            {" "}
                            <FaRuler />
                          </span>
                          <span>Kích thước:</span>
                        </span>
                        <span className="text-gray-600">
                          {imageInfo.width} x {imageInfo.height} px
                        </span>
                      </div>
                      <div className="flex items-center gap-2 px-4 py-2 rounded-lg border-[1px] border-[rgba(0,0,0,.1)]">
                        <span className="font-semibold text-gray-700 flex items-center gap-2">
                          <span>
                            <FaSave />
                          </span>{" "}
                          <span>Dung lượng:</span>
                        </span>
                        <span className="text-gray-600">
                          {imageInfo.sizeText}
                        </span>
                      </div>
                      {(imageInfo.size > 3 * 1024 * 1024 ||
                        imageInfo.width > 2000 ||
                        imageInfo.height > 2000) && (
                        <div className="w-full mt-2 px-4 py-6 rounded-lg  border-[1px] border-[rgba(0,0,0,.1)]">
                          <span className="flex gap-2 items-center">
                            <span>
                              <FaExclamationTriangle size={16} />
                            </span>
                            <span>
                              Ảnh lớn sẽ xử lý chậm hơn. Khuyến nghị resize ảnh
                              nhỏ hơn để tối ưu tốc độ!
                            </span>
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-4 justify-center mt-6">
                  {!processedImage ? (
                    <>
                      <button
                        onClick={removeBackgroundAI}
                        disabled={isProcessing}
                        className="bg-gradient-to-r from-[#33A1E0] to-[#1E88E5] text-white px-6 py-3 rounded-full font-semibold text-lg shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3 hover:opacity-80"
                      >
                        <FaBrain size={20} />
                        Xóa Nền Ngay
                      </button>
                      <label
                        htmlFor="file-upload"
                        className=" text-gray-700 px-6 py-3 rounded-full font-semibold text-lg border-2 border-gray-700 transition-all duration-300 flex items-center gap-3 cursor-pointer hover:opacity-60"
                      >
                        <FaImage size={20} />
                        Choose Another
                      </label>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={downloadImage}
                        className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-full font-semibold text-lg shadow-lg transition-all duration-300 hover:shadow-xl flex items-center gap-3"
                      >
                        <FaDownload size={20} />
                        Tải xuống
                      </button>
                      <button
                        onClick={() => setPreviewUrl(originalImage)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full font-semibold text-lg shadow-lg transition-all duration-300 hover:shadow-xl flex items-center gap-3"
                      >
                        <FaImage size={20} />
                        Xem ảnh gốc
                      </button>
                      <button
                        onClick={() => setPreviewUrl(processedImage)}
                        className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-full font-semibold text-lg shadow-lg transition-all duration-300 hover:shadow-xl flex items-center gap-3"
                      >
                        <FaImage size={20} />
                        Ảnh đã xử lý
                      </button>
                      <button
                        onClick={handleReset}
                        className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-full font-semibold text-lg shadow-lg transition-all duration-300 hover:shadow-xl flex items-center gap-3"
                      >
                        <FaTrash size={20} />
                        Ảnh mới
                      </button>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          {[
            {
              icon: <FaUpload size={24} />,
              title: "Tải Ảnh Lên Dễ Dàng",
              description: "Upload ảnh của bạn chỉ với vài cú nhấp chuột",
            },
            {
              icon: <FaImage size={24} />,
              title: "Xóa Phông Nền Nhanh Chóng",
              description:
                "Xóa phông nền trong vài giây với thuật toán thông minh của chúng tôi",
            },
            {
              icon: <FaDownload size={24} />,
              title: "Tải Xuống Ảnh Miễn Phí",
              description: "Tải xuống ảnh đã xử lý với nền trong suốt",
            },
          ].map((feature, index) => (
            <div
              key={index}
              className="p-6 text-center bg-white rounded-xl border border-gray-200 transition-shadow duration-300"
            >
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-blue-100 mb-4">
                <div className="text-blue-600">{feature.icon}</div>
              </div>
              <h3 className="text-lg font-semibold mb-2 text-gray-800">
                {feature.title}
              </h3>
              <p className="text-sm text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Note Section */}
        {/* <div className="mt-12 bg-blue-50 border-2 border-blue-200 rounded-xl p-6 shadow-md">
          <p className="text-center text-gray-700 text-sm">
            <strong className="text-blue-600">Note:</strong> This tool is
            developed by Paul To and free to use. For best results, use images
            with clear subjects and contrasting backgrounds.
          </p>
        </div> */}
      </div>

      {/* Hidden canvas for processing */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default RemoveBackground;
