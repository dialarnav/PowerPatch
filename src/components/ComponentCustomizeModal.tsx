import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Settings, 
  Zap, 
  DollarSign, 
  TrendingUp,
  Save,
  X,
  MapPin
} from "lucide-react";

interface Component {
  id: string;
  type: 'solar' | 'wind' | 'battery' | 'generator' | 'hydro' | 'grid' | 'load' | 'inverter' | 'geothermal' | 'biomass';
  name: string;
  power: number;
  cost: number;
  emissions: number;
  reliability: number;
  count: number;
  efficiency?: number;
  capacity?: number;
  customizable: boolean;
  customOptions?: {
    powerRange?: [number, number];
    costRange?: [number, number];
    efficiencyRange?: [number, number];
  };
}

interface ComponentCustomizeModalProps {
  component: Component | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (component: Component) => void;
  location?: {
    country: string;
    state?: string;
    region: string;
    costMultiplier: number;
    currency: string;
    laborCost: number;
    shippingCost: number;
  } | null;
}

export const ComponentCustomizeModal = ({ 
  component, 
  isOpen, 
  onClose, 
  onConfirm,
  location 
}: ComponentCustomizeModalProps) => {
  const [customizedComponent, setCustomizedComponent] = useState<Component | null>(component);

  React.useEffect(() => {
    setCustomizedComponent(component);
  }, [component]);

  if (!component || !customizedComponent) return null;

  const handlePowerChange = (value: number[]) => {
    setCustomizedComponent(prev => prev ? { ...prev, power: value[0] } : null);
  };

  const handleCostChange = (value: number[]) => {
    setCustomizedComponent(prev => prev ? { ...prev, cost: value[0] } : null);
  };

  const handleEstimateForLocation = () => {
    if (!location || !customizedComponent) return;

    // Location-based efficiency and power estimates
    const locationFactors = {
      solar: {
        efficiency: location.region.includes('Desert') || location.country === 'Australia' ? 25 : 
                   location.country === 'Germany' || location.country === 'UK' ? 18 : 22,
        powerMultiplier: location.region.includes('Sunny') ? 1.2 : 
                        location.country === 'Norway' ? 0.8 : 1.0
      },
      wind: {
        efficiency: location.region.includes('Coastal') || location.country === 'Denmark' ? 42 : 
                   location.region.includes('Mountain') ? 38 : 35,
        powerMultiplier: location.region.includes('Windy') ? 1.3 : 1.0
      },
      hydro: {
        efficiency: location.region.includes('River') || location.country === 'Norway' ? 85 : 75,
        powerMultiplier: location.region.includes('Mountain') ? 1.2 : 0.8
      },
      geothermal: {
        efficiency: location.country === 'Iceland' || location.region.includes('Volcanic') ? 450 : 350,
        powerMultiplier: location.region.includes('Geothermal') ? 1.5 : 0.7
      }
    };

    const factor = locationFactors[customizedComponent.type as keyof typeof locationFactors];
    
    if (factor) {
      const estimatedEfficiency = factor.efficiency;
      const estimatedPower = Math.round(customizedComponent.power * factor.powerMultiplier);
      
      setCustomizedComponent(prev => prev ? {
        ...prev,
        efficiency: estimatedEfficiency,
        power: Math.max(estimatedPower, customizedComponent.customOptions?.powerRange?.[0] || 1)
      } : null);
    }
  };

  const handleEfficiencyChange = (value: number[]) => {
    setCustomizedComponent(prev => prev ? { ...prev, efficiency: value[0] } : null);
  };

  const handleCapacityChange = (value: string) => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      setCustomizedComponent(prev => prev ? { ...prev, capacity: numValue } : null);
    }
  };

  const handleNameChange = (value: string) => {
    setCustomizedComponent(prev => prev ? { ...prev, name: value } : null);
  };

  const handleConfirm = () => {
    if (customizedComponent) {
      onConfirm(customizedComponent);
    }
  };

  const calculateCostPerKw = () => {
    if (customizedComponent.power <= 0) return 0;
    return Math.round(customizedComponent.cost / customizedComponent.power);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-primary" />
            Customize Component
          </DialogTitle>
          <DialogDescription>
            Adjust the specifications for your {component.name}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Location Estimation */}
          {location && (
            <Card className="bg-muted/50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-sm">Location: {location.country}{location.state ? `, ${location.state}` : ''}</h4>
                    <p className="text-xs text-muted-foreground">Get optimized estimates for your location</p>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={handleEstimateForLocation}
                  >
                    <MapPin className="w-4 h-4 mr-2" />
                    Estimate For Location
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Component Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Component Name</Label>
            <Input
              id="name"
              value={customizedComponent.name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="Enter custom name"
            />
          </div>

          {/* Power Rating */}
          {component.customOptions?.powerRange && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="flex items-center gap-2">
                  <Zap className="w-4 h-4" />
                  Power Rating
                </Label>
                <Badge variant="outline">
                  {customizedComponent.power > 0 ? `${customizedComponent.power} kW` : `${Math.abs(customizedComponent.power)} kW Load`}
                </Badge>
              </div>
              <Slider
                value={[customizedComponent.power]}
                onValueChange={handlePowerChange}
                min={component.customOptions.powerRange[0]}
                max={component.customOptions.powerRange[1]}
                step={component.customOptions.powerRange[1] > 50 ? 5 : 1}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>{component.customOptions.powerRange[0]} kW</span>
                <span>{component.customOptions.powerRange[1]} kW</span>
              </div>
            </div>
          )}

          {/* Efficiency */}
          {component.customOptions?.efficiencyRange && customizedComponent.efficiency && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  Efficiency
                </Label>
                <Badge variant="outline">
                  {customizedComponent.efficiency}%
                </Badge>
              </div>
              <Slider
                value={[customizedComponent.efficiency]}
                onValueChange={handleEfficiencyChange}
                min={component.customOptions.efficiencyRange[0]}
                max={component.customOptions.efficiencyRange[1]}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>{component.customOptions.efficiencyRange[0]}%</span>
                <span>{component.customOptions.efficiencyRange[1]}%</span>
              </div>
            </div>
          )}

          {/* Capacity for Storage */}
          {component.type === 'battery' && (
            <div className="space-y-2">
              <Label htmlFor="capacity">Storage Capacity (kWh)</Label>
              <Input
                id="capacity"
                type="number"
                value={customizedComponent.capacity || 0}
                onChange={(e) => handleCapacityChange(e.target.value)}
                placeholder="Enter capacity in kWh"
                min="1"
                step="0.1"
              />
            </div>
          )}

          {/* Performance Summary */}
          <Card>
            <CardContent className="p-4">
              <h4 className="font-medium mb-3">Performance Summary</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                {customizedComponent.power !== 0 && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Power:</span>
                    <span className="font-medium">
                      {customizedComponent.power > 0 ? '+' : ''}{customizedComponent.power} kW
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Cost:</span>
                  <span className="font-medium">${customizedComponent.cost.toLocaleString()}</span>
                </div>
                {customizedComponent.power > 0 && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Cost/kW:</span>
                    <span className="font-medium">${calculateCostPerKw().toLocaleString()}</span>
                  </div>
                )}
                {customizedComponent.efficiency && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Efficiency:</span>
                    <span className="font-medium">{customizedComponent.efficiency}%</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Reliability:</span>
                  <span className="font-medium">{customizedComponent.reliability}%</span>
                </div>
                {customizedComponent.capacity && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Capacity:</span>
                    <span className="font-medium">{customizedComponent.capacity} kWh</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={onClose}>
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button onClick={handleConfirm} className="bg-primary hover:bg-primary/90">
              <Save className="w-4 h-4 mr-2" />
              Add Component
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};