import { useEffect, useState } from "react";
import {
  getAnalyticsSummary,
  getBlogViewCounts,
} from "../../lib/analytics-apis";
import { motion } from "framer-motion";
import {
  FaEye,
  FaHome,
  FaBlog,
  FaChartLine,
  FaClock,
  FaGlobe,
} from "react-icons/fa";

const Analytics = () => {
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState({
    totalViews: 0,
    pageViews: {},
    recentViews: [],
  });
  const [blogViews, setBlogViews] = useState([]);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const [summary, blogs] = await Promise.all([
        getAnalyticsSummary(),
        getBlogViewCounts(),
      ]);
      console.log('📊 Analytics fetched:', summary);
      console.log('🔍 Recent views with IP:', summary.recentViews.map(v => ({ 
        page: v.pageName, 
        ip: v.ipAddress 
      })));
      setAnalytics(summary);
      setBlogViews(blogs);
    } catch (error) {
      console.error("Error fetching analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  const getPageIcon = (pageName) => {
    switch (pageName?.toLowerCase()) {
      case "home":
        return <FaHome />;
      case "blogs":
      case "blog list":
        return <FaBlog />;
      case "blog detail":
        return <FaEye />;
      default:
        return <FaChartLine />;
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return "N/A";
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#33A1E0]"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-bold text-[#154D71] mb-2 flex items-center gap-3">
          <FaChartLine />
          Website Analytics
        </h1>
        <p className="text-[#33A1E0]">
          Track and monitor your website traffic and engagement
        </p>
      </motion.div>

      {/* Total Views Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="bg-gradient-to-br from-[#154D71] to-[#33A1E0] rounded-2xl p-8 shadow-xl mb-8 text-white"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white/80 text-lg mb-2">Total Page Views</p>
            <h2 className="text-5xl font-bold">{analytics.totalViews.toLocaleString()}</h2>
          </div>
          <div className="bg-white/20 p-6 rounded-full">
            <FaEye size={48} />
          </div>
        </div>
      </motion.div>

      {/* Page Views Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
      >
        {Object.entries(analytics.pageViews).map(([pageName, count], index) => (
          <motion.div
            key={pageName}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + index * 0.1 }}
            className="bg-white rounded-xl p-6 shadow-lg border-2 border-[#33A1E0]/20 hover:border-[#33A1E0]/50 transition-all"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-[#33A1E0]/10 p-3 rounded-lg text-[#33A1E0] text-2xl">
                {getPageIcon(pageName)}
              </div>
              <div>
                <p className="text-gray-500 text-sm">Page Views</p>
                <h3 className="text-2xl font-bold text-[#154D71]">{count.toLocaleString()}</h3>
              </div>
            </div>
            <p className="text-[#33A1E0] font-semibold capitalize">{pageName}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Blog Views Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-2xl shadow-xl p-6 mb-8 border-2 border-[#33A1E0]/20"
      >
        <h2 className="text-2xl font-bold text-[#154D71] mb-6 flex items-center gap-3">
          <FaBlog />
          Blog Post Views
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-[#33A1E0]/20">
                <th className="text-left py-4 px-4 text-[#154D71] font-semibold">Rank</th>
                <th className="text-left py-4 px-4 text-[#154D71] font-semibold">Blog Title</th>
                <th className="text-right py-4 px-4 text-[#154D71] font-semibold">Views</th>
                <th className="text-right py-4 px-4 text-[#154D71] font-semibold">Last Viewed</th>
              </tr>
            </thead>
            <tbody>
              {blogViews.length > 0 ? (
                blogViews.map((blog, index) => (
                  <motion.tr
                    key={blog.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + index * 0.05 }}
                    className="border-b border-gray-100 hover:bg-[#33A1E0]/5 transition-colors"
                  >
                    <td className="py-4 px-4">
                      <span
                        className={`inline-flex items-center justify-center w-8 h-8 rounded-full font-bold ${
                          index === 0
                            ? "bg-yellow-400 text-yellow-900"
                            : index === 1
                            ? "bg-gray-300 text-gray-700"
                            : index === 2
                            ? "bg-orange-300 text-orange-900"
                            : "bg-[#33A1E0]/10 text-[#33A1E0]"
                        }`}
                      >
                        {index + 1}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-[#154D71] font-medium">{blog.title}</td>
                    <td className="py-4 px-4 text-right">
                      <span className="inline-flex items-center gap-2 bg-[#33A1E0]/10 text-[#33A1E0] px-3 py-1 rounded-full font-semibold">
                        <FaEye />
                        {blog.viewCount.toLocaleString()}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right text-gray-500 text-sm">
                      {blog.lastViewed ? formatDate(blog.lastViewed) : "Never"}
                    </td>
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="py-8 text-center text-gray-400">
                    No blog view data available yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white rounded-2xl shadow-xl p-6 border-2 border-[#33A1E0]/20"
      >
        <h2 className="text-2xl font-bold text-[#154D71] mb-6 flex items-center gap-3">
          <FaClock />
          Recent Activity
        </h2>
        <div className="space-y-4">
          {analytics.recentViews.length > 0 ? (
            analytics.recentViews.map((view, index) => (
              <motion.div
                key={view.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 + index * 0.05 }}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-[#33A1E0]/5 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="bg-[#33A1E0]/10 p-3 rounded-lg text-[#33A1E0]">
                    {getPageIcon(view.pageName)}
                  </div>
                  <div>
                    <p className="font-semibold text-[#154D71]">{view.pageName}</p>
                    <p className="text-sm text-gray-500">{view.pageUrl}</p>
                    <p className="text-xs text-gray-400 flex items-center gap-1 mt-1">
                      <FaGlobe /> 
                      <span className="font-mono">
                        {view.ipAddress || 'IP not available'}
                      </span>
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">
                    {formatDate(view.timestamp)}
                  </p>
                  <p className="text-xs text-gray-400 capitalize">
                    {view.referrer === "direct" ? "Direct" : "Referrer"}
                  </p>
                </div>
              </motion.div>
            ))
          ) : (
            <p className="text-center py-8 text-gray-400">No recent activity</p>
          )}
        </div>
      </motion.div>

      {/* Refresh Button */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mt-8 text-center"
      >
        <button
          onClick={fetchAnalytics}
          className="bg-gradient-to-r from-[#154D71] to-[#33A1E0] hover:from-[#33A1E0] hover:to-[#154D71] text-white px-8 py-3 rounded-xl font-semibold shadow-lg transition-all duration-300 transform hover:scale-105"
        >
          Refresh Analytics
        </button>
      </motion.div>
    </div>
  );
};

export default Analytics;
