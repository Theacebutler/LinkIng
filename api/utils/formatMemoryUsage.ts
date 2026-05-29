export default function formatMemoryUsage() {
  const data = process.memoryUsage();
  return {
    rss: `${(data.rss / 1024 / 1024).toFixed(2)} MB`,
    heapTotal: `${(data.heapTotal / 1024 / 1024).toFixed(2)} MB`,
    heapUsed: `${(data.heapUsed / 1024 / 1024).toFixed(2)} MB`,
    external: `${(data.external / 1024 / 1024).toFixed(2)} MB`,
  };
};
