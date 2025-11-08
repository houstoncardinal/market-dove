import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Header } from '@/components/Header';
import { useAppStore } from '@/store/appStore';
import { AlertTriangle, Settings as SettingsIcon, Database } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DataSource } from '@/types/market';
import { useState } from 'react';

export default function Settings() {
  const navigate = useNavigate();
  const { dataSource, alphaVantageKey, setDataSource, setAlphaVantageKey } = useAppStore();
  const [localKey, setLocalKey] = useState(alphaVantageKey);

  const handleSaveKey = () => {
    setAlphaVantageKey(localKey);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-6 md:py-8 max-w-3xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
            <SettingsIcon className="h-5 w-5 text-primary" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold">Settings</h1>
        </div>

        {/* Data Source Section */}
        <Card className="glass-card p-6 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
              <Database className="h-4 w-4 text-primary" />
            </div>
            <h3 className="text-lg font-bold">Data Source</h3>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="data-source" className="text-sm font-medium mb-2 block">
                Select Data Provider
              </Label>
              <Select value={dataSource} onValueChange={(value: DataSource) => setDataSource(value)}>
                <SelectTrigger id="data-source" className="h-11 bg-input/50 border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="stooq">
                    <div className="flex flex-col items-start">
                      <span className="font-semibold">Stooq</span>
                      <span className="text-xs text-muted-foreground">Free, No API Key Required</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="yahoo">
                    <div className="flex flex-col items-start">
                      <span className="font-semibold">Yahoo Finance</span>
                      <span className="text-xs text-muted-foreground">Free, No API Key Required</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="alphavantage">
                    <div className="flex flex-col items-start">
                      <span className="font-semibold">Alpha Vantage</span>
                      <span className="text-xs text-muted-foreground">Requires Free API Key</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {dataSource === 'alphavantage' && (
              <div className="pt-4 border-t border-border/30">
                <Label htmlFor="api-key" className="text-sm font-medium mb-2 block">
                  Alpha Vantage API Key
                </Label>
                <div className="flex gap-2">
                  <Input
                    id="api-key"
                    type="password"
                    placeholder="Enter your API key"
                    value={localKey}
                    onChange={(e) => setLocalKey(e.target.value)}
                    className="flex-1 h-11 bg-input/50 border-border font-mono"
                  />
                  <Button onClick={handleSaveKey} className="h-11 px-6">
                    Save
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-3">
                  Get a free API key at{' '}
                  <a
                    href="https://www.alphavantage.co/support/#api-key"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline font-medium"
                  >
                    alphavantage.co
                  </a>
                </p>
              </div>
            )}
          </div>
        </Card>

        {/* Disclaimer Section */}
        <Card className="glass-card p-6 border-warning/30 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-warning/5 to-transparent" />
          <div className="relative flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-warning/20 flex items-center justify-center flex-shrink-0 mt-0.5">
              <AlertTriangle className="h-5 w-5 text-warning" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-lg mb-3">Legal Disclaimer</h3>
              <div className="space-y-2 text-sm text-muted-foreground leading-relaxed">
                <p>
                  <strong className="text-foreground">Cardinal Quantum</strong> is for educational and informational purposes only. 
                  This platform does <strong className="text-foreground">NOT</strong> provide investment advice or recommendations.
                </p>
                <ul className="space-y-1 ml-4 list-disc">
                  <li>Market data may be delayed, incomplete, or inaccurate</li>
                  <li>Past performance does not guarantee future results</li>
                  <li>You are solely responsible for your investment decisions</li>
                  <li>Trading involves substantial risk of capital loss</li>
                </ul>
                <p className="text-xs italic pt-2">
                  Always consult with a qualified financial advisor before making investment decisions.
                </p>
              </div>
            </div>
          </div>
        </Card>
      </main>
    </div>
  );
}
