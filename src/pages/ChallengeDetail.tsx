import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AuthModal } from "@/components/AuthModal";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
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
  AlertTriangle,
  Navigation,
  MessageCircle,
  ArrowRight,
  User,
  Play
} from "lucide-react";

interface ChallengeStep {
  id: number;
  title: string;
  description: string;
  objective: string;
  hint?: string;
  completed: boolean;
  minPower?: number;
  maxBudget?: number;
  requiredComponents?: string[];
}

// Mock challenge data with interactive storylines
const challengeData = {
  'school-kenya': {
    id: 'school-kenya',
    title: '🏫 Power a Rural School in Kenya',
    shortDescription: 'Design a solar microgrid for 200 students. Balance cost with reliability for uninterrupted learning.',
    storyline: `You're working with the Kisumu Rural Education Initiative to bring electricity to a primary school serving 200 students in rural Kenya. The school's headmaster, Grace Wanjiku, has been fighting for years to get reliable electricity for her students.

"Every evening when the sun sets, our children must stop learning," Grace tells you during your site visit. "With proper lighting and computer access, we could run evening classes for adults too. This isn't just about education - it's about breaking the cycle of poverty in our community."

The nearest power grid is 15 kilometers away, making connection costs prohibitive. Diesel generators are expensive to run and often break down. Your solar microgrid solution could transform this school and become a model for hundreds of others across Kenya.`,
    
    fullDescription: `The Kisumu Rural Education Initiative aims to electrify a primary school serving 200 students in rural Kenya. Currently, the school relies on kerosene lamps and candles after dark, limiting study hours and educational opportunities.`,
    
    icon: <BookOpen className="w-6 h-6 text-energy-yellow" />,
    difficulty: 'Beginner',
    budget: 15000,
    duration: '2 weeks',
    category: 'Education',
    participants: 1247,
    completions: 892,
    rating: 4.8,
    tags: ['Solar', 'Education', 'Africa', 'Rural'],
    location: 'Kisumu, Kenya',
    powerRequirement: '15-25 kW',
    
    characters: [
      {
        name: "Grace Wanjiku",
        role: "School Headmaster",
        avatar: "👩🏾‍🏫",
        bio: "30 years of teaching experience, passionate about bringing technology to rural education"
      },
      {
        name: "David Ochieng",
        role: "Local Electrician", 
        avatar: "👨🏾‍🔧",
        bio: "Responsible for system maintenance, trained in basic solar installations"
      },
      {
        name: "Sarah Akinyi",
        role: "Parent Representative",
        avatar: "👩🏾‍💼", 
        bio: "Mother of three students, community organizer advocating for better education"
      }
    ],
    
    challenges: [
      "Seasonal dust storms that can reduce solar panel efficiency",
      "Limited local technical expertise for maintenance",
      "Need for system to work during cloudy rainy season (March-May)",
      "Must be vandal-resistant due to remote location",
      "Community buy-in and training requirements"
    ],
    
    steps: [
      {
        id: 1,
        title: "Site Assessment & Energy Audit",
        description: "Grace shows you around the school grounds. You need to understand the power requirements and available space for solar panels.",
        objective: "Calculate total energy needs: 8 classrooms (4 LED lights each), 1 computer lab (20 computers + projector), administrative office, and security lighting.",
        hint: "Each LED light uses 20W, computers use 200W each, projector uses 300W. Don't forget about charging stations for phones/tablets!",
        completed: false,
        minPower: 15,
        maxBudget: 15000
      },
      {
        id: 2,
        title: "Solar Panel Sizing",
        description: "David explains that the school gets about 5.5 peak sun hours daily. You need to size the solar array properly for year-round operation.",
        objective: "Design a solar array that can generate enough power even during the cloudiest months (40% reduction in solar output).",
        hint: "Kenya's rainy season reduces solar output significantly. Size for worst-case scenario to ensure reliability.",
        completed: false,
        requiredComponents: ['solar'],
        minPower: 20
      },
      {
        id: 3,
        title: "Battery Storage Design",
        description: "Sarah emphasizes the importance of evening classes for adult literacy. The system must provide power for at least 6 hours after sunset.",
        objective: "Size battery storage for 6 hours of evening operation with 20% safety margin. Consider battery lifespan in hot climate.",
        hint: "High temperatures reduce battery life. Consider ventilation and choose appropriate battery chemistry.",
        completed: false,
        requiredComponents: ['battery']
      },
      {
        id: 4,
        title: "Backup Power & Reliability",
        description: "Grace shares that the school occasionally hosts community meetings and emergency shelters. What happens during extended cloudy periods?",
        objective: "Ensure 95% uptime by adding appropriate backup power. Consider maintenance accessibility and fuel availability.",
        hint: "Small backup generator might be needed for extended cloudy periods. Diesel is available 30km away.",
        completed: false
      },
      {
        id: 5,
        title: "Installation & Training Plan",
        description: "David is eager to learn but needs proper training. The community wants to be self-sufficient for basic maintenance.",
        objective: "Create a sustainable maintenance plan and budget for training local technicians.",
        hint: "Factor in training costs, basic tools, and spare parts inventory. Community ownership is key to long-term success.",
        completed: false
      }
    ],
    
    mentorAdvice: [
      "Start conservative with your power estimates - it's easier to add panels later than to run out of power on the first day of school!",
      "Consider the social impact beyond just technical specs. This school could become a community hub with reliable electricity.",
      "Dust is your biggest enemy here. Factor in regular cleaning and dust-resistant equipment.",
      "Train multiple community members, not just one person. Knowledge redundancy prevents single points of failure."
    ],
    
    successMetrics: {
      technical: [
        "System provides 95% uptime during school hours",
        "Generates sufficient power for all planned loads",
        "Battery provides 6+ hours of evening operation",
        "System survives dust storms and weather"
      ],
      social: [
        "20+ computers operational in lab",
        "Evening adult literacy classes can operate",
        "Students can charge devices for homework",
        "Community meetings can happen after dark"
      ],
      economic: [
        "Total cost under $15,000",
        "Operating costs 80% lower than diesel",
        "Payback period under 5 years",
        "Local job creation for maintenance"
      ]
    }
  },
  
  'refugee-camp': {
    id: 'refugee-camp',
    title: '🏕️ Refugee Camp Emergency Power',
    shortDescription: 'Rapid deployment system for 5,000 people. Must work in extreme conditions with minimal maintenance.',
    storyline: `URGENT: A new refugee crisis on the Jordan-Syria border has created a camp housing 5,000 displaced people. Dr. Amira Hassan, the camp's medical director, desperately needs your help.

"We're operating on generator power that fails every few hours," Dr. Hassan tells you over a crackling satellite phone. "Last night we lost a patient because the dialysis machine shut down during a power outage. We have solar panels donated by various organizations, but no one knows how to connect them properly."

Time is critical. Winter is approaching, and the camp population is growing daily. Your microgrid design must be deployed within one week and work reliably in harsh desert conditions with minimal technical support.`,
    
    fullDescription: `Emergency response to rapidly growing refugee camp requiring immediate electrical infrastructure. Medical facilities, communication systems, and security lighting are critical priorities.`,
    
    icon: <Users className="w-6 h-6 text-energy-orange" />,
    difficulty: 'Intermediate',
    budget: 50000,
    duration: '1 week',
    category: 'Humanitarian',
    participants: 743,
    completions: 421,
    rating: 4.6,
    tags: ['Emergency', 'Scalable', 'Resilient', 'Humanitarian'],
    location: 'Jordan Border',
    powerRequirement: '100-150 kW',
    
    characters: [
      {
        name: "Dr. Amira Hassan",
        role: "Medical Director",
        avatar: "👩🏽‍⚕️",
        bio: "Emergency medicine specialist with 15 years experience in crisis zones"
      },
      {
        name: "Omar Al-Rashid", 
        role: "Camp Coordinator",
        avatar: "👨🏽‍💼",
        bio: "UNHCR logistics coordinator managing camp operations and growth planning"
      },
      {
        name: "Fatima Khoury",
        role: "Community Leader",
        avatar: "👩🏽‍🦳",
        bio: "Refugee community representative advocating for essential services"
      }
    ],
    
    challenges: [
      "Extreme temperature variations (-5°C to 50°C)",
      "Frequent sandstorms that damage equipment", 
      "No skilled technicians available on-site",
      "System must be expandable as camp grows",
      "Limited security - equipment theft is a concern",
      "Minimal maintenance infrastructure"
    ],
    
    steps: [
      {
        id: 1,
        title: "Emergency Assessment",
        description: "Dr. Hassan takes you through the medical tent. The critical loads must never lose power, even for a few minutes.",
        objective: "Identify and prioritize critical vs. non-critical loads. Medical equipment cannot have any power interruptions.",
        hint: "Critical: Medical equipment, communications, water pumps. Non-critical: General lighting, phone charging.",
        completed: false,
        minPower: 50
      },
      {
        id: 2,
        title: "Rapid Deployment Design", 
        description: "Omar explains that new families arrive daily. The system must be operational in 7 days and easily expandable.",
        objective: "Design a modular system that can be deployed quickly and expanded as camp grows from 5,000 to potentially 10,000 people.",
        hint: "Pre-assembled components and plug-and-play design will save precious time during installation.",
        completed: false,
        requiredComponents: ['solar', 'battery']
      },
      {
        id: 3,
        title: "Weather Resilience",
        description: "Fatima warns about the incoming sandstorm season. Equipment must survive harsh desert conditions with minimal protection.",
        objective: "Design for extreme weather: sandstorms, temperature swings, and high winds. All equipment must be weatherproof.",
        hint: "IP65-rated equipment, proper ventilation, and elevated mounting to avoid sand accumulation.",
        completed: false
      },
      {
        id: 4,
        title: "Security & Anti-Theft",
        description: "Omar shares concerns about equipment theft. Some families are desperate and might take valuable components to sell.",
        objective: "Implement security measures while maintaining accessibility for legitimate maintenance and expansion.",
        hint: "Secure mounting, lockable enclosures, and community involvement in protection are all important.",
        completed: false
      },
      {
        id: 5,
        title: "Training & Handover",
        description: "Dr. Hassan needs at least two people trained on basic troubleshooting since you can't stay permanently at the camp.",
        objective: "Create simple maintenance procedures and train local staff on basic system monitoring and troubleshooting.",
        hint: "Visual guides, simple tools, and remote monitoring capability will help manage the system long-term.",
        completed: false
      }
    ],
    
    mentorAdvice: [
      "In emergency situations, reliability trumps efficiency. Oversize everything and plan for component failures.",
      "Keep spare parts on-site - getting replacements to remote locations takes weeks during crises.",
      "Make everything as simple as possible. Complex systems fail when there's no technical support.",
      "Document everything clearly with pictures. People under stress need visual, simple instructions."
    ],
    
    successMetrics: {
      technical: [
        "99.9% uptime for critical medical equipment",
        "System operational within 7 days of arrival",
        "Survives 60+ km/h wind and sandstorms",
        "Expandable to double capacity without redesign"
      ],
      humanitarian: [
        "Medical tent has uninterrupted power 24/7",
        "Security lighting operational throughout camp", 
        "Communication systems remain functional",
        "Water pumps operate reliably"
      ],
      operational: [
        "Total deployment cost under $50,000",
        "System maintainable by local staff",
        "Components can be relocated if camp moves",
        "Minimal ongoing operational costs"
      ]
    }
  }

  // Add more challenge data as needed...
};

