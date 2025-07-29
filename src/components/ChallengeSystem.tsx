import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { SimulatorComponent } from './SimulatorCanvas';
import { 
  Target, 
  DollarSign, 
  Zap, 
  Leaf, 
  Users, 
  Clock, 
  TrendingUp, 
  AlertCircle,
  CheckCircle,
  Star,
  BookOpen,
  Trophy,
  Settings
} from "lucide-react";

export interface Challenge {
  id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: 'cost' | 'sustainability' | 'reliability' | 'community';
  objectives: Objective[];
  constraints: Constraint[];
  context: {
    location: string;
    population?: number;
    budget: number;
    specialConditions?: string[];
  };
  rewards: {
    points: number;
    badges: string[];
    unlocks?: string[];
  };
}

export interface Objective {
  id: string;
  description: string;
  target: number;
  unit: string;
  metric: 'totalCost' | 'totalPower' | 'reliability' | 'emissions' | 'efficiency' | 'custom';
  weight: number; // 0-1, for scoring
  achieved?: boolean;
  current?: number;
}

export interface Constraint {
  id: string;
  description: string;
  type: 'maxBudget' | 'minPower' | 'maxEmissions' | 'requiredComponents' | 'location' | 'custom';
  value: number | string | string[];
  violated?: boolean;
}

