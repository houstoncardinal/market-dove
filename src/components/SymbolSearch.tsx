import { useState } from 'react';
import { Search } from 'lucide-react';
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
    <form onSubmit={handleSearch} className="flex gap-2">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search symbol or company..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-10 bg-input/50 border-border/50 focus:border-primary/50 focus:ring-primary/20"
        />
      </div>
      <Button type="submit" className="bg-primary hover:bg-primary/90">
        Add
      </Button>
    </form>
  );
}
