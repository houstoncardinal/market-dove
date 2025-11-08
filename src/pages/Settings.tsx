import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAppStore } from '@/store/appStore';
import { ArrowLeft, AlertTriangle } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DataSource } from '@/types/market';
import { useState } from 'react';

export default function Settings() {
  const navigate = useNavigate();
  const { dataSource, alphaVantageKey, setDataSource, setAlphaVantageKey, disclaimerAccepted } = useAppStore();
  const [localKey, setLocalKey] = useState(alphaVantageKey);

  const handleSaveKey = () => {
    setAlphaVantageKey(localKey);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/50 bg-card/30 backdrop-blur-xl sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/')}
              className="hover:bg-primary/10"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl font-bold">Settings</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 max-w-2xl">
        <Card className="glass-card p-6 mb-4">
          <h3 className="text-lg font-semibold mb-4">Data Source</h3>
          <div className="space-y-4">
            <div>
              <Label htmlFor="data-source">Select Data Provider</Label>
              <Select value={dataSource} onValueChange={(value: DataSource) => setDataSource(value)}>
                <SelectTrigger id="data-source" className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="stooq">Stooq (Free, No Key)</SelectItem>
                  <SelectItem value="yahoo">Yahoo Finance (Free, No Key)</SelectItem>
                  <SelectItem value="alphavantage">Alpha Vantage (Requires Key)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {dataSource === 'alphavantage' && (
              <div>
                <Label htmlFor="api-key">Alpha Vantage API Key</Label>
                <div className="flex gap-2 mt-2">
                  <Input
                    id="api-key"
                    type="password"
                    placeholder="Enter your API key"
                    value={localKey}
                    onChange={(e) => setLocalKey(e.target.value)}
                    className="flex-1"
                  />
                  <Button onClick={handleSaveKey}>
                    Save
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Get a free key at{' '}
                  <a
                    href="https://www.alphavantage.co/support/#api-key"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    alphavantage.co
                  </a>
                </p>
              </div>
            )}
          </div>
        </Card>

        <Card className="glass-card p-6 border-warning/30">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-full bg-warning/20 mt-1">
              <AlertTriangle className="h-5 w-5 text-warning" />
            </div>
            <div>
              <h3 className="font-semibold mb-2">Legal Disclaimer</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Cardinal Quant is for educational and informational purposes only. This is NOT investment advice. 
                Market data may be delayed or inaccurate. You are solely responsible for your own investment decisions. 
                Trading involves substantial risk of loss.
              </p>
            </div>
          </div>
        </Card>
      </main>
    </div>
  );
}
