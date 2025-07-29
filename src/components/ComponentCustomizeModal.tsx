import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { SimulatorComponent } from './SimulatorCanvas';
import { Sun, Wind, Battery, Zap, Home, Factory, Building2, Waves, Settings } from "lucide-react";

interface ComponentCustomizeModalProps {
  isOpen: boolean;
  onClose: () => void;
  component: SimulatorComponent | null;
  onSave: (component: SimulatorComponent) => void;
}

const getIconForType = (type: string) => {
  switch (type) {
    case 'solar': return <Sun className="w-5 h-5" />;
    case 'wind': return <Wind className="w-5 h-5" />;
    case 'battery': return <Battery className="w-5 h-5" />;
    case 'generator': return <Zap className="w-5 h-5" />;
    case 'load': return <Home className="w-5 h-5" />;
    case 'hydro': return <Waves className="w-5 h-5" />;
    case 'grid': return <Factory className="w-5 h-5" />;
    case 'inverter': return <Building2 className="w-5 h-5" />;
    default: return <Zap className="w-5 h-5" />;
  }
};

const getColorForType = (type: string) => {
  switch (type) {
    case 'solar': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    case 'wind': return 'text-blue-600 bg-blue-50 border-blue-200';
    case 'battery': return 'text-green-600 bg-green-50 border-green-200';
    case 'generator': return 'text-orange-600 bg-orange-50 border-orange-200';
    case 'load': return 'text-purple-600 bg-purple-50 border-purple-200';
    case 'hydro': return 'text-cyan-600 bg-cyan-50 border-cyan-200';
    case 'grid': return 'text-gray-600 bg-gray-50 border-gray-200';
    case 'inverter': return 'text-indigo-600 bg-indigo-50 border-indigo-200';
    default: return 'text-gray-600 bg-gray-50 border-gray-200';
  }
};

