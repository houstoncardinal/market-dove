import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertTriangle, TrendingUp } from 'lucide-react';
import { useAppStore } from '@/store/appStore';

export function DisclaimerModal() {
  const { disclaimerAccepted, acceptDisclaimer } = useAppStore();

  return (
    <Dialog open={!disclaimerAccepted} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-[550px] glass-card border-warning/40">
        <DialogHeader>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-xl bg-warning/20 flex items-center justify-center">
              <AlertTriangle className="h-6 w-6 text-warning" />
            </div>
            <div>
              <DialogTitle className="text-2xl mb-1">Important Disclaimer</DialogTitle>
              <p className="text-xs text-muted-foreground font-medium">Please read carefully before proceeding</p>
            </div>
          </div>
          <DialogDescription className="text-base space-y-4 pt-4">
            <p className="text-foreground font-semibold text-lg">
              Cardinal Quantum is for educational purposes only.
            </p>
            <ul className="space-y-2.5 text-muted-foreground">
              <li className="flex gap-2">
                <span className="text-warning mt-0.5">•</span>
                <span>This is NOT investment advice or a recommendation to buy/sell securities</span>
              </li>
              <li className="flex gap-2">
                <span className="text-warning mt-0.5">•</span>
                <span>Market data may be delayed, incomplete, or inaccurate</span>
              </li>
              <li className="flex gap-2">
                <span className="text-warning mt-0.5">•</span>
                <span>Past performance does not guarantee future results</span>
              </li>
              <li className="flex gap-2">
                <span className="text-warning mt-0.5">•</span>
                <span>You are solely responsible for your own investment decisions</span>
              </li>
              <li className="flex gap-2">
                <span className="text-warning mt-0.5">•</span>
                <span>Trading involves substantial risk of loss</span>
              </li>
            </ul>
            <p className="text-foreground font-semibold pt-2 border-t border-border/30">
              By continuing, you acknowledge that you understand and accept these terms.
            </p>
          </DialogDescription>
        </DialogHeader>
        <Button
          onClick={acceptDisclaimer}
          className="w-full bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 h-12 text-base font-semibold"
        >
          I Understand - Continue to Platform
        </Button>
      </DialogContent>
    </Dialog>
  );
}