const challenges: Challenge[] = [
  {
    id: 'kenya-school',
    title: '🏫 Power a Rural School in Kenya',
    description: 'Design a reliable solar microgrid for 200 students in rural Kenya. The system must provide consistent power for lighting, computers, and basic equipment while staying within budget.',
    difficulty: 'beginner',
    category: 'community',
    objectives: [
      {
        id: 'power-target',
        description: 'Provide at least 15kW total power',
        target: 15,
        unit: 'kW',
        metric: 'totalPower',
        weight: 0.4
      },
      {
        id: 'reliability-target',
        description: 'Achieve 90% system reliability',
        target: 90,
        unit: '%',
        metric: 'reliability',
        weight: 0.3
      },
      {
        id: 'sustainability-target',
        description: 'Zero carbon emissions',
        target: 0,
        unit: 'kg CO₂/year',
        metric: 'emissions',
        weight: 0.3
      }
    ],
    constraints: [
      {
        id: 'budget-limit',
        description: 'Maximum budget: $15,000',
        type: 'maxBudget',
        value: 15000
      },
      {
        id: 'required-solar',
        description: 'Must include solar panels',
        type: 'requiredComponents',
        value: ['solar']
      }
    ],
    context: {
      location: 'Rural Kenya',
      population: 200,
      budget: 15000,
      specialConditions: ['High solar irradiance', 'Limited grid access', 'Dust environment']
    },
    rewards: {
      points: 100,
      badges: ['Solar Pioneer', 'Community Helper'],
      unlocks: ['Advanced Solar Components']
    }
  },
  {
    id: 'refugee-camp',
    title: '🏕️ Refugee Camp Emergency Power',
    description: 'Create a rapid deployment energy system for 5,000 people in an emergency refugee camp. The system must be robust, quickly deployable, and work in extreme conditions.',
    difficulty: 'intermediate',
    category: 'community',
    objectives: [
      {
        id: 'power-coverage',
        description: 'Provide 100kW for essential services',
        target: 100,
        unit: 'kW',
        metric: 'totalPower',
        weight: 0.3
      },
      {
        id: 'rapid-deployment',
        description: 'High reliability for critical systems',
        target: 95,
        unit: '%',
        metric: 'reliability',
        weight: 0.4
      },
      {
        id: 'operational-efficiency',
        description: 'System efficiency above 85%',
        target: 85,
        unit: '%',
        metric: 'efficiency',
        weight: 0.3
      }
    ],
    constraints: [
      {
        id: 'emergency-budget',
        description: 'Emergency budget: $50,000',
        type: 'maxBudget',
        value: 50000
      },
      {
        id: 'backup-required',
        description: 'Must include backup generators',
        type: 'requiredComponents',
        value: ['generator']
      },
      {
        id: 'battery-storage',
        description: 'Must include battery storage',
        type: 'requiredComponents',
        value: ['battery']
      }
    ],
    context: {
      location: 'Emergency Refugee Camp',
      population: 5000,
      budget: 50000,
      specialConditions: ['Extreme weather', 'No grid connection', 'Security concerns', 'Rapid deployment needed']
    },
    rewards: {
      points: 250,
      badges: ['Crisis Manager', 'Humanitarian Engineer'],
      unlocks: ['Emergency Systems', 'Portable Components']
    }
  },
  {
    id: 'eco-community',
    title: '🏠 Off-Grid Eco Community',
    description: 'Design a 100% renewable microgrid for 50 families in an eco-community. Focus on sustainability, energy independence, and smart grid integration.',
    difficulty: 'advanced',
    category: 'sustainability',
    objectives: [
      {
        id: 'renewable-target',
        description: 'Zero fossil fuel emissions',
        target: 0,
        unit: 'kg CO₂/year',
        metric: 'emissions',
        weight: 0.4
      },
      {
        id: 'power-independence',
        description: 'Generate 250kW renewable power',
        target: 250,
        unit: 'kW',
        metric: 'totalPower',
        weight: 0.3
      },
      {
        id: 'high-efficiency',
        description: 'Achieve 95% system efficiency',
        target: 95,
        unit: '%',
        metric: 'efficiency',
        weight: 0.3
      }
    ],
    constraints: [
      {
        id: 'eco-budget',
        description: 'Community budget: $200,000',
        type: 'maxBudget',
        value: 200000
      },
      {
        id: 'no-fossil-fuels',
        description: 'No fossil fuel generators allowed',
        type: 'custom',
        value: 'no-generators'
      },
      {
        id: 'diverse-sources',
        description: 'Must use 3+ renewable sources',
        type: 'requiredComponents',
        value: ['solar', 'wind', 'battery']
      }
    ],
    context: {
      location: 'Off-Grid Eco Community',
      population: 50,
      budget: 200000,
      specialConditions: ['Environmental regulations', 'Smart grid required', 'Energy storage critical']
    },
    rewards: {
      points: 500,
      badges: ['Sustainability Master', 'Green Innovator', 'Grid Pioneer'],
      unlocks: ['Advanced Battery Systems', 'Smart Grid Components', 'Hydro Systems']
    }
  },
  {
    id: 'island-resort',
    title: '🏝️ Sustainable Island Resort',
    description: 'Replace diesel generators with clean energy for a tropical resort. Balance tourism needs with environmental protection.',
    difficulty: 'intermediate',
    category: 'sustainability',
    objectives: [
      {
        id: 'emission-reduction',
        description: 'Reduce emissions by 80%',
        target: 1000,
        unit: 'kg CO₂/year',
        metric: 'emissions',
        weight: 0.4
      },
      {
        id: 'resort-power',
        description: 'Provide 75kW for resort operations',
        target: 75,
        unit: 'kW',
        metric: 'totalPower',
        weight: 0.3
      },
      {
        id: 'uptime-requirement',
        description: 'Maintain 98% reliability',
        target: 98,
        unit: '%',
        metric: 'reliability',
        weight: 0.3
      }
    ],
    constraints: [
      {
        id: 'resort-budget',
        description: 'Resort investment budget: $75,000',
        type: 'maxBudget',
        value: 75000
      },
      {
        id: 'backup-generators',
        description: 'Keep some backup generation',
        type: 'requiredComponents',
        value: ['generator']
      }
    ],
    context: {
      location: 'Tropical Island Resort',
      budget: 75000,
      specialConditions: ['Salt air corrosion', 'Hurricane season', 'Tourist expectations', 'Environmental protection']
    },
    rewards: {
      points: 300,
      badges: ['Tourism Innovator', 'Island Engineer'],
      unlocks: ['Marine Components', 'Weather Resistant Systems']
    }
  }
];

interface ChallengeSystemProps {
  selectedComponents: SimulatorComponent[];
  currentChallenge: Challenge | null;
  onChallengeSelect: (challenge: Challenge) => void;
  onChallengeComplete: (challenge: Challenge, score: number) => void;
}