export const ComponentCustomizeModal: React.FC<ComponentCustomizeModalProps> = ({
  isOpen,
  onClose,
  component,
  onSave
}) => {
  const [customizedComponent, setCustomizedComponent] = useState<SimulatorComponent | null>(null);

  useEffect(() => {
    if (component) {
      setCustomizedComponent({ ...component });
    }
  }, [component]);

  if (!component || !customizedComponent) return null;

  const handlePowerChange = (value: number[]) => {
    const newPower = value[0];
    const powerDiff = newPower - component.power;
    const costPerKW = component.customizable?.costPerKW || 0;
    const newCost = component.cost + (powerDiff * costPerKW);

    setCustomizedComponent({
      ...customizedComponent,
      power: newPower,
      cost: Math.round(newCost)
    });
  };

  const handleQuantityChange = (value: number) => {
    setCustomizedComponent({
      ...customizedComponent,
      count: Math.max(1, value)
    });
  };

  const handleSave = () => {
    if (customizedComponent) {
      onSave(customizedComponent);
      onClose();
    }
  };

  const totalCost = customizedComponent.cost * customizedComponent.count;
  const totalPower = customizedComponent.power * customizedComponent.count;
  const totalCapacity = (customizedComponent.capacity || 0) * customizedComponent.count;

  const sustainabilityScore = 
    customizedComponent.emissions === 0 ? 100 :
    customizedComponent.emissions < 500 ? 80 :
    customizedComponent.emissions < 1500 ? 60 :
    customizedComponent.emissions < 3000 ? 40 : 20;

  const performanceScore = Math.round(
    (customizedComponent.efficiency + customizedComponent.reliability) / 2
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className={`p-2 rounded-lg border ${getColorForType(component.type)}`}>
              {getIconForType(component.type)}
            </div>
            Customize {component.name}
          </DialogTitle>
          <DialogDescription>
            Adjust parameters to optimize for your specific requirements
          </DialogDescription>
        </DialogHeader>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Configuration Panel */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-4 h-4" />
                  Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Quantity */}
                <div className="space-y-2">
                  <Label>Quantity</Label>
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleQuantityChange(customizedComponent.count - 1)}
                      disabled={customizedComponent.count <= 1}
                    >
                      -
                    </Button>
                    <Input
                      type="number"
                      value={customizedComponent.count}
                      onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                      className="w-20 text-center"
                      min="1"
                    />
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleQuantityChange(customizedComponent.count + 1)}
                    >
                      +
                    </Button>
                  </div>
                </div>

                {/* Power Customization */}
                {component.customizable && (
                  <div className="space-y-2">
                    <Label>Power Output ({customizedComponent.power}kW)</Label>
                    <Slider
                      value={[customizedComponent.power]}
                      onValueChange={handlePowerChange}
                      min={component.customizable.minPower}
                      max={component.customizable.maxPower}
                      step={component.customizable.powerStep}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{component.customizable.minPower}kW</span>
                      <span>{component.customizable.maxPower}kW</span>
                    </div>
                  </div>
                )}

                {/* Component Specifications */}
                <Separator />
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <Label className="text-xs">Efficiency</Label>
                    <div className="font-medium">{customizedComponent.efficiency}%</div>
                  </div>
                  <div>
                    <Label className="text-xs">Reliability</Label>
                    <div className="font-medium">{customizedComponent.reliability}%</div>
                  </div>
                  <div>
                    <Label className="text-xs">Lifespan</Label>
                    <div className="font-medium">{customizedComponent.lifespan} years</div>
                  </div>
                  <div>
                    <Label className="text-xs">Voltage</Label>
                    <div className="font-medium">{customizedComponent.voltage}V</div>
                  </div>
                  {customizedComponent.capacity && (
                    <>
                      <div>
                        <Label className="text-xs">Storage Capacity</Label>
                        <div className="font-medium">{customizedComponent.capacity}kWh</div>
                      </div>
                    </>
                  )}
                  {customizedComponent.noiseLevel !== undefined && customizedComponent.noiseLevel > 0 && (
                    <div>
                      <Label className="text-xs">Noise Level</Label>
                      <div className="font-medium">{customizedComponent.noiseLevel}dB</div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Environmental Impact */}
            <Card>
              <CardHeader>
                <CardTitle>Environmental Impact</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Sustainability Score</span>
                    <span className="font-medium">{sustainabilityScore}%</span>
                  </div>
                  <Progress value={sustainabilityScore} className="h-2" />
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <Label className="text-xs">CO₂ Emissions</Label>
                    <div className="font-medium">
                      {(customizedComponent.emissions * customizedComponent.count).toLocaleString()} kg/year
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs">Weather Resistance</Label>
                    <div className="font-medium">{customizedComponent.weatherResistance}%</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Summary Panel */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Cost Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Unit Cost:</span>
                    <span className="font-medium">${customizedComponent.cost.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Quantity:</span>
                    <span className="font-medium">{customizedComponent.count}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total Cost:</span>
                    <span>${totalCost.toLocaleString()}</span>
                  </div>
                  
                  {component.customizable && (
                    <div className="text-xs text-muted-foreground">
                      Cost per kW: ${component.customizable.costPerKW.toLocaleString()}
                    </div>
                  )}
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Total Power:</span>
                    <span className="font-medium">{totalPower}kW</span>
                  </div>
                  {totalCapacity > 0 && (
                    <div className="flex justify-between">
                      <span>Total Capacity:</span>
                      <span className="font-medium">{totalCapacity}kWh</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Annual Maintenance:</span>
                    <span className="font-medium">
                      ${((customizedComponent.maintenance || 0) * customizedComponent.count).toLocaleString()}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Performance Score</span>
                    <span className="font-medium">{performanceScore}%</span>
                  </div>
                  <Progress value={performanceScore} className="h-2" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-muted rounded-lg">
                    <div className="text-lg font-bold text-primary">{customizedComponent.efficiency}%</div>
                    <div className="text-xs text-muted-foreground">Efficiency</div>
                  </div>
                  <div className="text-center p-3 bg-muted rounded-lg">
                    <div className="text-lg font-bold text-primary">{customizedComponent.reliability}%</div>
                    <div className="text-xs text-muted-foreground">Reliability</div>
                  </div>
                </div>

                {customizedComponent.emissions === 0 && (
                  <Badge variant="secondary" className="w-full justify-center">
                    🌱 Zero Emissions
                  </Badge>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Configuration
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};