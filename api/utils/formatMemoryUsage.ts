import os from 'os';
import logger from './logger';
export default function formatMemoryUsage() {
  const data = process.memoryUsage();
  return {
    rss: `${(data.rss / 1024 / 1024).toFixed(2)} MB`,
    heapTotal: `${(data.heapTotal / 1024 / 1024).toFixed(2)} MB`,
    heapUsed: `${(data.heapUsed / 1024 / 1024).toFixed(2)} MB`,
    external: `${(data.external / 1024 / 1024).toFixed(2)} MB`,
  };
};

export function highCPUload(): boolean {
  const [avg1, _avg5, _avg15] = os.loadavg()
  if (avg1! > 0.3) {
    logger.trace({ action: 'high cpu load', avg1, _avg5, _avg15 })
    return true
  }
  return false
}
