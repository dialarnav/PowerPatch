import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { address } = await req.json();

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { 
            role: 'system', 
            content: `You are an expert energy consultant that analyzes residential properties for microgrid potential. 
            Based on the address provided, analyze the property characteristics and recommend optimal microgrid components.
            
            Consider factors like:
            - Geographic location and climate
            - Typical house size and energy consumption
            - Solar potential based on region
            - Local weather patterns
            - Utility costs in the area
            
            Return a JSON response with this structure:
            {
              "analysis": "Detailed property analysis",
              "energyNeeds": "Estimated monthly kWh consumption",
              "solarPotential": "Solar generation potential",
              "recommendations": [
                {
                  "type": "solar|wind|battery|generator",
                  "name": "Component name",
                  "power": number,
                  "cost": number,
                  "count": number,
                  "reasoning": "Why this component is recommended"
                }
              ],
              "totalCost": number,
              "paybackPeriod": "Estimated payback time",
              "carbonSavings": "Annual CO2 reduction"
            }`
          },
          { role: 'user', content: `Analyze this address for microgrid potential: ${address}` }
        ],
      }),
    });

    const data = await response.json();
    const analysis = data.choices[0].message.content;

    // Try to parse as JSON, fallback to text if not valid JSON
    let parsedAnalysis;
    try {
      parsedAnalysis = JSON.parse(analysis);
    } catch {
      parsedAnalysis = { analysis, error: "Could not parse structured response" };
    }

    return new Response(JSON.stringify(parsedAnalysis), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in ai-house-scan function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});