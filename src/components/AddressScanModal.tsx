import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Home, Zap } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Component {
  id: string;
  type: 'solar' | 'wind' | 'battery' | 'generator' | 'hydro' | 'grid' | 'load' | 'inverter' | 'geothermal' | 'biomass';
  name: string;
  power: number;
  cost: number;
  count: number;
  emissions: number;
  reliability: number;
  efficiency?: number;
  capacity?: number;
  customizable: boolean;
  customOptions?: {
    powerRange?: [number, number];
    costRange?: [number, number];
    efficiencyRange?: [number, number];
  };
}

interface AddressScanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onScanComplete: (components: Component[]) => void;
}

export const AddressScanModal = ({ isOpen, onClose, onScanComplete }: AddressScanModalProps) => {
  const [address, setAddress] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [scanStep, setScanStep] = useState(0);
  const { toast } = useToast();

  const scanSteps = [
    "Analyzing property location...",
    "Scanning roof area and orientation...",
    "Calculating solar potential...",
    "Assessing energy consumption patterns...",
    "Generating optimal microgrid design...",
  ];

  const handleScan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address.trim()) return;

    setIsScanning(true);
    setScanStep(0);

    // Simulate scanning steps
    const stepInterval = setInterval(() => {
      setScanStep((prev) => {
        if (prev >= scanSteps.length - 1) {
          clearInterval(stepInterval);
          return prev;
        }
        return prev + 1;
      });
    }, 1500);

    try {
      const { data, error } = await supabase.functions.invoke('ai-house-scan', {
        body: { address },
      });

      if (error) {
        throw error;
      }

      // Convert AI recommendations to component format
      const components: Component[] = data.recommendations?.map((rec: any, index: number) => ({
        id: `scan-${Date.now()}-${index}`,
        type: rec.type,
        name: rec.name,
        power: rec.power || 0,
        cost: rec.cost || 0,
        count: rec.count || 1,
        emissions: rec.type === 'solar' ? 0 : rec.type === 'wind' ? 0.1 : 2.5,
        reliability: rec.type === 'battery' ? 95 : rec.type === 'generator' ? 90 : 85,
        efficiency: rec.efficiency,
        capacity: rec.capacity,
        customizable: false,
        customOptions: undefined
      })) || [];

      // Save scan to database
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from('address_scan_designs').insert({
          user_id: user.id,
          address,
          scan_data: data as any,
          ai_recommendations: data.recommendations as any,
          components: components as any,
          total_cost: data.totalCost || 0,
        });
      }

      setTimeout(() => {
        clearInterval(stepInterval);
        setIsScanning(false);
        onScanComplete(components);
        onClose();
        toast({
          title: "House scan complete!",
          description: `Generated custom microgrid design for ${address}`,
        });
      }, 2000);

    } catch (error) {
      clearInterval(stepInterval);
      setIsScanning(false);
      console.error('Scan error:', error);
      toast({
        title: "Scan failed",
        description: "Unable to analyze your address. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Home className="h-5 w-5" />
            AI House Scan
          </DialogTitle>
          <DialogDescription>
            Enter your address and our AI will analyze your property to create a custom microgrid design.
          </DialogDescription>
        </DialogHeader>

        {!isScanning ? (
          <form onSubmit={handleScan} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="address">Property Address</Label>
              <Input
                id="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="123 Main St, City, State, ZIP"
                required
              />
            </div>
            <Button type="submit" className="w-full">
              <Zap className="mr-2 h-4 w-4" />
              Scan My House
            </Button>
          </form>
        ) : (
          <div className="space-y-6 py-4">
            <div className="flex items-center justify-center">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                <Home className="absolute inset-0 m-auto h-6 w-6 text-primary" />
              </div>
            </div>
            
            <div className="text-center space-y-2">
              <h3 className="font-semibold">Scanning Your Property</h3>
              <p className="text-sm text-muted-foreground">
                {scanSteps[scanStep]}
              </p>
              <div className="w-full bg-secondary rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all duration-1000"
                  style={{ width: `${((scanStep + 1) / scanSteps.length) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};