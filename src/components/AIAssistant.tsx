import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { 
  Bot, 
  Lightbulb, 
  Send, 
  Settings, 
  Zap,
  Sun,
  Wind,
  Battery,
  AlertCircle,
  CheckCircle,
  Loader2
} from "lucide-react";

interface Component {
  id: string;
  type: 'solar' | 'wind' | 'battery' | 'generator';
  name: string;
  power: number;
  cost: number;
  emissions: number;
  reliability: number;
  count: number;
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
  const [apiKey, setApiKey] = useState('');
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);
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
    if (!apiKey) {
      setShowApiKeyInput(true);
      toast({
        title: "API Key Required",
        description: "Please enter your OpenAI API key to use AI suggestions.",
        variant: "destructive"
      });
      return;
    }

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
  "reasoning": "Brief explanation of your design choices",
  "totalEstimatedCost": number,
  "estimatedReliability": number,
  "estimatedEmissions": number,
  "components": [
    {
      "type": "solar|wind|battery|generator",
      "count": number,
      "reasoning": "Why this quantity is recommended"
    }
  ],
  "recommendations": [
    "Key recommendation 1",
    "Key recommendation 2"
  ]
}`;

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4.1-2025-04-14',
          messages: [
            {
              role: 'system',
              content: 'You are an expert microgrid engineer. Respond only with valid JSON objects. Consider local costs, climate, and infrastructure when making recommendations.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.3,
          max_tokens: 1500,
        }),
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`);
      }

      const data = await response.json();
      const aiResponse = data.choices[0].message.content;
      
      // Parse the JSON response
      let suggestion;
      try {
        suggestion = JSON.parse(aiResponse);
      } catch (e) {
        // Try to extract JSON from the response if it's wrapped in text
        const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          suggestion = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error('Invalid JSON response from AI');
        }
      }

      setLastSuggestion(suggestion);
      
      toast({
        title: "AI Suggestion Generated",
        description: "Review the recommended microgrid configuration below.",
      });

    } catch (error) {
      console.error('AI suggestion error:', error);
      toast({
        title: "AI Suggestion Failed",
        description: error instanceof Error ? error.message : "Failed to generate suggestion. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const applyAISuggestion = () => {
    if (!lastSuggestion) return;

    const componentMap = {
      solar: { type: 'solar', name: 'Solar Panel (5kW)', power: 5, cost: 3000, emissions: 0, reliability: 85 },
      wind: { type: 'wind', name: 'Wind Turbine (10kW)', power: 10, cost: 8000, emissions: 0, reliability: 70 },
      battery: { type: 'battery', name: 'Battery Storage (20kWh)', power: 0, cost: 5000, emissions: 0, reliability: 95 },
      generator: { type: 'generator', name: 'Backup Generator (15kW)', power: 15, cost: 2000, emissions: 1200, reliability: 99 }
    };

    const newComponents: Component[] = lastSuggestion.components.map((comp: any, index: number) => {
      const baseComponent = componentMap[comp.type as keyof typeof componentMap];
      return {
        id: Math.random().toString(36).substr(2, 9),
        type: comp.type,
        name: baseComponent.name,
        power: baseComponent.power,
        cost: Math.round(baseComponent.cost * (location?.costMultiplier || 1)),
        emissions: baseComponent.emissions,
        reliability: baseComponent.reliability,
        count: comp.count
      };
    });

    onComponentsGenerated(newComponents);
    
    toast({
      title: "AI Suggestion Applied",
      description: "The recommended components have been added to your design.",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bot className="w-5 h-5 text-primary" />
          AI Design Assistant
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Get intelligent microgrid recommendations based on your specific requirements
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* API Key Input */}
        {showApiKeyInput && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-3">
                <p>To use AI suggestions, please enter your OpenAI API key:</p>
                <div className="space-y-2">
                  <Input
                    type="password"
                    placeholder="sk-..."
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                  />
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => setShowApiKeyInput(false)}>
                      Save Key
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => setShowApiKeyInput(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  Your API key is only stored locally and never transmitted to our servers.
                </p>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {!showApiKeyInput && !apiKey && (
          <Alert>
            <Settings className="h-4 w-4" />
            <AlertDescription>
              <div className="flex justify-between items-center">
                <span>OpenAI API key required for AI suggestions</span>
                <Button size="sm" variant="outline" onClick={() => setShowApiKeyInput(true)}>
                  Add API Key
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* Use Case Templates */}
        <div className="space-y-3">
          <Label>Quick Templates</Label>
          <div className="grid grid-cols-2 gap-2">
            {useCaseTemplates.map((template, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                className="text-left justify-start h-auto p-3"
                onClick={() => applyTemplate(template)}
              >
                <div>
                  <div className="font-medium text-xs">{template.name}</div>
                  <div className="text-xs text-muted-foreground">{template.power}</div>
                </div>
              </Button>
            ))}
          </div>
        </div>

        {/* Request Form */}
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="useCase">Use Case *</Label>
              <Input
                id="useCase"
                placeholder="e.g., Rural School, Village Community"
                value={request.useCase}
                onChange={(e) => setRequest(prev => ({ ...prev, useCase: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="budget">Budget (USD) *</Label>
              <Input
                id="budget"
                type="number"
                placeholder="50000"
                value={request.budget}
                onChange={(e) => setRequest(prev => ({ ...prev, budget: parseInt(e.target.value) || 0 }))}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="powerRequirement">Power Requirement *</Label>
            <Input
              id="powerRequirement"
              placeholder="e.g., 50-100 kW, 25 kW minimum"
              value={request.powerRequirement}
              onChange={(e) => setRequest(prev => ({ ...prev, powerRequirement: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="constraints">Constraints</Label>
            <Input
              id="constraints"
              placeholder="e.g., limited space, high wind area, dusty environment"
              value={request.constraints}
              onChange={(e) => setRequest(prev => ({ ...prev, constraints: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="additionalInfo">Additional Information</Label>
            <Textarea
              id="additionalInfo"
              placeholder="Any additional details about your project..."
              className="min-h-[80px]"
              value={request.additionalInfo}
              onChange={(e) => setRequest(prev => ({ ...prev, additionalInfo: e.target.value }))}
            />
          </div>
        </div>

        {/* Generate Button */}
        <Button 
          onClick={generateAISuggestion}
          disabled={isLoading || !apiKey || !location}
          className="w-full"
          variant="cta"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating AI Suggestion...
            </>
          ) : (
            <>
              <Lightbulb className="mr-2 h-4 w-4" />
              Generate AI Suggestion
            </>
          )}
        </Button>

        {/* AI Suggestion Display */}
        {lastSuggestion && (
          <Card className="border-primary/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Bot className="w-5 h-5 text-primary" />
                AI Recommendation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-sm text-muted-foreground">
                {lastSuggestion.reasoning}
              </div>

              {/* Key Metrics */}
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="p-3 bg-muted rounded-lg">
                  <div className="text-lg font-bold text-green-600">
                    ${lastSuggestion.totalEstimatedCost?.toLocaleString() || 'N/A'}
                  </div>
                  <div className="text-xs text-muted-foreground">Estimated Cost</div>
                </div>
                <div className="p-3 bg-muted rounded-lg">
                  <div className="text-lg font-bold text-blue-600">
                    {lastSuggestion.estimatedReliability || 'N/A'}%
                  </div>
                  <div className="text-xs text-muted-foreground">Reliability</div>
                </div>
                <div className="p-3 bg-muted rounded-lg">
                  <div className="text-lg font-bold text-orange-600">
                    {lastSuggestion.estimatedEmissions || 0}
                  </div>
                  <div className="text-xs text-muted-foreground">CO₂/year (kg)</div>
                </div>
              </div>

              {/* Components */}
              <div className="space-y-2">
                <Label>Recommended Components:</Label>
                {lastSuggestion.components?.map((comp: any, index: number) => {
                  const icons = {
                    solar: <Sun className="w-4 h-4 text-yellow-600" />,
                    wind: <Wind className="w-4 h-4 text-blue-600" />,
                    battery: <Battery className="w-4 h-4 text-green-600" />,
                    generator: <Zap className="w-4 h-4 text-orange-600" />
                  };

                  return (
                    <div key={index} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                      <div className="flex items-center gap-2">
                        {icons[comp.type as keyof typeof icons]}
                        <span className="font-medium capitalize">{comp.type}</span>
                        <Badge variant="outline">×{comp.count}</Badge>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {comp.reasoning}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Recommendations */}
              {lastSuggestion.recommendations && (
                <div className="space-y-2">
                  <Label>Key Recommendations:</Label>
                  {lastSuggestion.recommendations.map((rec: string, index: number) => (
                    <div key={index} className="flex items-start gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>{rec}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Apply Button */}
              <Button onClick={applyAISuggestion} className="w-full" variant="cta">
                <CheckCircle className="mr-2 h-4 w-4" />
                Apply This Configuration
              </Button>
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  );
};

export default AIAssistant;