import channelData from '../mockData/channels.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class ChannelService {
  constructor() {
    this.channels = [...channelData];
  }

  async getAll() {
    await delay(300);
    return [...this.channels];
  }

  async getById(id) {
    await delay(200);
    const channel = this.channels.find(c => c.id === id);
    if (!channel) {
      throw new Error('Channel not found');
    }
    return { ...channel };
  }

  async search(query) {
    await delay(350);
    if (!query) return [...this.channels];
    
    const searchTerm = query.toLowerCase();
    return this.channels.filter(channel => 
      channel.name.toLowerCase().includes(searchTerm)
    );
  }
}

export default new ChannelService();