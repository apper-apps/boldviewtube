import videoData from '../mockData/videos.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class VideoService {
  constructor() {
    this.videos = [...videoData];
  }

  async getAll() {
    await delay(300);
    return [...this.videos];
  }

  async getById(id) {
    await delay(200);
    const video = this.videos.find(v => v.id === id);
    if (!video) {
      throw new Error('Video not found');
    }
    return { ...video };
  }

  async search(query) {
    await delay(400);
    if (!query) return [...this.videos];
    
    const searchTerm = query.toLowerCase();
    return this.videos.filter(video => 
      video.title.toLowerCase().includes(searchTerm) ||
      video.description.toLowerCase().includes(searchTerm)
    );
  }

  async getByChannel(channelId) {
    await delay(300);
    return this.videos.filter(video => video.channelId === channelId);
  }

  async getTrending(limit = 10) {
    await delay(250);
    return [...this.videos]
      .sort((a, b) => b.views - a.views)
      .slice(0, limit);
  }

  async getRelated(videoId, limit = 8) {
    await delay(200);
    const currentVideo = this.videos.find(v => v.id === videoId);
    if (!currentVideo) return [];
    
    // Simple related algorithm - same channel or similar views
    return this.videos
      .filter(v => v.id !== videoId)
      .filter(v => v.channelId === currentVideo.channelId || 
        Math.abs(v.views - currentVideo.views) < currentVideo.views * 0.5)
      .slice(0, limit);
  }

  async incrementViews(id) {
    await delay(100);
    const video = this.videos.find(v => v.id === id);
    if (video) {
      video.views += 1;
      return { ...video };
    }
    throw new Error('Video not found');
  }
}

export default new VideoService();