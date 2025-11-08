import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Settings, PieChart, Bell, Menu, X, TrendingUp, Search } from 'lucide-react';
import { SymbolSearch } from './SymbolSearch';
import { cn } from '@/lib/utils';

export function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { path: '/portfolio', icon: PieChart, label: 'Portfolio' },
    { path: '/alerts', icon: Bell, label: 'Alerts' },
    { path: '/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-success/5 pointer-events-none" />
      
      <div className="container relative mx-auto px-4">
        {/* Main Header Row */}
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo & Brand */}
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-3 group transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary/50 rounded-xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity" />
              <div className="relative w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg">
                <TrendingUp className="h-5 w-5 md:h-6 md:w-6 text-primary-foreground" strokeWidth={2.5} />
              </div>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl md:text-2xl font-bold tracking-tight">
                Cardinal <span className="text-primary glow-text-primary">Quantum</span>
              </h1>
              <p className="text-[10px] md:text-xs text-muted-foreground font-medium tracking-wide uppercase">
                Market Intelligence
              </p>
            </div>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-2">
            {navItems.map((item) => (
              <Button
                key={item.path}
                variant="ghost"
                size="sm"
                onClick={() => navigate(item.path)}
                className={cn(
                  'relative gap-2 transition-all hover:bg-muted/50',
                  isActive(item.path) && 'bg-muted text-foreground'
                )}
              >
                <item.icon className="h-4 w-4" />
                <span className="hidden lg:inline">{item.label}</span>
                {isActive(item.path) && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
                )}
              </Button>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {/* Search Bar - Desktop */}
        <div className="hidden md:block pb-4">
          <SymbolSearch />
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border/30 py-4 space-y-4 animate-fade-in">
            <SymbolSearch />
            <nav className="flex flex-col gap-2">
              {navItems.map((item) => (
                <Button
                  key={item.path}
                  variant={isActive(item.path) ? 'secondary' : 'ghost'}
                  className="justify-start gap-2 w-full"
                  onClick={() => {
                    navigate(item.path);
                    setMobileMenuOpen(false);
                  }}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Button>
              ))}
            </nav>
          </div>
        )}

        {/* Search Bar - Mobile (when menu closed) */}
        {!mobileMenuOpen && (
          <div className="md:hidden pb-3">
            <SymbolSearch />
          </div>
        )}
      </div>

      {/* Bottom Accent Line */}
      <div className="h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
    </header>
  );
}
