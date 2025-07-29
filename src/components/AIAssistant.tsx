import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { 
  Bot, 
  Lightbulb, 
  Send, 
  Zap,
  Sun,
  Wind,
  Battery,
  CheckCircle,
  Loader2
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

interface Location {
  country: string;
  state?: string;
  region: string;
  costMultiplier: number;
  currency: string;
  laborCost: number;
  shippingCost: number;
}

interface AIAssistantProps {
  location: Location | null;
  onComponentsGenerated: (components: Component[]) => void;
  currentComponents: Component[];
}

interface AIRequest {
  useCase: string;
  budget: number;
  powerRequirement: string;
  constraints: string;
  additionalInfo: string;
}

const AIAssistant: React.FC<AIAssistantProps> = ({ 
  location, 
  onComponentsGenerated, 
  currentComponents 
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [lastSuggestion, setLastSuggestion] = useState<any>(null);
  const { toast } = useToast();

  const [request, setRequest] = useState<AIRequest>({
    useCase: '',
    budget: 50000,
    powerRequirement: '',
    constraints: '',
    additionalInfo: ''
  });

  const useCaseTemplates = [
    { name: "Rural School", budget: 15000, power: "15-25 kW", description: "Power classrooms, computer lab, and lighting" },
    { name: "Village Community", budget: 75000, power: "50-100 kW", description: "Residential homes, clinic, and community center" },
    { name: "Small Hospital", budget: 120000, power: "100-150 kW", description: "Medical equipment, lighting, and backup power" },
    { name: "Agricultural Farm", budget: 85000, power: "60-80 kW", description: "Irrigation, processing, and storage facilities" },
    { name: "Remote Resort", budget: 200000, power: "150-200 kW", description: "Guest facilities, restaurant, and amenities" },
    { name: "Research Station", budget: 150000, power: "80-120 kW", description: "Laboratory equipment and communication systems" }
  ];

  const applyTemplate = (template: typeof useCaseTemplates[0]) => {
    setRequest(prev => ({
      ...prev,
      useCase: template.name,
      budget: template.budget,
      powerRequirement: template.power,
      additionalInfo: template.description
    }));
  };

  const generateAISuggestion = async () => {
    if (!location) {
      toast({
        title: "Location Required",
        description: "Please select a project location first.",
        variant: "destructive"
      });
      return;
    }

    if (!request.useCase || !request.powerRequirement) {
      toast({
        title: "Missing Information",
        description: "Please fill in the use case and power requirements.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      const prompt = `You are an expert microgrid designer. Design an optimal microgrid configuration based on these requirements:

USE CASE: ${request.useCase}
LOCATION: ${location.country}${location.state ? `, ${location.state}` : ''}
BUDGET: $${request.budget.toLocaleString()} USD
POWER REQUIREMENT: ${request.powerRequirement}
CONSTRAINTS: ${request.constraints || 'None specified'}
ADDITIONAL INFO: ${request.additionalInfo || 'None'}

LOCATION FACTORS:
- Cost multiplier: ${location.costMultiplier}x
- Labor cost: $${location.laborCost}/hour
- Shipping cost: $${location.shippingCost}/kg

AVAILABLE COMPONENTS (base costs before location adjustment):
1. Solar Panel (5kW): $3,000 each, 0 emissions, 85% reliability
2. Wind Turbine (10kW): $8,000 each, 0 emissions, 70% reliability  
3. Battery Storage (20kWh): $5,000 each, 0 emissions, 95% reliability
4. Backup Generator (15kW): $2,000 each, 1200 kg CO2/year, 99% reliability

Please respond with ONLY a JSON object in this exact format:
{
  "reasoning": "Brief explanation of your design decisions",
  "cost": total_estimated_cost_number,
  "reliability": overall_system_reliability_percentage,
  "emissions": annual_co2_emissions_kg,
  "components": [
    {
      "type": "solar|wind|battery|generator",
      "name": "Component name",
      "power": power_in_kw,
      "cost": cost_in_usd,
      "count": quantity_needed,
      "emissions": annual_kg_co2,
      "reliability": reliability_percentage
    }
  ],
  "recommendations": [
    "Key recommendation 1",
    "Key recommendation 2"
  ]
}`;

      const { data, error } = await supabase.functions.invoke('ai-house-scan', {
        body: { 
          address: `Microgrid Design: ${request.useCase} in ${location.country}`,
          prompt: prompt
        },
      });

      if (error) {
        throw error;
      }

      // Try to parse the response as JSON
      let aiResponse = data;
      if (typeof data === 'string') {
        try {
          aiResponse = JSON.parse(data);
        } catch {
          // If not valid JSON, try to extract JSON from the response
          const jsonMatch = data.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            aiResponse = JSON.parse(jsonMatch[0]);
          }
        }
      }

      setLastSuggestion(aiResponse);
      toast({
        title: "AI Suggestion Generated",
        description: "Review the recommendations below.",
      });
    } catch (error) {
      console.error('AI suggestion error:', error);
      toast({
        title: "Generation Failed",
        description: "Unable to generate AI suggestions. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const applyAISuggestion = () => {
    if (!lastSuggestion || !lastSuggestion.components) {
      toast({
        title: "No Suggestion to Apply",
        description: "Please generate an AI suggestion first.",
        variant: "destructive"
      });
      return;
    }

    const components: Component[] = lastSuggestion.components.map((comp: any, index: number) => ({
      id: `ai-${Date.now()}-${index}`,
      type: comp.type,
      name: comp.name,
      power: comp.power || 0,
      cost: comp.cost || 0,
      emissions: comp.emissions || 0,
      reliability: comp.reliability || 85,
      count: comp.count || 1,
      efficiency: comp.efficiency,
      capacity: comp.capacity,
      customizable: false,
      customOptions: undefined
    }));

    onComponentsGenerated(components);
    
    toast({
      title: "Configuration Applied",
      description: `Added ${components.length} component types to your design.`,
    });
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bot className="w-5 h-5 text-primary" />
          AI Assistant
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Use Case Templates */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Quick Templates</Label>
          <div className="grid grid-cols-2 gap-2">
            {useCaseTemplates.map((template) => (
              <Button
                key={template.name}
                variant="outline"
                size="sm"
                onClick={() => applyTemplate(template)}
                className="h-auto p-2 text-xs"
              >
                <div className="text-center">
                  <div className="font-medium">{template.name}</div>
                  <div className="text-muted-foreground">${template.budget.toLocaleString()}</div>
                </div>
              </Button>
            ))}
          </div>
        </div>

        {/* AI Request Form */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="useCase">Use Case *</Label>
            <Input
              id="useCase"
              value={request.useCase}
              onChange={(e) => setRequest({...request, useCase: e.target.value})}
              placeholder="e.g., Rural school, Village clinic"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="budget">Budget (USD)</Label>
            <Input
              id="budget"
              type="number"
              value={request.budget}
              onChange={(e) => setRequest({...request, budget: parseInt(e.target.value) || 0})}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="powerRequirement">Power Requirement *</Label>
            <Input
              id="powerRequirement"
              value={request.powerRequirement}
              onChange={(e) => setRequest({...request, powerRequirement: e.target.value})}
              placeholder="e.g., 50-100 kW, 24/7 power"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="constraints">Constraints</Label>
            <Textarea
              id="constraints"
              value={request.constraints}
              onChange={(e) => setRequest({...request, constraints: e.target.value})}
              placeholder="e.g., Limited space, extreme weather, maintenance restrictions"
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="additionalInfo">Additional Information</Label>
            <Textarea
              id="additionalInfo"
              value={request.additionalInfo}
              onChange={(e) => setRequest({...request, additionalInfo: e.target.value})}
              placeholder="Any other relevant details about your project"
              rows={2}
            />
          </div>
        </div>

        {/* Generate Button */}
        <Button 
          onClick={generateAISuggestion} 
          disabled={isLoading || !location}
          className="w-full"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Send className="w-4 h-4 mr-2" />
              Generate AI Suggestion
            </>
          )}
        </Button>

        {/* AI Suggestion Display */}
        {lastSuggestion && (
          <div className="space-y-4 p-4 bg-muted rounded-lg">
            <div className="flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-yellow-500" />
              <span className="font-medium">AI Recommendation</span>
            </div>
            
            <p className="text-sm text-muted-foreground">{lastSuggestion.reasoning}</p>
            
            {/* Key Metrics */}
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div className="text-center">
                <div className="font-medium text-green-600">${lastSuggestion.cost?.toLocaleString()}</div>
                <div className="text-muted-foreground">Total Cost</div>
              </div>
              <div className="text-center">
                <div className="font-medium text-blue-600">{lastSuggestion.reliability}%</div>
                <div className="text-muted-foreground">Reliability</div>
              </div>
              <div className="text-center">
                <div className="font-medium text-orange-600">{lastSuggestion.emissions}</div>
                <div className="text-muted-foreground">kg CO₂/year</div>
              </div>
            </div>

            {/* Components */}
            {lastSuggestion.components && (
              <div className="space-y-2">
                <div className="font-medium text-sm">Recommended Components:</div>
                {lastSuggestion.components.map((comp: any, index: number) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    {comp.type === 'solar' && <Sun className="w-4 h-4 text-yellow-500" />}
                    {comp.type === 'wind' && <Wind className="w-4 h-4 text-blue-500" />}
                    {comp.type === 'battery' && <Battery className="w-4 h-4 text-green-500" />}
                    {comp.type === 'generator' && <Zap className="w-4 h-4 text-red-500" />}
                    <span>{comp.count}x {comp.name}</span>
                    <Badge variant="secondary" className="text-xs">
                      ${comp.cost?.toLocaleString()}
                    </Badge>
                  </div>
                ))}
              </div>
            )}

            {/* Recommendations */}
            {lastSuggestion.recommendations && (
              <div className="space-y-2">
                <div className="font-medium text-sm">Key Recommendations:</div>
                <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                  {lastSuggestion.recommendations.map((rec: string, index: number) => (
                    <li key={index}>{rec}</li>
                  ))}
                </ul>
              </div>
            )}

            <Button onClick={applyAISuggestion} className="w-full" variant="outline">
              <CheckCircle className="w-4 h-4 mr-2" />
              Apply This Configuration
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AIAssistant;