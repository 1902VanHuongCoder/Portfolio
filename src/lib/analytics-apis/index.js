import { collection, addDoc, getDocs, query, where, orderBy, limit, Timestamp, updateDoc, doc, increment } from "firebase/firestore";
import { db } from "../../firebase_setup/firebase";

// Get user IP address with multiple fallback options
const getUserIP = async () => {
  console.log('🔍 Starting IP detection...');
  
  const ipServices = [
    { 
      url: 'https://api.ipify.org?format=json', 
      parse: (data) => data.ip 
    },
    { 
      url: 'https://api64.ipify.org?format=json', 
      parse: (data) => data.ip 
    },
    { 
      url: 'https://api.my-ip.io/ip.json', 
      parse: (data) => data.ip 
    },
    { 
      url: 'https://ipapi.co/json/', 
      parse: (data) => data.ip 
    },
    { 
      url: 'https://api.seeip.org/jsonip', 
      parse: (data) => data.ip 
    }
  ];
  
  for (const service of ipServices) {
    try {
      console.log(`⏳ Trying ${service.url}...`);
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 second timeout
      
      const response = await fetch(service.url, { 
        signal: controller.signal,
        headers: { 
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        mode: 'cors'
      });
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        console.warn(`⚠️ ${service.url} returned status ${response.status}`);
        continue;
      }
      
      const data = await response.json();
      console.log(`📦 Response from ${service.url}:`, data);
      
      const ip = service.parse(data);
      
      if (ip && ip !== 'undefined' && ip !== null) {
        console.log(`✅ IP address obtained: ${ip} from ${service.url}`);
        return ip;
      } else {
        console.warn(`⚠️ IP value invalid:`, ip);
      }
    } catch (error) {
      console.error(`❌ Failed to get IP from ${service.url}:`, error.name, error.message);
      continue;
    }
  }
  
  console.error("❌ All IP services failed, returning 'Unknown'");
  return "Unknown";
};

// Track page view
export const trackPageView = async (pageName, pageUrl, additionalData = {}) => {
  try {
    const ipAddress = await getUserIP();
    console.log('📊 Tracking page view:', { pageName, pageUrl, ipAddress });
    
    const analyticsRef = collection(db, "analytics");
    const docRef = await addDoc(analyticsRef, {
      pageName,
      pageUrl,
      timestamp: Timestamp.now(),
      userAgent: navigator.userAgent,
      referrer: document.referrer || "direct",
      ipAddress,
      ...additionalData,
    });
    
    console.log('✅ Page view tracked successfully:', docRef.id);
  } catch (error) {
    console.error("❌ Error tracking page view:", error);
  }
};

// Increment blog view count
export const incrementBlogView = async (blogId) => {
  try {
    const blogRef = doc(db, "blogs", blogId);
    await updateDoc(blogRef, {
      viewCount: increment(1),
      lastViewed: Timestamp.now(),
    });
  } catch (error) {
    console.error("Error incrementing blog view:", error);
  }
};

// Get total page views
export const getTotalPageViews = async () => {
  try {
    const analyticsRef = collection(db, "analytics");
    const snapshot = await getDocs(analyticsRef);
    return snapshot.size;
  } catch (error) {
    console.error("Error getting total page views:", error);
    return 0;
  }
};

// Get page views by page name
export const getPageViewsByPage = async (pageName) => {
  try {
    const analyticsRef = collection(db, "analytics");
    const q = query(analyticsRef, where("pageName", "==", pageName));
    const snapshot = await getDocs(q);
    return snapshot.size;
  } catch (error) {
    console.error("Error getting page views by page:", error);
    return 0;
  }
};

// Get all analytics grouped by page
export const getAnalyticsByPage = async () => {
  try {
    const analyticsRef = collection(db, "analytics");
    const snapshot = await getDocs(analyticsRef);
    
    const pageViews = {};
    snapshot.forEach((doc) => {
      const data = doc.data();
      const pageName = data.pageName;
      if (pageViews[pageName]) {
        pageViews[pageName]++;
      } else {
        pageViews[pageName] = 1;
      }
    });
    
    return pageViews;
  } catch (error) {
    console.error("Error getting analytics by page:", error);
    return {};
  }
};

// Get recent page views
export const getRecentPageViews = async (limitCount = 50) => {
  try {
    const analyticsRef = collection(db, "analytics");
    const q = query(analyticsRef, orderBy("timestamp", "desc"), limit(limitCount));
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Error getting recent page views:", error);
    return [];
  }
};

// Get analytics by date range
export const getAnalyticsByDateRange = async (startDate, endDate) => {
  try {
    const analyticsRef = collection(db, "analytics");
    const q = query(
      analyticsRef,
      where("timestamp", ">=", Timestamp.fromDate(startDate)),
      where("timestamp", "<=", Timestamp.fromDate(endDate)),
      orderBy("timestamp", "desc")
    );
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Error getting analytics by date range:", error);
    return [];
  }
};

// Get analytics summary
export const getAnalyticsSummary = async () => {
  try {
    const [totalViews, pageViews, recentViews] = await Promise.all([
      getTotalPageViews(),
      getAnalyticsByPage(),
      getRecentPageViews(10),
    ]);
    
    return {
      totalViews,
      pageViews,
      recentViews,
    };
  } catch (error) {
    console.error("Error getting analytics summary:", error);
    return {
      totalViews: 0,
      pageViews: {},
      recentViews: [],
    };
  }
};

// Get blog view counts
export const getBlogViewCounts = async () => {
  try {
    const blogsRef = collection(db, "blogs");
    const snapshot = await getDocs(blogsRef);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      title: doc.data().title,
      viewCount: doc.data().viewCount || 0,
      lastViewed: doc.data().lastViewed,
    })).sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0));
  } catch (error) {
    console.error("Error getting blog view counts:", error);
    return [];
  }
};
