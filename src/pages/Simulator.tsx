import React, { useState, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LocationSelector from "@/components/LocationSelector";
import AIAssistant from "@/components/AIAssistant";
import { 
  Sun, 
  Wind, 
  Battery, 
  Zap, 
  DollarSign, 
  Leaf, 
  Clock, 
  Home, 
  Download,
  Share2,
  RefreshCw,
  TrendingUp,
  AlertCircle,
  MapPin
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";

interface Location {
  country: string;
  state?: string;
  region: string;
  costMultiplier: number;
  currency: string;
  laborCost: number;
  shippingCost: number;
}

interface Component {
  id: string;
  type: 'solar' | 'wind' | 'battery' | 'generator';
  name: string;
  power: number; // kW
  cost: number; // USD
  emissions: number; // kg CO2/year
  reliability: number; // 0-100%
  count: number;
}

interface GridStats {
  totalPower: number;
  totalCost: number;
  totalEmissions: number;
  reliability: number;
  efficiency: number;
}

const availableComponents: Omit<Component, 'id' | 'count'>[] = [
  {
    type: 'solar',
    name: 'Solar Panel (5kW)',
    power: 5,
    cost: 3000,
    emissions: 0,
    reliability: 85
  },
  {
    type: 'wind',
    name: 'Wind Turbine (10kW)',
    power: 10,
    cost: 8000,
    emissions: 0,
    reliability: 70
  },
  {
    type: 'battery',
    name: 'Battery Storage (20kWh)',
    power: 0,
    cost: 5000,
    emissions: 0,
    reliability: 95
  },
  {
    type: 'generator',
    name: 'Backup Generator (15kW)',
    power: 15,
    cost: 2000,
    emissions: 1200,
    reliability: 99
  }
];

const Simulator = () => {
  const [selectedComponents, setSelectedComponents] = useState<Component[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const { toast } = useToast();

  const getLocationAdjustedCost = useCallback((baseCost: number) => {
    if (!selectedLocation) return baseCost;
    return Math.round(baseCost * selectedLocation.costMultiplier);
  }, [selectedLocation]);

  const addComponent = useCallback((component: Omit<Component, 'id' | 'count'>) => {
    const adjustedCost = getLocationAdjustedCost(component.cost);
    const newComponent: Component = {
      ...component,
      id: Math.random().toString(36).substr(2, 9),
      cost: adjustedCost,
      count: 1
    };
    setSelectedComponents(prev => [...prev, newComponent]);
    toast({
      title: "Component Added",
      description: `${component.name} added${selectedLocation ? ` (${selectedLocation.country} pricing)` : ''}.`,
    });
  }, [toast, getLocationAdjustedCost, selectedLocation]);

  const removeComponent = useCallback((id: string) => {
    setSelectedComponents(prev => prev.filter(comp => comp.id !== id));
    toast({
      title: "Component Removed",
      description: "Component removed from your microgrid.",
    });
  }, [toast]);

  const updateComponentCount = useCallback((id: string, count: number) => {
    if (count <= 0) {
      removeComponent(id);
      return;
    }
    setSelectedComponents(prev => 
      prev.map(comp => comp.id === id ? { ...comp, count } : comp)
    );
  }, [removeComponent]);

  const handleLocationChange = useCallback((location: Location) => {
    setSelectedLocation(location);
    
    // Update existing components with new pricing
    setSelectedComponents(prev => 
      prev.map(comp => ({
        ...comp,
        cost: getLocationAdjustedCost(
          comp.type === 'solar' ? 3000 :
          comp.type === 'wind' ? 8000 :
          comp.type === 'battery' ? 5000 : 2000
        )
      }))
    );
    
    toast({
      title: "Location Updated",
      description: `Pricing updated for ${location.country}${location.state ? `, ${location.state}` : ''}.`,
    });
  }, [getLocationAdjustedCost, toast]);

  const handleAIComponentsGenerated = useCallback((components: Component[]) => {
    setSelectedComponents(components);
  }, []);

  const calculateStats = useCallback((): GridStats => {
    const stats = selectedComponents.reduce(
      (acc, comp) => ({
        totalPower: acc.totalPower + (comp.power * comp.count),
        totalCost: acc.totalCost + (comp.cost * comp.count),
        totalEmissions: acc.totalEmissions + (comp.emissions * comp.count),
        reliabilitySum: acc.reliabilitySum + (comp.reliability * comp.count * comp.power),
        totalWeightedPower: acc.totalWeightedPower + (comp.count * comp.power)
      }),
      { totalPower: 0, totalCost: 0, totalEmissions: 0, reliabilitySum: 0, totalWeightedPower: 0 }
    );

    const reliability = stats.totalWeightedPower > 0 ? stats.reliabilitySum / stats.totalWeightedPower : 0;
    const efficiency = Math.min(100, (stats.totalPower / Math.max(1, stats.totalPower)) * 100);

    return {
      totalPower: stats.totalPower,
      totalCost: stats.totalCost,
      totalEmissions: stats.totalEmissions,
      reliability: Math.round(reliability),
      efficiency: Math.round(efficiency)
    };
  }, [selectedComponents]);

  const simulateGrid = useCallback(async () => {
    setIsSimulating(true);
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSimulating(false);
    toast({
      title: "Simulation Complete!",
      description: "Your microgrid analysis is ready.",
    });
  }, [toast]);

  const exportGrid = useCallback(() => {
    const stats = calculateStats();
    const exportData = {
      components: selectedComponents,
      stats,
      timestamp: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'powerpatch-microgrid.json';
    a.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: "Grid Exported",
      description: "Your microgrid design has been exported successfully.",
    });
  }, [selectedComponents, calculateStats, toast]);

  const shareGrid = useCallback(() => {
    if (navigator.share) {
      navigator.share({
        title: 'My PowerPatch Microgrid',
        text: 'Check out my custom microgrid design!',
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link Copied",
        description: "Shareable link copied to clipboard.",
      });
    }
  }, [toast]);

  const stats = calculateStats();

  const getIconForType = (type: string) => {
    switch (type) {
      case 'solar': return <Sun className="w-8 h-8 text-energy-yellow" />;
      case 'wind': return <Wind className="w-8 h-8 text-energy-blue" />;
      case 'battery': return <Battery className="w-8 h-8 text-energy-green" />;
      case 'generator': return <Zap className="w-8 h-8 text-energy-orange" />;
      default: return <Zap className="w-8 h-8" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-section">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <Link to="/" className="flex items-center gap-2">
                <Button variant="ghost" size="sm">
                  <Home className="w-4 h-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
              <Separator orientation="vertical" className="h-8" />
              <h1 className="text-2xl font-bold text-primary">PowerPatch Simulator</h1>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={shareGrid}>
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
              <Button variant="outline" onClick={exportGrid}>
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Left Sidebar - Location & AI */}
          <div className="lg:col-span-1 space-y-6">
            <LocationSelector
              selectedLocation={selectedLocation}
              onLocationChange={handleLocationChange}
            />
            
            <AIAssistant
              location={selectedLocation}
              onComponentsGenerated={handleAIComponentsGenerated}
              currentComponents={selectedComponents}
            />
          </div>

          {/* Component Library */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-primary" />
                  Component Library
                </CardTitle>
                <CardDescription>
                  Drag components to build your microgrid
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {availableComponents.map((component, index) => {
                  const adjustedCost = getLocationAdjustedCost(component.cost);
                  const costDifference = adjustedCost - component.cost;
                  
                  return (
                    <Card 
                      key={index}
                      className="cursor-pointer hover:shadow-card transition-all duration-200 border-2 border-dashed border-muted hover:border-primary"
                      onClick={() => addComponent(component)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3 mb-3">
                          {getIconForType(component.type)}
                          <div className="flex-1">
                            <h3 className="font-medium text-sm">{component.name}</h3>
                            <p className="text-xs text-muted-foreground">
                              {component.power > 0 ? `${component.power}kW` : 'Storage'}
                            </p>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 gap-2 text-xs">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Base Cost:</span>
                            <span className="font-medium">${component.cost.toLocaleString()}</span>
                          </div>
                          {selectedLocation && costDifference !== 0 && (
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Local Cost:</span>
                              <span className={`font-medium ${costDifference > 0 ? 'text-red-600' : 'text-green-600'}`}>
                                ${adjustedCost.toLocaleString()}
                                <span className="text-xs ml-1">
                                  ({costDifference > 0 ? '+' : ''}${costDifference.toLocaleString()})
                                </span>
                              </span>
                            </div>
                          )}
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Reliability:</span>
                            <span className="font-medium">{component.reliability}%</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </CardContent>
            </Card>
          </div>

          {/* Main Design Area */}
          <div className="lg:col-span-2">
            {!selectedLocation && (
              <Card className="mb-6 border-orange-200 bg-orange-50 dark:bg-orange-950/20">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-orange-600" />
                    <div>
                      <div className="font-medium text-orange-800 dark:text-orange-200">
                        Select Location for Accurate Pricing
                      </div>
                      <div className="text-sm text-orange-700 dark:text-orange-300">
                        Component costs vary significantly by location. Select your project location for realistic estimates.
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
            
            <Tabs defaultValue="design" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="design">Design</TabsTrigger>
                <TabsTrigger value="analysis">Analysis</TabsTrigger>
                <TabsTrigger value="location">Location & AI</TabsTrigger>
              </TabsList>

              <TabsContent value="design" className="space-y-6">
                {/* Selected Components */}
                <Card>
                  <CardHeader>
                    <CardTitle>Your Microgrid Design</CardTitle>
                    <CardDescription>
                      {selectedComponents.length === 0 
                        ? "Click components from the library to start building"
                        : `${selectedComponents.length} component${selectedComponents.length !== 1 ? 's' : ''} selected`
                      }
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {selectedComponents.length === 0 ? (
                      <div className="text-center py-12 text-muted-foreground">
                        <Zap className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>Start building your microgrid by selecting components</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {selectedComponents.map((component) => (
                          <Card key={component.id} className="border-l-4 border-l-primary">
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  {getIconForType(component.type)}
                                  <div>
                                    <h4 className="font-medium">{component.name}</h4>
                                    <p className="text-sm text-muted-foreground">
                                      Quantity: {component.count} | 
                                      Total: {component.power * component.count}kW | 
                                      ${(component.cost * component.count).toLocaleString()}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => updateComponentCount(component.id, component.count - 1)}
                                  >
                                    -
                                  </Button>
                                  <span className="px-3 py-1 bg-muted rounded text-sm font-medium">
                                    {component.count}
                                  </span>
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => updateComponentCount(component.id, component.count + 1)}
                                  >
                                    +
                                  </Button>
                                  <Button 
                                    variant="destructive" 
                                    size="sm"
                                    onClick={() => removeComponent(component.id)}
                                  >
                                    Remove
                                  </Button>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Quick Stats */}
                {selectedComponents.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="w-5 h-5" />
                        Quick Overview
                        {selectedLocation && (
                          <Badge variant="outline" className="ml-2">
                            <MapPin className="w-3 h-3 mr-1" />
                            {selectedLocation.country}
                          </Badge>
                        )}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-primary">{stats.totalPower}kW</div>
                          <div className="text-sm text-muted-foreground">Total Power</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-600">
                            ${stats.totalCost.toLocaleString()}
                            {selectedLocation && selectedLocation.currency !== 'USD' && (
                              <div className="text-xs text-muted-foreground">{selectedLocation.currency}</div>
                            )}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Total Cost {selectedLocation && `(${selectedLocation.country})`}
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-blue-600">{stats.reliability}%</div>
                          <div className="text-sm text-muted-foreground">Reliability</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-orange-600">{stats.totalEmissions}</div>
                          <div className="text-sm text-muted-foreground">CO₂/year</div>
                        </div>
                      </div>
                      
                      {selectedLocation && (
                        <div className="mt-4 p-3 bg-muted rounded-lg">
                          <div className="text-sm text-muted-foreground">
                            <strong>Location Factors:</strong> Cost multiplier {selectedLocation.costMultiplier}x, 
                            Labor ${selectedLocation.laborCost}/hr, Shipping ${selectedLocation.shippingCost}/kg
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="analysis" className="space-y-6">
                {selectedComponents.length === 0 ? (
                  <Card>
                    <CardContent className="text-center py-12">
                      <AlertCircle className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                      <p className="text-muted-foreground">Add components to see detailed analysis</p>
                    </CardContent>
                  </Card>
                ) : (
                  <>
                    {/* Simulation Controls */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Simulation & Analysis</CardTitle>
                        <CardDescription>
                          Run detailed performance analysis of your microgrid
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Button 
                          onClick={simulateGrid} 
                          disabled={isSimulating}
                          className="w-full"
                          variant="cta"
                        >
                          {isSimulating ? (
                            <>
                              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                              Running Simulation...
                            </>
                          ) : (
                            <>
                              <TrendingUp className="w-4 h-4 mr-2" />
                              Run Full Analysis
                            </>
                          )}
                        </Button>
                      </CardContent>
                    </Card>

                    {/* Detailed Analysis */}
                    <div className="grid md:grid-cols-2 gap-6">
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <DollarSign className="w-5 h-5 text-green-600" />
                            Cost Analysis
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span>Initial Investment</span>
                              <span className="font-medium">${stats.totalCost.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Cost per kW</span>
                              <span className="font-medium">
                                ${stats.totalPower > 0 ? Math.round(stats.totalCost / stats.totalPower).toLocaleString() : 0}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span>Payback Period</span>
                              <span className="font-medium">~5-8 years</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <Leaf className="w-5 h-5 text-green-600" />
                            Environmental Impact
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span>Annual CO₂ Emissions</span>
                              <span className="font-medium">{stats.totalEmissions} kg</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Carbon Footprint</span>
                              <span className="font-medium">
                                {stats.totalEmissions === 0 ? "Zero Carbon" : "Mixed Sources"}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span>Sustainability Score</span>
                              <span className="font-medium">
                                {stats.totalEmissions === 0 ? "A+" : 
                                 stats.totalEmissions < 1000 ? "A" : 
                                 stats.totalEmissions < 5000 ? "B" : "C"}
                              </span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <Clock className="w-5 h-5 text-blue-600" />
                            Reliability Analysis
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="space-y-3">
                            <div>
                              <div className="flex justify-between mb-1">
                                <span className="text-sm">Overall Reliability</span>
                                <span className="text-sm font-medium">{stats.reliability}%</span>
                              </div>
                              <Progress value={stats.reliability} className="h-2" />
                            </div>
                            <div>
                              <div className="flex justify-between mb-1">
                                <span className="text-sm">System Efficiency</span>
                                <span className="text-sm font-medium">{stats.efficiency}%</span>
                              </div>
                              <Progress value={stats.efficiency} className="h-2" />
                            </div>
                            <div className="text-sm text-muted-foreground">
                              Expected uptime: {Math.round(stats.reliability * 8760 / 100)} hours/year
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <Zap className="w-5 h-5 text-yellow-600" />
                            Power Generation
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span>Peak Power Output</span>
                              <span className="font-medium">{stats.totalPower} kW</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Daily Generation</span>
                              <span className="font-medium">~{Math.round(stats.totalPower * 6)} kWh</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Annual Generation</span>
                              <span className="font-medium">~{Math.round(stats.totalPower * 2190)} kWh</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Recommendations */}
                    <Card>
                      <CardHeader>
                        <CardTitle>System Recommendations</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {stats.totalEmissions > 1000 && (
                            <div className="flex items-start gap-3 p-3 bg-orange-50 dark:bg-orange-950/20 rounded-lg">
                              <AlertCircle className="w-5 h-5 text-orange-600 mt-0.5" />
                              <div className="text-sm">
                                <strong>Consider more renewable sources:</strong> Your system has high carbon emissions. 
                                Adding more solar panels or wind turbines could improve sustainability.
                              </div>
                            </div>
                          )}
                          {stats.reliability < 80 && (
                            <div className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                              <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                              <div className="text-sm">
                                <strong>Add backup power:</strong> System reliability could be improved with 
                                additional battery storage or backup generators.
                              </div>
                            </div>
                          )}
                          {stats.totalPower < 10 && (
                            <div className="flex items-start gap-3 p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
                              <AlertCircle className="w-5 h-5 text-green-600 mt-0.5" />
                              <div className="text-sm">
                                <strong>Scale up for impact:</strong> Consider increasing capacity to serve 
                                more households or community facilities.
                              </div>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </>
                )}
              </TabsContent>

              <TabsContent value="location" className="space-y-6 lg:hidden">
                <LocationSelector
                  selectedLocation={selectedLocation}
                  onLocationChange={handleLocationChange}
                />
                
                <AIAssistant
                  location={selectedLocation}
                  onComponentsGenerated={handleAIComponentsGenerated}
                  currentComponents={selectedComponents}
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Simulator;