import React, { useState, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LocationSelector from "@/components/LocationSelector";
import AIAssistant from "@/components/AIAssistant";
import { AuthModal } from "@/components/AuthModal";
import { AddressScanModal } from "@/components/AddressScanModal";
import { SimulatorCanvas, SimulatorComponent, enhancedComponents } from "@/components/SimulatorCanvas";
import { ComponentCustomizeModal } from "@/components/ComponentCustomizeModal";
import { ChallengeSystem, Challenge, challenges } from "@/components/ChallengeSystem";
import { useAuth } from "@/hooks/useAuth";
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
  MapPin,
  Scan,
  User,
  LogOut,
  Trophy,
  Target,
  Settings
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

interface Location {
  country: string;
  state?: string;
  region: string;
  costMultiplier: number;
  currency: string;
  laborCost: number;
  shippingCost: number;
}

interface GridStats {
  totalPower: number;
  totalCost: number;
  totalEmissions: number;
  reliability: number;
  efficiency: number;
}

const Simulator = () => {
  const [selectedComponents, setSelectedComponents] = useState<SimulatorComponent[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showAddressScanModal, setShowAddressScanModal] = useState(false);
  const [showCustomizeModal, setShowCustomizeModal] = useState(false);
  const [customizeComponent, setCustomizeComponent] = useState<SimulatorComponent | null>(null);
  const [currentChallenge, setCurrentChallenge] = useState<Challenge | null>(null);
  const [completedChallenges, setCompletedChallenges] = useState<string[]>([]);
  const { toast } = useToast();
  const { user, requireAuth } = useAuth();

  const getLocationAdjustedCost = useCallback((baseCost: number) => {
    if (!selectedLocation) return baseCost;
    return Math.round(baseCost * selectedLocation.costMultiplier);
  }, [selectedLocation]);

  const addComponent = useCallback((component: Omit<SimulatorComponent, 'id' | 'count' | 'position'>) => {
    const adjustedCost = getLocationAdjustedCost(component.cost);
    const newComponent: SimulatorComponent = {
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
      prev.map(comp => {
        const baseComponent = enhancedComponents.find(base => base.name === comp.name);
        return {
          ...comp,
          cost: getLocationAdjustedCost(baseComponent?.cost || comp.cost)
        };
      })
    );
    
    toast({
      title: "Location Updated",
      description: `Pricing updated for ${location.country}${location.state ? `, ${location.state}` : ''}.`,
    });
  }, [getLocationAdjustedCost, toast]);

  const handleAIComponentsGenerated = useCallback((components: SimulatorComponent[]) => {
    setSelectedComponents(components);
  }, []);

  const handleScanComplete = useCallback((components: SimulatorComponent[]) => {
    setSelectedComponents(components);
    toast({
      title: "Address scan complete!",
      description: "AI has generated a custom microgrid design for your property.",
    });
  }, [toast]);

  const handleAuthRequired = useCallback(() => {
    setShowAuthModal(true);
  }, []);

  const handleSignOut = useCallback(async () => {
    await supabase.auth.signOut();
    toast({
      title: "Signed out",
      description: "You've been successfully signed out.",
    });
  }, [toast]);

  const handleComponentCustomize = useCallback((component: SimulatorComponent) => {
    setCustomizeComponent(component);
    setShowCustomizeModal(true);
  }, []);

  const handleComponentUpdate = useCallback((updatedComponent: SimulatorComponent) => {
    setSelectedComponents(prev =>
      prev.map(comp => comp.id === updatedComponent.id ? updatedComponent : comp)
    );
    toast({
      title: "Component Updated",
      description: `${updatedComponent.name} has been customized.`,
    });
  }, [toast]);

  const handleChallengeSelect = useCallback((challenge: Challenge | null) => {
    setCurrentChallenge(challenge);
    if (challenge) {
      toast({
        title: "Challenge Selected",
        description: `Now working on: ${challenge.title}`,
      });
    }
  }, [toast]);

  const handleChallengeComplete = useCallback((challenge: Challenge, score: number) => {
    setCompletedChallenges(prev => [...prev, challenge.id]);
    toast({
      title: "Challenge Completed!",
      description: `${challenge.title} completed with ${score}% score!`,
    });
  }, [toast]);

  const calculateStats = useCallback((): GridStats => {
    const stats = selectedComponents.reduce(
      (acc, comp) => ({
        totalPower: acc.totalPower + (comp.power * comp.count),
        totalCost: acc.totalCost + (comp.cost * comp.count),
        totalEmissions: acc.totalEmissions + (comp.emissions * comp.count),
        reliabilitySum: acc.reliabilitySum + (comp.reliability * comp.count * Math.abs(comp.power)),
        totalWeightedPower: acc.totalWeightedPower + (comp.count * Math.abs(comp.power))
      }),
      { totalPower: 0, totalCost: 0, totalEmissions: 0, reliabilitySum: 0, totalWeightedPower: 0 }
    );

    const reliability = stats.totalWeightedPower > 0 ? stats.reliabilitySum / stats.totalWeightedPower : 0;
    const efficiency = Math.min(100, selectedComponents.length > 0 ? 
      selectedComponents.reduce((sum, comp) => sum + comp.efficiency, 0) / selectedComponents.length : 0);

    return {
      totalPower: Math.round(stats.totalPower * 10) / 10,
      totalCost: stats.totalCost,
      totalEmissions: Math.round(stats.totalEmissions),
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
              <Button 
                variant="outline" 
                onClick={() => user ? setShowAddressScanModal(true) : handleAuthRequired()}
                className="bg-green-600 hover:bg-green-700 text-white border-0 shadow-md font-medium"
              >
                <Scan className="w-4 h-4 mr-2" />
                AI House Scan
              </Button>
              
              <Button variant="outline" onClick={() => user ? shareGrid() : handleAuthRequired()}>
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
              <Button variant="outline" onClick={() => user ? exportGrid() : handleAuthRequired()}>
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              
              {user ? (
                <Button variant="outline" onClick={handleSignOut}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              ) : (
                <Button variant="outline" onClick={handleAuthRequired}>
                  <User className="w-4 h-4 mr-2" />
                  Sign In
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue={currentChallenge ? "challenge" : "design"} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="design">Design Canvas</TabsTrigger>
            <TabsTrigger value="analysis">Analysis</TabsTrigger>
            <TabsTrigger value="challenges" className="relative">
              Challenges
              {currentChallenge && (
                <Badge variant="secondary" className="ml-1 text-xs">
                  Active
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="location">Location & AI</TabsTrigger>
          </TabsList>
          <TabsContent value="design" className="space-y-6">
            {!selectedLocation && (
              <Card className="border-orange-200 bg-orange-50 dark:bg-orange-950/20">
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

            {currentChallenge && (
              <Card className="border-blue-200 bg-blue-50 dark:bg-blue-950/20">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <Trophy className="w-5 h-5 text-blue-600" />
                    <div>
                      <div className="font-medium text-blue-800 dark:text-blue-200">
                        Challenge Active: {currentChallenge.title}
                      </div>
                      <div className="text-sm text-blue-700 dark:text-blue-300">
                        {currentChallenge.description}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
            
            <SimulatorCanvas
              selectedComponents={selectedComponents}
              onComponentsChange={setSelectedComponents}
              onComponentAdd={addComponent}
            />

            {/* Quick Stats */}
            {selectedComponents.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    System Overview
                    {selectedLocation && (
                      <Badge variant="outline" className="ml-2">
                        <MapPin className="w-3 h-3 mr-1" />
                        {selectedLocation.country}
                      </Badge>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">{calculateStats().totalPower}kW</div>
                      <div className="text-sm text-muted-foreground">Total Power</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        ${calculateStats().totalCost.toLocaleString()}
                      </div>
                      <div className="text-sm text-muted-foreground">Total Cost</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{calculateStats().reliability}%</div>
                      <div className="text-sm text-muted-foreground">Reliability</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">{calculateStats().efficiency}%</div>
                      <div className="text-sm text-muted-foreground">Efficiency</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600">{calculateStats().totalEmissions}</div>
                      <div className="text-sm text-muted-foreground">CO₂/year</div>
                    </div>
                  </div>
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
                          <span className="font-medium">${calculateStats().totalCost.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Cost per kW</span>
                          <span className="font-medium">
                            ${calculateStats().totalPower > 0 ? Math.round(calculateStats().totalCost / calculateStats().totalPower).toLocaleString() : 0}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Components</span>
                          <span className="font-medium">{selectedComponents.length}</span>
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
                          <span className="font-medium">{calculateStats().totalEmissions} kg</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Carbon Footprint</span>
                          <span className="font-medium">
                            {calculateStats().totalEmissions === 0 ? "Zero Carbon" : "Mixed Sources"}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Sustainability Score</span>
                          <span className="font-medium">
                            {calculateStats().totalEmissions === 0 ? "A+" : 
                             calculateStats().totalEmissions < 1000 ? "A" : 
                             calculateStats().totalEmissions < 5000 ? "B" : "C"}
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
                            <span className="text-sm font-medium">{calculateStats().reliability}%</span>
                          </div>
                          <Progress value={calculateStats().reliability} className="h-2" />
                        </div>
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm">System Efficiency</span>
                            <span className="text-sm font-medium">{calculateStats().efficiency}%</span>
                          </div>
                          <Progress value={calculateStats().efficiency} className="h-2" />
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Expected uptime: {Math.round(calculateStats().reliability * 8760 / 100)} hours/year
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
                          <span className="font-medium">{calculateStats().totalPower} kW</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Daily Generation</span>
                          <span className="font-medium">~{Math.round(calculateStats().totalPower * 6)} kWh</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Annual Generation</span>
                          <span className="font-medium">~{Math.round(calculateStats().totalPower * 2190)} kWh</span>
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
                      {calculateStats().totalEmissions > 1000 && (
                        <div className="flex items-start gap-3 p-3 bg-orange-50 dark:bg-orange-950/20 rounded-lg">
                          <AlertCircle className="w-5 h-5 text-orange-600 mt-0.5" />
                          <div className="text-sm">
                            <strong>Consider more renewable sources:</strong> Your system has high carbon emissions. 
                            Adding more solar panels or wind turbines could improve sustainability.
                          </div>
                        </div>
                      )}
                      {calculateStats().reliability < 80 && (
                        <div className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                          <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                          <div className="text-sm">
                            <strong>Add backup power:</strong> System reliability could be improved with 
                            additional battery storage or backup generators.
                          </div>
                        </div>
                      )}
                      {calculateStats().totalPower < 10 && (
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

          <TabsContent value="challenges" className="space-y-6">
            <ChallengeSystem
              selectedComponents={selectedComponents}
              currentChallenge={currentChallenge}
              onChallengeSelect={handleChallengeSelect}
              onChallengeComplete={handleChallengeComplete}
            />
          </TabsContent>

          <TabsContent value="location" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
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
          </TabsContent>
        </Tabs>
      </div>

      {/* Modals */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onAuthSuccess={() => setShowAuthModal(false)}
      />
      
      <AddressScanModal
        isOpen={showAddressScanModal}
        onClose={() => setShowAddressScanModal(false)}
        onScanComplete={handleScanComplete}
      />

      <ComponentCustomizeModal
        isOpen={showCustomizeModal}
        onClose={() => setShowCustomizeModal(false)}
        component={customizeComponent}
        onSave={handleComponentUpdate}
      />
    </div>
  );
};

export default Simulator;