const ChallengeDetail = () => {
  const { challengeId } = useParams();
  const [currentStep, setCurrentStep] = useState(1);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [challengeSteps, setChallengeSteps] = useState<ChallengeStep[]>([]);
  const { user } = useAuth();
  const { toast } = useToast();

  const challenge = challengeId ? challengeData[challengeId as keyof typeof challengeData] : null;

  useEffect(() => {
    if (challenge) {
      setChallengeSteps(challenge.steps);
    }
  }, [challenge]);

  if (!challenge) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Challenge Not Found</h1>
          <p className="text-muted-foreground mb-4">The challenge you're looking for doesn't exist.</p>
          <Link to="/challenges">
            <Button>← Back to Challenges</Button>
          </Link>
        </div>
      </div>
    );
  }

  const completeStep = (stepId: number) => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    
    setChallengeSteps(prev => 
      prev.map(step => 
        step.id === stepId ? { ...step, completed: true } : step
      )
    );
    
    toast({
      title: "Step Completed!",
      description: `You've completed step ${stepId}. Moving to the next challenge.`,
    });

    // Auto advance to next step
    if (stepId < challengeSteps.length) {
      setCurrentStep(stepId + 1);
    }
  };

  const startChallenge = () => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    toast({
      title: "Challenge Started!",
      description: "Let's begin designing your microgrid solution.",
    });
  };

  const completedSteps = challengeSteps.filter(step => step.completed).length;
  const progressPercent = (completedSteps / challengeSteps.length) * 100;

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
              <Badge className={`
                ${challenge.difficulty === 'Beginner' ? 'bg-green-100 text-green-800' : 
                  challenge.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-800' : 
                  'bg-red-100 text-red-800'}
              `}>
                {challenge.difficulty}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-sm">
                <Star className="w-4 h-4 mr-1 text-yellow-500" />
                {challenge.rating}
              </Badge>
              <Badge variant="outline" className="text-sm">
                <Users className="w-4 h-4 mr-1" />
                {challenge.participants} participants
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Challenge Header */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-energy-green/20 rounded-xl">
                  {challenge.icon}
                </div>
                <div>
                  <h1 className="text-3xl font-bold">{challenge.title}</h1>
                  <p className="text-muted-foreground">{challenge.location}</p>
                </div>
              </div>
              
              {/* Progress */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Challenge Progress</span>
                  <span className="text-sm text-muted-foreground">
                    {completedSteps}/{challengeSteps.length} steps completed
                  </span>
                </div>
                <Progress value={progressPercent} className="h-3" />
              </div>

              {/* Start Challenge Button */}
              {completedSteps === 0 && (
                <Button 
                  onClick={startChallenge}
                  size="lg" 
                  className="mb-6"
                >
                  {user ? (
                    <>
                      <Play className="mr-2 h-5 w-5" />
                      Start Challenge
                    </>
                  ) : (
                    <>
                      <User className="mr-2 h-5 w-5" />
                      Sign In to Start
                    </>
                  )}
                </Button>
              )}
            </div>

            {/* Tabs */}
            <Tabs defaultValue="storyline" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="storyline">📖 Story</TabsTrigger>
                <TabsTrigger value="steps">🎯 Steps</TabsTrigger>
                <TabsTrigger value="characters">👥 People</TabsTrigger>
                <TabsTrigger value="solution">⚡ Solution</TabsTrigger>
              </TabsList>

              <TabsContent value="storyline" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MessageCircle className="w-5 h-5" />
                      The Challenge Begins
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="prose max-w-none">
                      <p className="text-lg leading-relaxed whitespace-pre-line">
                        {challenge.storyline}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5 text-orange-500" />
                      Key Challenges
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {challenge.challenges.map((item, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="steps" className="space-y-4">
                {challengeSteps.map((step, index) => (
                  <Card 
                    key={step.id}
                    className={`${
                      step.completed ? 'border-green-200 bg-green-50/50' :
                      currentStep === step.id ? 'border-primary bg-primary/5' :
                      'border-gray-200'
                    }`}
                  >
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                            step.completed ? 'bg-green-500 text-white' :
                            currentStep === step.id ? 'bg-primary text-white' :
                            'bg-gray-200 text-gray-600'
                          }`}>
                            {step.completed ? <CheckCircle className="w-4 h-4" /> : step.id}
                          </div>
                          <span className={step.completed ? 'line-through text-muted-foreground' : ''}>
                            Step {step.id}: {step.title}
                          </span>
                        </CardTitle>
                        {!step.completed && currentStep === step.id && (
                          <Badge variant="default">Current</Badge>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground mb-4">{step.description}</p>
                      <div className="bg-blue-50 p-4 rounded-lg mb-4">
                        <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                          <Target className="w-4 h-4" />
                          Objective
                        </h4>
                        <p className="text-blue-800">{step.objective}</p>
                      </div>
                      {step.hint && (
                        <div className="bg-yellow-50 p-4 rounded-lg mb-4">
                          <h4 className="font-semibold text-yellow-900 mb-2 flex items-center gap-2">
                            <Lightbulb className="w-4 h-4" />
                            Hint
                          </h4>
                          <p className="text-yellow-800">{step.hint}</p>
                        </div>
                      )}
                      {!step.completed && currentStep === step.id && (
                        <div className="flex gap-2">
                          <Button 
                            onClick={() => completeStep(step.id)}
                            className="flex-1"
                          >
                            {user ? 'Complete Step' : 'Sign In to Continue'}
                          </Button>
                          <Button variant="outline">
                            <Navigation className="w-4 h-4 mr-2" />
                            Open Simulator
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="characters" className="space-y-4">
                {challenge.characters.map((character, index) => (
                  <Card key={index}>
                    <CardContent className="pt-6">
                      <div className="flex items-start gap-4">
                        <div className="text-4xl">{character.avatar}</div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg">{character.name}</h3>
                          <p className="text-primary font-medium mb-2">{character.role}</p>
                          <p className="text-muted-foreground">{character.bio}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="solution" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Award className="w-5 h-5 text-yellow-500" />
                      Success Metrics
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-3 gap-6">
                      <div>
                        <h4 className="font-semibold mb-3 text-blue-600">Technical Goals</h4>
                        <ul className="space-y-2">
                          {challenge.successMetrics.technical.map((metric, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                              <span className="text-sm">{metric}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-3 text-green-600">
                          {(challenge.successMetrics as any).social ? 'Social Impact' : 'Humanitarian Impact'}
                        </h4>
                        <ul className="space-y-2">
                          {((challenge.successMetrics as any).social || (challenge.successMetrics as any).humanitarian || []).map((metric: string, index: number) => (
                            <li key={index} className="flex items-start gap-2">
                              <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                              <span className="text-sm">{metric}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-3 text-orange-600">
                          {(challenge.successMetrics as any).economic ? 'Economic Impact' : 'Operational Goals'}
                        </h4>
                        <ul className="space-y-2">
                          {((challenge.successMetrics as any).economic || (challenge.successMetrics as any).operational || []).map((metric: string, index: number) => (
                            <li key={index} className="flex items-start gap-2">
                              <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                              <span className="text-sm">{metric}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Lightbulb className="w-5 h-5 text-yellow-500" />
                      Mentor Advice
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {challenge.mentorAdvice.map((advice, index) => (
                        <div key={index} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                          <p className="text-blue-900">{advice}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Challenge Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Budget</span>
                  <span className="font-semibold">${challenge.budget.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Timeline</span>
                  <span className="font-semibold">{challenge.duration}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Power Need</span>
                  <span className="font-semibold">{challenge.powerRequirement}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Category</span>
                  <Badge variant="secondary">{challenge.category}</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Tags */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Technologies</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {challenge.tags.map((tag) => (
                    <Badge key={tag} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full" onClick={() => user ? null : setShowAuthModal(true)}>
                  <Download className="w-4 h-4 mr-2" />
                  Download Resources
                </Button>
                <Button variant="outline" className="w-full" onClick={() => user ? null : setShowAuthModal(true)}>
                  <Share2 className="w-4 h-4 mr-2" />
                  Share Challenge
                </Button>
                <Link to="/simulator">
                  <Button className="w-full">
                    <Zap className="w-4 h-4 mr-2" />
                    Open Simulator
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onAuthSuccess={() => setShowAuthModal(false)}
      />
    </div>
  );
};

export default ChallengeDetail;