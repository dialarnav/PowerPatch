import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { MapPin, DollarSign } from "lucide-react";

interface Location {
  country: string;
  state?: string;
  region: string;
  costMultiplier: number;
  currency: string;
  laborCost: number; // USD per hour
  shippingCost: number; // USD per kg
}

interface LocationSelectorProps {
  selectedLocation: Location | null;
  onLocationChange: (location: Location) => void;
}

const locations: Location[] = [
  // North America
  { country: "United States", state: "California", region: "North America", costMultiplier: 1.3, currency: "USD", laborCost: 45, shippingCost: 2 },
  { country: "United States", state: "Texas", region: "North America", costMultiplier: 1.1, currency: "USD", laborCost: 35, shippingCost: 2 },
  { country: "United States", state: "Florida", region: "North America", costMultiplier: 1.15, currency: "USD", laborCost: 32, shippingCost: 2 },
  { country: "Canada", state: "Ontario", region: "North America", costMultiplier: 1.25, currency: "CAD", laborCost: 40, shippingCost: 3 },
  { country: "Mexico", region: "North America", costMultiplier: 0.8, currency: "USD", laborCost: 15, shippingCost: 4 },
  
  // Europe
  { country: "Germany", region: "Europe", costMultiplier: 1.4, currency: "EUR", laborCost: 50, shippingCost: 3 },
  { country: "United Kingdom", region: "Europe", costMultiplier: 1.35, currency: "GBP", laborCost: 45, shippingCost: 3 },
  { country: "France", region: "Europe", costMultiplier: 1.3, currency: "EUR", laborCost: 42, shippingCost: 3 },
  { country: "Spain", region: "Europe", costMultiplier: 1.2, currency: "EUR", laborCost: 35, shippingCost: 3 },
  { country: "Poland", region: "Europe", costMultiplier: 0.9, currency: "EUR", laborCost: 25, shippingCost: 3 },
  
  // Asia
  { country: "Japan", region: "Asia", costMultiplier: 1.5, currency: "USD", laborCost: 55, shippingCost: 5 },
  { country: "South Korea", region: "Asia", costMultiplier: 1.3, currency: "USD", laborCost: 40, shippingCost: 4 },
  { country: "China", region: "Asia", costMultiplier: 0.7, currency: "USD", laborCost: 12, shippingCost: 3 },
  { country: "India", region: "Asia", costMultiplier: 0.6, currency: "USD", laborCost: 8, shippingCost: 4 },
  { country: "Thailand", region: "Asia", costMultiplier: 0.65, currency: "USD", laborCost: 10, shippingCost: 4 },
  
  // Africa
  { country: "South Africa", region: "Africa", costMultiplier: 0.75, currency: "USD", laborCost: 12, shippingCost: 6 },
  { country: "Kenya", region: "Africa", costMultiplier: 0.65, currency: "USD", laborCost: 8, shippingCost: 8 },
  { country: "Nigeria", region: "Africa", costMultiplier: 0.7, currency: "USD", laborCost: 10, shippingCost: 7 },
  { country: "Egypt", region: "Africa", costMultiplier: 0.68, currency: "USD", laborCost: 9, shippingCost: 6 },
  
  // South America
  { country: "Brazil", region: "South America", costMultiplier: 0.85, currency: "USD", laborCost: 18, shippingCost: 5 },
  { country: "Chile", region: "South America", costMultiplier: 0.9, currency: "USD", laborCost: 20, shippingCost: 6 },
  { country: "Argentina", region: "South America", costMultiplier: 0.8, currency: "USD", laborCost: 15, shippingCost: 6 },
  
  // Oceania
  { country: "Australia", region: "Oceania", costMultiplier: 1.4, currency: "AUD", laborCost: 48, shippingCost: 4 },
  { country: "New Zealand", region: "Oceania", costMultiplier: 1.35, currency: "NZD", laborCost: 45, shippingCost: 5 },
];

const LocationSelector: React.FC<LocationSelectorProps> = ({ selectedLocation, onLocationChange }) => {
  const [selectedRegion, setSelectedRegion] = useState<string>('');

  const regions = [...new Set(locations.map(loc => loc.region))];
  const filteredLocations = selectedRegion 
    ? locations.filter(loc => loc.region === selectedRegion)
    : locations;

  const getCostIndicator = (multiplier: number) => {
    if (multiplier < 0.7) return { label: "Very Low", color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300" };
    if (multiplier < 0.9) return { label: "Low", color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300" };
    if (multiplier < 1.1) return { label: "Average", color: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300" };
    if (multiplier < 1.3) return { label: "High", color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300" };
    return { label: "Very High", color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300" };
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="w-5 h-5 text-primary" />
          Project Location
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Select your project location for accurate pricing and recommendations
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Region Filter */}
        <div className="space-y-2">
          <Label>Filter by Region</Label>
          <div className="flex flex-wrap gap-2">
            <Badge 
              variant={selectedRegion === '' ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => setSelectedRegion('')}
            >
              All Regions
            </Badge>
            {regions.map(region => (
              <Badge 
                key={region}
                variant={selectedRegion === region ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => setSelectedRegion(region)}
              >
                {region}
              </Badge>
            ))}
          </div>
        </div>

        {/* Location Selection */}
        <div className="space-y-2">
          <Label>Select Location</Label>
          <div className="grid gap-2 max-h-60 overflow-y-auto">
            {filteredLocations.map((location, index) => {
              const costIndicator = getCostIndicator(location.costMultiplier);
              const isSelected = selectedLocation?.country === location.country && 
                               selectedLocation?.state === location.state;
              
              return (
                <div
                  key={index}
                  className={`p-3 border rounded-lg cursor-pointer transition-all hover:shadow-sm ${
                    isSelected ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
                  }`}
                  onClick={() => onLocationChange(location)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-medium">
                        {location.country}
                        {location.state && `, ${location.state}`}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {location.region}
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge className={costIndicator.color}>
                        {costIndicator.label}
                      </Badge>
                      <div className="text-xs text-muted-foreground mt-1">
                        {location.costMultiplier}x base cost
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-2 grid grid-cols-2 gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <DollarSign className="w-3 h-3" />
                      <span>Labor: ${location.laborCost}/hr</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <DollarSign className="w-3 h-3" />
                      <span>Shipping: ${location.shippingCost}/kg</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {selectedLocation && (
          <div className="p-3 bg-muted rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="w-4 h-4 text-primary" />
              <span className="font-medium">Selected Location</span>
            </div>
            <div className="text-sm space-y-1">
              <div>{selectedLocation.country}{selectedLocation.state && `, ${selectedLocation.state}`}</div>
              <div className="text-muted-foreground">
                Cost multiplier: {selectedLocation.costMultiplier}x | 
                Labor: ${selectedLocation.laborCost}/hr | 
                Shipping: ${selectedLocation.shippingCost}/kg
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LocationSelector;