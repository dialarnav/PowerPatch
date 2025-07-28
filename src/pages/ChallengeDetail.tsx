import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Home, 
  ArrowLeft,
  BookOpen,
  Users,
  Wind,
  Target,
  Star,
  Zap,
  DollarSign,
  Clock,
  MapPin,
  TrendingUp,
  Award,
  CheckCircle,
  PlayCircle,
  Download,
  Share2,
  Globe,
  Lightbulb,
  AlertTriangle
} from "lucide-react";

// Mock challenge data - would typically come from API
const challengeData = {
  'school-kenya': {
    id: 'school-kenya',
    title: '🏫 Power a Rural School in Kenya',
    shortDescription: 'Design a solar microgrid for 200 students. Balance cost with reliability for uninterrupted learning.',
    fullDescription: `The Kisumu Rural Education Initiative aims to electrify a primary school serving 200 students in rural Kenya. Currently, the school relies on kerosene lamps and candles after dark, limiting study hours and educational opportunities. 

Your challenge is to design a cost-effective solar microgrid that will power:
- 8 classrooms with LED lighting
- A computer lab with 20 desktop computers
- Administrative offices
- A small library with charging stations
- Outdoor security lighting

The system must be reliable, maintainable by local technicians, and designed to withstand the local climate conditions including dust storms and seasonal variations in solar irradiance.`,
    icon: <BookOpen className="w-6 h-6 text-energy-yellow" />,
    difficulty: 'Beginner',
    budget: 15000,
    duration: '2 weeks',
    category: 'Education',
    participants: 1247,
    completions: 892,
    rating: 4.8,
    location: 'Kisumu, Kenya',
    powerRequirement: '15-25 kW',
    coordinates: { lat: -0.1022, lng: 34.7617 },
    climate: 'Tropical savanna',
    objectives: [
      'Power lighting for 8 classrooms during evening study hours',
      'Support computer lab with 20 devices for digital literacy programs',
      'Ensure 95% uptime during school hours (6 AM - 10 PM)',
      'Stay within $15,000 budget including installation',
      'Design for 20-year lifespan with minimal maintenance',
      'Include battery backup for at least 4 hours of operation'
    ],
    constraints: [
      'Limited grid connectivity (unreliable rural grid)',
      'Dust and seasonal weather considerations',
      'Local technical expertise availability',
      'Transportation costs for remote location',
      'Need for theft-resistant installation'
    ],
    successMetrics: [
      'System availability > 95%',
      'Cost per kWh < $0.25',
      'Student engagement increase > 30%',
      'Evening study hours increase > 50%',
      'System maintenance < 2 hours/month'
    ],
    realWorldImpact: {
      studentsImpacted: 200,
      teachersImpacted: 12,
      co2Savings: '8 tons/year',
      economicBenefit: '$12,000/year in educational value'
    },
    resources: [
      {
        title: 'Kenya Solar Irradiance Data',
        type: 'Dataset',
        url: '#'
      },
      {
        title: 'Rural School Power Requirements',
        type: 'Technical Guide',
        url: '#'
      },
      {
        title: 'Local Installation Guidelines',
        type: 'Documentation',
        url: '#'
      }
    ],
    leaderboard: [
      {
        rank: 1,
        name: 'Sarah Chen',
        avatar: '/api/placeholder/32/32',
        score: 98,
        cost: 14200,
        efficiency: 94,
        sustainability: 100
      },
      {
        rank: 2,
        name: 'Miguel Rodriguez',
        avatar: '/api/placeholder/32/32',
        score: 96,
        cost: 13800,
        efficiency: 91,
        sustainability: 98
      },
      {
        rank: 3,
        name: 'Aisha Patel',
        avatar: '/api/placeholder/32/32',
        score: 95,
        cost: 14500,
        efficiency: 93,
        sustainability: 96
      }
    ]
  }
};