export const ChallengeSystem: React.FC<ChallengeSystemProps> = ({
  selectedComponents,
  currentChallenge,
  onChallengeSelect,
  onChallengeComplete
}) => {
  const [challengeResults, setChallengeResults] = useState<{
    objectives: Objective[];
    constraints: Constraint[];
    score: number;
    completed: boolean;
  } | null>(null);

  useEffect(() => {
    if (currentChallenge && selectedComponents.length > 0) {
      evaluateChallenge();
    }
  }, [currentChallenge, selectedComponents]);

  const calculateMetric = (metric: string): number => {
    switch (metric) {
      case 'totalCost':
        return selectedComponents.reduce((sum, comp) => sum + (comp.cost * comp.count), 0);
      case 'totalPower':
        return selectedComponents.reduce((sum, comp) => sum + (comp.power * comp.count), 0);
      case 'emissions':
        return selectedComponents.reduce((sum, comp) => sum + (comp.emissions * comp.count), 0);
      case 'reliability':
        const totalWeightedReliability = selectedComponents.reduce((sum, comp) => 
          sum + (comp.reliability * comp.power * comp.count), 0);
        const totalPower = selectedComponents.reduce((sum, comp) => sum + (comp.power * comp.count), 0);
        return totalPower > 0 ? totalWeightedReliability / totalPower : 0;
      case 'efficiency':
        const totalWeightedEfficiency = selectedComponents.reduce((sum, comp) => 
          sum + (comp.efficiency * comp.power * comp.count), 0);
        const totalPowerEff = selectedComponents.reduce((sum, comp) => sum + (comp.power * comp.count), 0);
        return totalPowerEff > 0 ? totalWeightedEfficiency / totalPowerEff : 0;
      default:
        return 0;
    }
  };

  const evaluateChallenge = () => {
    if (!currentChallenge) return;

    // Evaluate objectives
    const evaluatedObjectives = currentChallenge.objectives.map(obj => {
      const current = calculateMetric(obj.metric);
      const achieved = 
        obj.metric === 'emissions' ? current <= obj.target :
        current >= obj.target;
      
      return {
        ...obj,
        current,
        achieved
      };
    });

    // Evaluate constraints
    const evaluatedConstraints = currentChallenge.constraints.map(constraint => {
      let violated = false;
      
      switch (constraint.type) {
        case 'maxBudget':
          violated = calculateMetric('totalCost') > (constraint.value as number);
          break;
        case 'minPower':
          violated = calculateMetric('totalPower') < (constraint.value as number);
          break;
        case 'maxEmissions':
          violated = calculateMetric('emissions') > (constraint.value as number);
          break;
        case 'requiredComponents':
          const requiredTypes = constraint.value as string[];
          const presentTypes = [...new Set(selectedComponents.map(comp => comp.type))];
          violated = !requiredTypes.every(type => presentTypes.includes(type as any));
          break;
      }

      return {
        ...constraint,
        violated
      };
    });

    // Calculate score
    const objectiveScore = evaluatedObjectives.reduce((score, obj) => {
      if (obj.achieved) {
        return score + (obj.weight * 100);
      } else {
        // Partial credit based on progress
        const progress = obj.metric === 'emissions' ? 
          Math.max(0, 1 - (obj.current! / obj.target)) :
          Math.min(1, obj.current! / obj.target);
        return score + (obj.weight * progress * 100);
      }
    }, 0);

    const constraintPenalty = evaluatedConstraints.reduce((penalty, constraint) => {
      return penalty + (constraint.violated ? -20 : 0);
    }, 0);

    const finalScore = Math.max(0, Math.min(100, objectiveScore + constraintPenalty));
    const completed = evaluatedObjectives.every(obj => obj.achieved) && 
                     !evaluatedConstraints.some(constraint => constraint.violated);

    setChallengeResults({
      objectives: evaluatedObjectives,
      constraints: evaluatedConstraints,
      score: Math.round(finalScore),
      completed
    });
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'cost': return <DollarSign className="w-4 h-4" />;
      case 'sustainability': return <Leaf className="w-4 h-4" />;
      case 'reliability': return <Zap className="w-4 h-4" />;
      case 'community': return <Users className="w-4 h-4" />;
      default: return <Target className="w-4 h-4" />;
    }
  };

  if (!currentChallenge) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5" />
            Select a Challenge
          </CardTitle>
          <CardDescription>
            Choose a challenge to test your microgrid design skills
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {challenges.map((challenge) => (
              <Card 
                key={challenge.id} 
                className="cursor-pointer hover:shadow-md transition-all border-l-4 border-l-primary"
                onClick={() => onChallengeSelect(challenge)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      {getCategoryIcon(challenge.category)}
                      <h3 className="font-semibold">{challenge.title}</h3>
                    </div>
                    <Badge className={getDifficultyColor(challenge.difficulty)}>
                      {challenge.difficulty}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    {challenge.description}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3" />
                      {challenge.rewards.points} points
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {challenge.context.population ? `${challenge.context.population} people` : challenge.context.location}
                    </div>
                    <div className="flex items-center gap-1">
                      <DollarSign className="w-3 h-3" />
                      ${challenge.context.budget.toLocaleString()}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Challenge Header */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 mb-2">
                {getCategoryIcon(currentChallenge.category)}
                {currentChallenge.title}
                <Badge className={getDifficultyColor(currentChallenge.difficulty)}>
                  {currentChallenge.difficulty}
                </Badge>
              </CardTitle>
              <CardDescription className="text-base">
                {currentChallenge.description}
              </CardDescription>
            </div>
            <Button variant="outline" onClick={() => onChallengeSelect(null)}>
              Change Challenge
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium mb-2">Context</h4>
              <div className="space-y-1 text-sm text-muted-foreground">
                <div>📍 {currentChallenge.context.location}</div>
                {currentChallenge.context.population && (
                  <div>👥 {currentChallenge.context.population} people</div>
                )}
                <div>💰 Budget: ${currentChallenge.context.budget.toLocaleString()}</div>
              </div>
            </div>
            <div>
              <h4 className="font-medium mb-2">Special Conditions</h4>
              <div className="flex flex-wrap gap-1">
                {currentChallenge.context.specialConditions?.map((condition, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {condition}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Challenge Progress */}
      {challengeResults && (
        <>
          {/* Score and Completion Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Challenge Progress
                {challengeResults.completed && (
                  <Badge className="bg-green-100 text-green-800">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Completed!
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span>Overall Score</span>
                    <span className="font-bold text-lg">{challengeResults.score}%</span>
                  </div>
                  <Progress value={challengeResults.score} className="h-3" />
                </div>

                {challengeResults.completed && (
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Trophy className="w-5 h-5 text-green-600" />
                      <h4 className="font-medium text-green-800">Challenge Completed!</h4>
                    </div>
                    <div className="text-sm text-green-700">
                      <div>🎉 Earned {currentChallenge.rewards.points} points</div>
                      <div className="flex gap-1 mt-1">
                        {currentChallenge.rewards.badges.map((badge, index) => (
                          <Badge key={index} variant="secondary">🏆 {badge}</Badge>
                        ))}
                      </div>
                    </div>
                    <Button 
                      className="mt-3" 
                      onClick={() => onChallengeComplete(currentChallenge, challengeResults.score)}
                    >
                      Complete Challenge
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Objectives */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                Objectives
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {challengeResults.objectives.map((objective) => (
                  <div key={objective.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{objective.description}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm">
                          {objective.current?.toFixed(1)} / {objective.target} {objective.unit}
                        </span>
                        {objective.achieved ? (
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        ) : (
                          <AlertCircle className="w-4 h-4 text-orange-600" />
                        )}
                      </div>
                    </div>
                    <Progress 
                      value={objective.metric === 'emissions' ? 
                        Math.max(0, (1 - (objective.current! / objective.target)) * 100) :
                        Math.min(100, (objective.current! / objective.target) * 100)} 
                      className="h-2" 
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Constraints */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Constraints
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {challengeResults.constraints.map((constraint) => (
                  <Alert key={constraint.id} variant={constraint.violated ? "destructive" : "default"}>
                    <div className="flex items-center gap-2">
                      {constraint.violated ? (
                        <AlertCircle className="w-4 h-4" />
                      ) : (
                        <CheckCircle className="w-4 h-4" />
                      )}
                      <AlertDescription>
                        {constraint.description}
                        {constraint.violated && (
                          <span className="ml-2 font-medium">❌ Violated</span>
                        )}
                      </AlertDescription>
                    </div>
                  </Alert>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export { challenges };