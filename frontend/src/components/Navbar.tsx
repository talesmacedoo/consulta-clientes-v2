import { NavLink } from 'react-router-dom';
import { Search, Calculator, Building2, Bot, Phone } from 'lucide-react';

const navItems = [
  { path: '/', label: 'Consulta Cliente', icon: Search },
  { path: '/quitacao', label: 'Quitação', icon: Calculator },
  { path: '/bancos', label: 'Bancos', icon: Building2 },
  { path: '/ia', label: 'IA', icon: Bot },
  { path: '/whatsapp', label: 'WhatsApp', icon: Phone },
];

const Navbar = () => {
  return (
    <nav className="fixed left-0 top-0 h-screen w-56 bg-sidebar border-r border-sidebar-border flex flex-col z-50">
      {/* Logo */}
      <div className="p-5 border-b border-sidebar-border">
        <h1 className="text-lg font-bold text-sidebar-foreground">
          Sales<span className="text-sidebar-primary">Hub</span>
        </h1>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 py-4 px-2 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
              }`
            }
          >
            <item.icon className="w-4 h-4" />
            {item.label}
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default Navbar;
