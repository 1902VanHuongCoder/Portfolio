import { motion } from "framer-motion";
import { useContext } from "react";
import { ThemeContext } from "../../contexts/ThemeContext";
import { Link } from "react-router-dom";
import { FaCode, FaImage, FaFileWord, FaPaintBrush } from "react-icons/fa";

const Tools = () => {
  const { theme } = useContext(ThemeContext);

  const tools = [
    {
      id: 1,
      title: "Code Syntax Highlighter",
      description: "Hiển thị mã nguồn với syntax highlighting đẹp mắt, hỗ trợ 25+ ngôn ngữ lập trình",
      icon: <FaCode size={40} />,
      link: "/code-highlighter-tool",
      color: "from-blue-500 to-purple-600",
    },
    {
      id: 2,
      title: "Remove Background",
      description: "Xóa nền ảnh tự động bằng AI, nhanh chóng và chính xác",
      icon: <FaImage size={40} />,
      link: "/remove-bg-tool",
      color: "from-green-500 to-teal-600",
    },
    {
      id: 3,
      title: "PDF to Word",
      description: "Chuyển đổi file PDF sang Word, giữ nguyên format và hình ảnh",
      icon: <FaFileWord size={40} />,
      link: "/pdf-to-word-tool",
      color: "from-red-500 to-pink-600",
    },
  ];

  const styleBasedOnTheme = () => {
    if (theme?.themeSlug === "christmas") {
      return {
        containerStyle: "bg-transparent",
        headingStyle: "text-white",
        subheadingStyle: "text-white/80",
        cardStyle: "bg-white/10 backdrop-blur-xl border-white/20 hover:bg-white/20",
        textStyle: "text-white",
        descStyle: "text-white/70",
      };
    } else if (theme?.themeSlug === "new-year") {
      return {
        containerStyle: "bg-transparent",
        headingStyle: "text-[#EEBF17]",
        subheadingStyle: "text-[#F17B00]",
        cardStyle: "bg-white/10 backdrop-blur-xl border-[#EEBF17]/30 hover:bg-white/20",
        textStyle: "text-white",
        descStyle: "text-white/70",
      };
    } else {
      return {
        containerStyle: "bg-gray-50",
        headingStyle: "text-[#154D71]",
        subheadingStyle: "text-[#33A1E0]",
        cardStyle: "bg-white border-gray-200 hover:shadow-2xl hover:border-[#33A1E0]/50",
        textStyle: "text-[#154D71]",
        descStyle: "text-gray-600",
      };
    }
  };

  const styles = styleBasedOnTheme();

  return (
    <section
      id="tools"
      className={`relative min-h-screen py-20 px-4 sm:px-6 lg:px-8 ${styles.containerStyle}`}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className={`text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-4 ${styles.headingStyle}`}>
            Useful Tools
          </h2>
          <p className={`text-lg sm:text-xl ${styles.subheadingStyle} max-w-2xl mx-auto`}>
            Các công cụ hữu ích được tích hợp mã nguồn mở để hỗ trợ công việc của bạn
          </p>
        </motion.div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {tools.map((tool, index) => (
            <motion.div
              key={tool.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05 }}
              className="group"
            >
              <Link to={tool.link} className="block h-full">
                <div
                  className={`${styles.cardStyle} border-2 rounded-2xl p-8 shadow-lg transition-all duration-300 h-full flex flex-col`}
                >
                  {/* Icon with gradient background */}
                  <div
                    className={`inline-block p-4 rounded-2xl mb-6 bg-gradient-to-br ${tool.color} transform group-hover:scale-110 transition-transform duration-300 w-fit`}
                  >
                    <div className="text-white">{tool.icon}</div>
                  </div>

                  {/* Title */}
                  <h3 className={`text-2xl font-bold mb-4 ${styles.textStyle} group-hover:text-[#33A1E0] transition-colors`}>
                    {tool.title}
                  </h3>

                  {/* Description */}
                  <p className={`${styles.descStyle} leading-relaxed flex-grow`}>
                    {tool.description}
                  </p>

                  {/* Arrow icon */}
                  <div className="mt-6 flex items-center gap-2">
                    <span className={`font-semibold ${styles.subheadingStyle} group-hover:text-[#33A1E0] transition-colors`}>
                      Try it now
                    </span>
                    <span className={`text-2xl ${styles.subheadingStyle} group-hover:text-[#33A1E0] group-hover:translate-x-2 transition-all`}>
                      →
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Coming Soon */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <p className={`text-lg ${styles.descStyle}`}>
            🚀 Nhiều công cụ hữu ích khác đang được phát triển...
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default Tools;
