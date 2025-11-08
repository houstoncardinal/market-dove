import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useAppStore } from '@/store/appStore';
import { ArrowLeft, Plus, Trash2, BellOff, Bell } from 'lucide-react';

export default function Alerts() {
  const navigate = useNavigate();
  const { alerts, removeAlert, toggleAlert } = useAppStore();

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
            <h1 className="text-2xl font-bold">Price Alerts</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        {alerts.length === 0 ? (
          <Card className="glass-card p-12 text-center">
            <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">
              No alerts configured. Create alerts from the symbol detail page.
            </p>
            <Button onClick={() => navigate('/')}>
              Browse Watchlist
            </Button>
          </Card>
        ) : (
          <div className="space-y-3">
            {alerts.map((alert) => (
              <Card key={alert.id} className="glass-card-hover p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold">{alert.symbol}</h3>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        alert.enabled 
                          ? 'bg-success/20 text-success' 
                          : 'bg-muted/20 text-muted-foreground'
                      }`}>
                        {alert.enabled ? 'Active' : 'Paused'}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {alert.type.replace(/_/g, ' ')} • {alert.condition} ${alert.value}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Created {new Date(alert.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => toggleAlert(alert.id)}
                      className="hover:bg-primary/10"
                    >
                      {alert.enabled ? (
                        <Bell className="h-4 w-4" />
                      ) : (
                        <BellOff className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeAlert(alert.id)}
                      className="hover:bg-danger/10 hover:text-danger"
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
