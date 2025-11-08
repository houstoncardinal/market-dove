import { useState } from 'react';
import { Search, Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAppStore } from '@/store/appStore';
import { useNavigate } from 'react-router-dom';

export function SymbolSearch() {
  const [query, setQuery] = useState('');
  const { addToWatchlist } = useAppStore();
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    const symbol = query.toUpperCase().trim();
    addToWatchlist(symbol);
    navigate(`/symbol/${symbol}`);
    setQuery('');
  };

  return (
    <form onSubmit={handleSearch} className="flex gap-2 w-full">
      <div className="relative flex-1">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search symbol (e.g., AAPL, MSFT)..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-11 h-11 bg-input/50 border-border focus:border-primary/50 focus:ring-2 focus:ring-primary/20 font-medium placeholder:text-muted-foreground/60"
        />
      </div>
      <Button 
        type="submit" 
        className="h-11 px-6 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 gap-2"
      >
        <Plus className="h-4 w-4" />
        <span className="hidden sm:inline">Add</span>
      </Button>
    </form>
  );
}
