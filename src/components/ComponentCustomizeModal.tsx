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
  X
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
}

export const ComponentCustomizeModal = ({ 
  component, 
  isOpen, 
  onClose, 
  onConfirm 
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

          {/* Cost */}
          {component.customOptions?.costRange && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4" />
                  Cost
                </Label>
                <Badge variant="outline">
                  ${customizedComponent.cost.toLocaleString()}
                </Badge>
              </div>
              <Slider
                value={[customizedComponent.cost]}
                onValueChange={handleCostChange}
                min={component.customOptions.costRange[0]}
                max={component.customOptions.costRange[1]}
                step={100}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>${component.customOptions.costRange[0].toLocaleString()}</span>
                <span>${component.customOptions.costRange[1].toLocaleString()}</span>
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