import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Header } from '@/components/Header';
import { useAppStore } from '@/store/appStore';
import { Trash2, BellOff, Bell as BellIcon } from 'lucide-react';

export default function Alerts() {
  const navigate = useNavigate();
  const { alerts, removeAlert, toggleAlert } = useAppStore();

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-6 md:py-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
            <BellIcon className="h-5 w-5 text-primary" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold">Price Alerts</h1>
        </div>

        {alerts.length === 0 ? (
          <Card className="glass-card p-12 text-center">
            <div className="max-w-md mx-auto space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-muted/30 flex items-center justify-center mx-auto">
                <BellIcon className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold">No alerts configured</h3>
              <p className="text-muted-foreground text-sm">
                Create price alerts from the symbol detail page to get notified when conditions are met.
              </p>
              <Button onClick={() => navigate('/')} className="mt-4">
                Browse Watchlist
              </Button>
            </div>
          </Card>
        ) : (
          <div className="space-y-3">
            {alerts.map((alert, idx) => (
              <Card 
                key={alert.id} 
                className="glass-card-hover p-5 relative overflow-hidden group animate-fade-in"
                style={{ animationDelay: `${idx * 50}ms` }}
              >
                <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity ${
                  alert.enabled 
                    ? 'bg-gradient-to-br from-primary/5 to-transparent' 
                    : 'bg-gradient-to-br from-muted/5 to-transparent'
                }`} />

                <div className="relative flex items-start justify-between">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-lg">{alert.symbol}</h3>
                      <span className={`text-xs px-2.5 py-1 rounded-lg font-mono font-bold uppercase ${
                        alert.enabled 
                          ? 'bg-success/15 text-success border border-success/30' 
                          : 'bg-muted/15 text-muted-foreground border border-border/30'
                      }`}>
                        {alert.enabled ? 'Active' : 'Paused'}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground font-medium">
                      {alert.type.replace(/_/g, ' ')} • {alert.condition} <span className="font-mono font-bold">${alert.value}</span>
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Created {new Date(alert.createdAt).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric', 
                        year: 'numeric' 
                      })}
                    </p>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => toggleAlert(alert.id)}
                      className={`h-9 w-9 ${
                        alert.enabled 
                          ? 'hover:bg-primary/10 text-primary' 
                          : 'hover:bg-muted/10'
                      }`}
                    >
                      {alert.enabled ? (
                        <BellIcon className="h-4 w-4" />
                      ) : (
                        <BellOff className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeAlert(alert.id)}
                      className="hover:bg-danger/10 hover:text-danger h-9 w-9"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
