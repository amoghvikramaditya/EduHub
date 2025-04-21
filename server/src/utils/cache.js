const fs = require("fs");
const path = require("path");

// Ensure cache directory exists
const CACHE_DIR = path.join(__dirname, "../../cache");
if (!fs.existsSync(CACHE_DIR)) {
  fs.mkdirSync(CACHE_DIR, { recursive: true });
}

// Generate a safe filename from the subject name
const getCacheFilename = (subject, type) => {
  const safeName = subject.toLowerCase().replace(/[^a-z0-9]/g, "_");
  return path.join(CACHE_DIR, `${safeName}_${type}.json`);
};

// Read from cache
const getFromCache = (subject, type) => {
  try {
    const cacheFile = getCacheFilename(subject, type);
    if (fs.existsSync(cacheFile)) {
      const data = fs.readFileSync(cacheFile, "utf8");
      return JSON.parse(data);
    }
  } catch (error) {
    console.error("Cache read error:", error);
  }
  return null;
};

// Write to cache
const writeToCache = (subject, type, data) => {
  try {
    const cacheFile = getCacheFilename(subject, type);
    fs.writeFileSync(cacheFile, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error("Cache write error:", error);
    return false;
  }
};

module.exports = {
  getFromCache,
  writeToCache,
};
