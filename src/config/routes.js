import Home from '@/components/pages/Home';
import Watch from '@/components/pages/Watch';
import Search from '@/components/pages/Search';
import History from '@/components/pages/History';
import Channel from '@/components/pages/Channel';

export const routes = {
  home: {
    id: 'home',
    label: 'Home',
    path: '/home',
    icon: 'Home',
    component: Home
  },
  watch: {
    id: 'watch',
    label: 'Watch',
    path: '/watch/:videoId',
    icon: 'Play',
    component: Watch,
    hideInNav: true
  },
  search: {
    id: 'search',
    label: 'Search',
    path: '/search',
    icon: 'Search',
    component: Search
  },
  history: {
    id: 'history',
    label: 'History',
    path: '/history',
    icon: 'History',
    component: History
  },
  channel: {
    id: 'channel',
    label: 'Channel',
    path: '/channel/:channelId',
    icon: 'User',
    component: Channel,
    hideInNav: true
  }
};

export const routeArray = Object.values(routes);
export default routes;