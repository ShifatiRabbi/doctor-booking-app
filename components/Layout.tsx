
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

  // Dynamic Theme based on Branch Configuration
  const getThemeColors = () => {
    switch (currentBranch?.colorTheme) {
      case 'emerald': return { bg: 'bg-emerald-600', light: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-200' };
      case 'indigo': return { bg: 'bg-indigo-600', light: 'bg-indigo-50', text: 'text-indigo-600', border: 'border-indigo-200' };
      case 'rose': return { bg: 'bg-rose-600', light: 'bg-rose-50', text: 'text-rose-600', border: 'border-rose-200' };
      case 'orange': return { bg: 'bg-orange-600', light: 'bg-orange-50', text: 'text-orange-600', border: 'border-orange-200' };
      default: return { bg: 'bg-blue-600', light: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-200' };
    }
  };

  const theme = getThemeColors();

  const handleBranchSwitch = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setBranch(e.target.value);
  };

  const renderNavLinks = () => {
    if (!currentUser) return null;

    const linkBase = "flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors cursor-pointer";
    const activeClass = "bg-white/10 text-white";
    const inactiveClass = "text-white/70 hover:bg-white/5 hover:text-white";

    const LinkItem = ({ icon: Icon, label, id }: { icon: any, label: string, id: string }) => (
      <div 
        onClick={() => onNavigate && onNavigate(id)}
        className={`${linkBase} ${activePage === id ? activeClass : inactiveClass}`}
      >
        <Icon size={20} />
        {label}
      </div>
    );

    if (currentUser.role === 'admin') {
      return (
        <>
          <LinkItem icon={LayoutDashboard} label="Overview" id="dashboard" />
          <LinkItem icon={UserPlus} label="Doctor Mgmt" id="doctors" />
          <LinkItem icon={Settings} label="Branch Mgmt" id="branches" />
          <LinkItem icon={Users} label="Patients" id="patients" />
          <LinkItem icon={Users} label="Employees" id="employees" />
          <LinkItem icon={Activity} label="Reports" id="reports" />
        </>
      );
    } else if (currentUser.role === 'employee') {
      return (
        <>
          <LinkItem icon={LayoutDashboard} label="Front Desk" id="dashboard" />
          <LinkItem icon={Calendar} label="Bookings" id="bookings" />
          <LinkItem icon={Users} label="Patient Search" id="patient-search" />
        </>
      );
    } else if (currentUser.role === 'doctor') {
      return (
        <>
          <LinkItem icon={LayoutDashboard} label="My Dashboard" id="dashboard" />
          <LinkItem icon={FileText} label="Prescriptions" id="prescriptions" />
        </>
      );
    }
    return null;
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-gray-50 no-print">
      {/* Sidebar */}
      <aside className={`w-64 flex-shrink-0 flex flex-col ${theme.bg} text-white shadow-xl transition-colors duration-300`}>
        <div className="p-6 border-b border-white/10">
          <h1 className="text-2xl font-bold tracking-tight">MediNexus</h1>
          <p className="text-xs text-white/60 mt-1">{currentBranch?.name}</p>
        </div>
        
        <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1">
          {renderNavLinks()}
        </nav>

        <div className="p-4 border-t border-white/10">
           {currentUser?.role === 'admin' && (
              <div className="mb-4">
                <label className="text-xs text-white/60 block mb-1">Switch Branch Panel</label>
                <select 
                  className="w-full bg-white/10 border border-white/20 rounded text-sm p-2 text-white outline-none focus:ring-1 focus:ring-white/50"
                  value={currentBranch?.id}
                  onChange={handleBranchSwitch}
                >
                  {branches.map(b => (
                    <option key={b.id} value={b.id} className="text-gray-800">{b.name}</option>
                  ))}
                </select>
              </div>
           )}
          <div className="flex items-center gap-3 px-2 py-2">
            <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center font-bold">
              {currentUser?.name.charAt(0)}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-medium truncate">{currentUser?.name}</p>
              <p className="text-xs text-white/60 capitalize">{currentUser?.role}</p>
            </div>
            <button onClick={logout} className="text-white/70 hover:text-white p-1" title="Logout">
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content with Custom Header/Footer */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Dynamic Branch Header */}
        <header className={`bg-white shadow-sm border-b ${theme.border} py-3 px-8 flex justify-between items-center z-10`}>
          <div>
            <h2 className={`font-bold text-lg ${theme.text}`}>{currentBranch?.headerTitle || currentBranch?.name}</h2>
            <p className="text-xs text-gray-500">{currentBranch?.location}</p>
          </div>
          <div className="text-sm text-gray-500">
             Helpline: <span className="font-semibold">{currentBranch?.contact}</span>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8 relative scroll-smooth">
          <div className="max-w-7xl mx-auto pb-12">
             {children}
          </div>
        </div>

        {/* Dynamic Branch Footer */}
        <footer className="bg-white border-t py-3 px-8 text-center text-xs text-gray-400">
          <p>{currentBranch?.footerText || `© ${new Date().getFullYear()} MediNexus Hospital System`}</p>
        </footer>
      </main>
    </div>
  );
};

export default Layout;
