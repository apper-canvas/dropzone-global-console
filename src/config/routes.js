import Home from '@/components/pages/Home';
import Dashboard from '@/components/pages/Dashboard';

export const routes = {
  home: {
    id: 'home',
    label: 'DropZone',
    path: '/',
    icon: 'Upload',
    component: Home
  },
  dashboard: {
    id: 'dashboard',
    label: 'Dashboard',
    path: '/dashboard',
    icon: 'BarChart3',
    component: Dashboard
  }
};

export const routeArray = Object.values(routes);
export default routes;