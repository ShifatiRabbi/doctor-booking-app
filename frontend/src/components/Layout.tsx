import React from 'react';
import { useApp } from '../context/AppContext';
import { LogOut, LayoutDashboard, UserPlus, Users, Calendar, Activity, Settings, FileText } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  activePage?: string;
  onNavigate?: (page: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activePage, onNavigate }) => {
  const { currentUser, currentBranch, logout, branches, setBranch } = useApp();

  const getThemeColors = () => {
    switch (currentBranch?.colorTheme) {
      case 'emerald': return { bg: 'bg-emerald-600', light: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-200' };
      // Add other cases...
      default: return { bg: 'bg-blue-600', light: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-200' };
    }
  };

  const theme = getThemeColors();

  const handleBranchSwitch = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setBranch(e.target.value);
  };

  const renderNavLinks = () => {
    // Same as original, no changes needed
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-gray-50 no-print">
      {/* Sidebar - same as original */}
      <aside className={`w-64 flex-shrink-0 flex flex-col ${theme.bg} text-white shadow-xl transition-colors duration-300`}>
        {/* ... original content */}
      </aside>
      {/* Main Content - same as original */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* ... original content */}
        {children}
      </main>
    </div>
  );
};

export default Layout;