const ChallengeDetail = () => {
  const { challengeId } = useParams();
  const [activeTab, setActiveTab] = useState('overview');
  
  // Get challenge data (in real app, this would be fetched from API)
  const challenge = challengeData[challengeId as keyof typeof challengeData];
  
  if (!challenge) {
    return (
      <div className="min-h-screen bg-gradient-section flex items-center justify-center">
        <Card className="p-8 text-center">
          <CardContent>
            <AlertTriangle className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-2xl font-bold mb-2">Challenge Not Found</h2>
            <p className="text-muted-foreground mb-4">
              The challenge you're looking for doesn't exist or has been removed.
            </p>
            <Link to="/challenges">
              <Button variant="outline">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Challenges
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'Advanced': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-section">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <Link to="/challenges" className="flex items-center gap-2">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Challenges
                </Button>
              </Link>
              <div className="border-l border-border h-8" />
              <div className="flex items-center gap-3">
                <div className="p-2 bg-energy-yellow/20 rounded-lg">
                  {challenge.icon}
                </div>
                <div>
                  <h1 className="text-xl font-bold text-primary">{challenge.title}</h1>
                  <p className="text-sm text-muted-foreground">{challenge.location}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Resources
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Challenge Overview */}
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <Badge className={getDifficultyColor(challenge.difficulty)}>
                        {challenge.difficulty}
                      </Badge>
                      <Badge variant="outline">
                        <Star className="w-3 h-3 mr-1 text-yellow-500" />
                        {challenge.rating}
                      </Badge>
                      <Badge variant="outline">
                        <Users className="w-3 h-3 mr-1" />
                        {challenge.participants.toLocaleString()} participants
                      </Badge>
                    </div>
                    <CardTitle className="text-2xl">{challenge.title}</CardTitle>
                    <CardDescription className="text-base">
                      {challenge.shortDescription}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Challenge Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="objectives">Objectives</TabsTrigger>
                <TabsTrigger value="resources">Resources</TabsTrigger>
                <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Challenge Description</CardTitle>
                  </CardHeader>
                  <CardContent className="prose dark:prose-invert max-w-none">
                    <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                      {challenge.fullDescription}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Real-World Impact</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center p-4 bg-primary/5 rounded-lg">
                        <div className="text-2xl font-bold text-primary">{challenge.realWorldImpact.studentsImpacted}</div>
                        <div className="text-sm text-muted-foreground">Students Impacted</div>
                      </div>
                      <div className="text-center p-4 bg-green-50 dark:bg-green-950/20 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">{challenge.realWorldImpact.teachersImpacted}</div>
                        <div className="text-sm text-muted-foreground">Teachers Supported</div>
                      </div>
                      <div className="text-center p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">{challenge.realWorldImpact.co2Savings}</div>
                        <div className="text-sm text-muted-foreground">CO₂ Savings</div>
                      </div>
                      <div className="text-center p-4 bg-orange-50 dark:bg-orange-950/20 rounded-lg">
                        <div className="text-2xl font-bold text-orange-600">{challenge.realWorldImpact.economicBenefit}</div>
                        <div className="text-sm text-muted-foreground">Economic Value</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Design Constraints</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {challenge.constraints.map((constraint, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <AlertTriangle className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{constraint}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="objectives" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Challenge Objectives</CardTitle>
                    <CardDescription>
                      Complete all objectives to successfully solve this challenge
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {challenge.objectives.map((objective, index) => (
                        <div key={index} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                          <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{objective}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Success Metrics</CardTitle>
                    <CardDescription>
                      Your solution will be evaluated based on these criteria
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {challenge.successMetrics.map((metric, index) => (
                        <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                          <TrendingUp className="w-5 h-5 text-blue-600" />
                          <span className="text-sm">{metric}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="resources" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Challenge Resources</CardTitle>
                    <CardDescription>
                      Essential data and documentation for this challenge
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {challenge.resources.map((resource, index) => (
                        <Card key={index} className="border-l-4 border-l-primary">
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <Globe className="w-5 h-5 text-primary" />
                                <div>
                                  <h4 className="font-medium">{resource.title}</h4>
                                  <p className="text-sm text-muted-foreground">{resource.type}</p>
                                </div>
                              </div>
                              <Button variant="outline" size="sm">
                                <Download className="w-4 h-4 mr-2" />
                                Download
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Getting Started Tips</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                        <Lightbulb className="w-5 h-5 text-blue-600 mt-0.5" />
                        <span className="text-sm">Start by calculating the total power demand for all devices and lighting.</span>
                      </div>
                      <div className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                        <Lightbulb className="w-5 h-5 text-blue-600 mt-0.5" />
                        <span className="text-sm">Consider local solar irradiance patterns and seasonal variations in Kenya.</span>
                      </div>
                      <div className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                        <Lightbulb className="w-5 h-5 text-blue-600 mt-0.5" />
                        <span className="text-sm">Factor in battery storage for evening study hours when solar generation is zero.</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="leaderboard" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Top Performers</CardTitle>
                    <CardDescription>
                      See how other participants solved this challenge
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {challenge.leaderboard.map((entry, index) => (
                        <Card key={entry.rank} className={`border-l-4 ${
                          entry.rank === 1 ? 'border-l-yellow-500' :
                          entry.rank === 2 ? 'border-l-gray-400' :
                          entry.rank === 3 ? 'border-l-orange-500' : 'border-l-primary'
                        }`}>
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="flex items-center gap-2">
                                  {entry.rank <= 3 && (
                                    <Award className={`w-5 h-5 ${
                                      entry.rank === 1 ? 'text-yellow-500' :
                                      entry.rank === 2 ? 'text-gray-400' :
                                      'text-orange-500'
                                    }`} />
                                  )}
                                  <span className="font-bold text-lg">#{entry.rank}</span>
                                </div>
                                <Avatar className="w-8 h-8">
                                  <AvatarImage src={entry.avatar} />
                                  <AvatarFallback>{entry.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div>
                                  <h4 className="font-medium">{entry.name}</h4>
                                  <p className="text-sm text-muted-foreground">Score: {entry.score}/100</p>
                                </div>
                              </div>
                              <div className="text-right text-sm">
                                <div><span className="text-muted-foreground">Cost:</span> ${entry.cost.toLocaleString()}</div>
                                <div><span className="text-muted-foreground">Efficiency:</span> {entry.efficiency}%</div>
                                <div><span className="text-muted-foreground">Sustainability:</span> {entry.sustainability}%</div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Info */}
            <Card>
              <CardHeader>
                <CardTitle>Challenge Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-green-600" />
                    <div>
                      <div className="text-muted-foreground">Budget</div>
                      <div className="font-medium">${challenge.budget.toLocaleString()}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-blue-600" />
                    <div>
                      <div className="text-muted-foreground">Duration</div>
                      <div className="font-medium">{challenge.duration}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-yellow-600" />
                    <div>
                      <div className="text-muted-foreground">Power</div>
                      <div className="font-medium">{challenge.powerRequirement}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-red-600" />
                    <div>
                      <div className="text-muted-foreground">Location</div>
                      <div className="font-medium">{challenge.location}</div>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Completion Rate</span>
                    <span className="font-medium">
                      {Math.round((challenge.completions / challenge.participants) * 100)}%
                    </span>
                  </div>
                  <Progress 
                    value={(challenge.completions / challenge.participants) * 100} 
                    className="h-2"
                  />
                  <div className="text-xs text-muted-foreground mt-1">
                    {challenge.completions} of {challenge.participants} participants completed
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Call to Action */}
            <Card className="bg-gradient-hero text-white">
              <CardContent className="p-6 text-center">
                <PlayCircle className="w-12 h-12 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Ready to Start?</h3>
                <p className="text-sm opacity-90 mb-4">
                  Use our simulator to design your microgrid solution and compete for the top spot!
                </p>
                <Link to="/simulator">
                  <Button variant="hero" className="w-full bg-white text-primary hover:bg-gray-100">
                    <Zap className="mr-2 h-4 w-4" />
                    Launch Simulator
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Additional Info */}
            <Card>
              <CardHeader>
                <CardTitle>Challenge Category</CardTitle>
              </CardHeader>
              <CardContent>
                <Badge variant="secondary" className="mb-3">
                  {challenge.category}
                </Badge>
                <p className="text-sm text-muted-foreground">
                  This challenge focuses on educational infrastructure and sustainable development in rural communities.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChallengeDetail;