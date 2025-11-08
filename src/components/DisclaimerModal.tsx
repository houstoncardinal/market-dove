import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';
import { useAppStore } from '@/store/appStore';

export function DisclaimerModal() {
  const { disclaimerAccepted, acceptDisclaimer } = useAppStore();

  return (
    <Dialog open={!disclaimerAccepted} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-[500px] glass-card border-warning/30">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-full bg-warning/20">
              <AlertTriangle className="h-6 w-6 text-warning" />
            </div>
            <DialogTitle className="text-2xl">Important Disclaimer</DialogTitle>
          </div>
          <DialogDescription className="text-base space-y-3 pt-4">
            <p className="text-foreground font-medium">
              Cardinal Quant is for educational and informational purposes only.
            </p>
            <ul className="space-y-2 text-muted-foreground">
              <li>• This is NOT investment advice or a recommendation to buy/sell securities</li>
              <li>• Market data may be delayed, incomplete, or inaccurate</li>
              <li>• Past performance does not guarantee future results</li>
              <li>• You are solely responsible for your own investment decisions</li>
              <li>• Trading involves substantial risk of loss</li>
            </ul>
            <p className="text-foreground font-medium pt-2">
              By continuing, you acknowledge that you understand and accept these terms.
            </p>
          </DialogDescription>
        </DialogHeader>
        <Button
          onClick={acceptDisclaimer}
          className="w-full bg-primary hover:bg-primary/90 mt-4"
          size="lg"
        >
          I Understand - Continue to App
        </Button>
      </DialogContent>
    </Dialog>
  );
}
