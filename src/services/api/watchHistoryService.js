const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class WatchHistoryService {
  constructor() {
    this.history = JSON.parse(localStorage.getItem('viewtube_watch_history') || '[]');
  }

  async getAll() {
    await delay(200);
    return [...this.history].sort((a, b) => new Date(b.watchedAt) - new Date(a.watchedAt));
  }

  async add(videoId, progress = 0) {
    await delay(100);
    
    // Remove existing entry for this video
    this.history = this.history.filter(item => item.videoId !== videoId);
    
    // Add new entry
    const historyItem = {
      videoId,
      watchedAt: new Date().toISOString(),
      progress
    };
    
    this.history.unshift(historyItem);
    
    // Keep only last 100 items
    if (this.history.length > 100) {
      this.history = this.history.slice(0, 100);
    }
    
    localStorage.setItem('viewtube_watch_history', JSON.stringify(this.history));
    return { ...historyItem };
  }

  async updateProgress(videoId, progress) {
    await delay(50);
    const item = this.history.find(h => h.videoId === videoId);
    if (item) {
      item.progress = progress;
      localStorage.setItem('viewtube_watch_history', JSON.stringify(this.history));
      return { ...item };
    }
    return null;
  }

  async delete(videoId) {
    await delay(100);
    this.history = this.history.filter(item => item.videoId !== videoId);
    localStorage.setItem('viewtube_watch_history', JSON.stringify(this.history));
    return true;
  }

  async clear() {
    await delay(150);
    this.history = [];
    localStorage.setItem('viewtube_watch_history', JSON.stringify(this.history));
    return true;
  }

  async getByVideoId(videoId) {
    await delay(50);
    const item = this.history.find(h => h.videoId === videoId);
    return item ? { ...item } : null;
  }
}

export default new WatchHistoryService();