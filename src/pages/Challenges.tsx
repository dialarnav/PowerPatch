import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { AuthModal } from "@/components/AuthModal";
import { useAuth } from "@/hooks/useAuth";
import { 
  BookOpen, 
  Users, 
  Wind, 
  Home, 
  Search, 
  Filter,
  Clock,
  DollarSign,
  Target,
  ArrowRight,
  Award,
  Star,
  Trophy,
  Zap,
  User
} from "lucide-react";
import { Link } from "react-router-dom";

interface Challenge {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  budget: number;
  duration: string;
  category: string;
  participants: number;
  completions: number;
  rating: number;
  tags: string[];
  objectives: string[];
  location: string;
  powerRequirement: string;
}

const challenges: Challenge[] = [
  {
    id: 'school-kenya',
    title: '🏫 Power a Rural School in Kenya',
    description: 'Design a solar microgrid for 200 students. Balance cost with reliability for uninterrupted learning.',
    icon: <BookOpen className="w-6 h-6 text-energy-yellow" />,
    difficulty: 'Beginner',
    budget: 15000,
    duration: '2 weeks',
    category: 'Education',
    participants: 1247,
    completions: 892,
    rating: 4.8,
    tags: ['Solar', 'Education', 'Africa', 'Rural'],
    objectives: [
      'Power lighting for 8 classrooms',
      'Support computer lab with 20 devices',
      'Ensure 95% uptime during school hours',
      'Stay within $15,000 budget'
    ],
    location: 'Kisumu, Kenya',
    powerRequirement: '15-25 kW'
  },
  {
    id: 'refugee-camp',
    title: '🏕️ Refugee Camp Emergency Power',
    description: 'Rapid deployment system for 5,000 people. Must work in extreme conditions with minimal maintenance.',
    icon: <Users className="w-6 h-6 text-energy-orange" />,
    difficulty: 'Intermediate',
    budget: 50000,
    duration: '1 week',
    category: 'Humanitarian',
    participants: 743,
    completions: 421,
    rating: 4.6,
    tags: ['Emergency', 'Scalable', 'Resilient', 'Humanitarian'],
    objectives: [
      'Power medical facilities 24/7',
      'Provide lighting for safety and security',
      'Support communication systems',
      'Ensure rapid deployment capability'
    ],
    location: 'Jordan Border',
    powerRequirement: '100-150 kW'
  },
  {
    id: 'eco-community',
    title: '🏠 Off-Grid Eco Community',
    description: '100% renewable microgrid for 50 families. Zero emissions, maximum resilience, smart grid integration.',
    icon: <Wind className="w-6 h-6 text-energy-green" />,
    difficulty: 'Advanced',
    budget: 200000,
    duration: '1 month',
    category: 'Sustainability',
    participants: 298,
    completions: 87,
    rating: 4.9,
    tags: ['Renewable', 'Smart Grid', 'Zero Carbon', 'Community'],
    objectives: [
      'Achieve 100% renewable energy',
      'Implement smart grid technology',
      'Design for climate resilience',
      'Create scalable model for replication'
    ],
    location: 'Costa Rica',
    powerRequirement: '200-300 kW'
  },
  {
    id: 'island-resort',
    title: '🏝️ Sustainable Island Resort',
    description: 'Replace diesel generators with clean energy for a tropical resort. Tourism meets sustainability.',
    icon: <Zap className="w-6 h-6 text-energy-blue" />,
    difficulty: 'Intermediate',
    budget: 75000,
    duration: '3 weeks',
    category: 'Tourism',
    participants: 567,
    completions: 234,
    rating: 4.7,
    tags: ['Tourism', 'Island', 'Diesel Replacement', 'Tropical'],
    objectives: [
      'Replace 3 diesel generators',
      'Power 40 guest rooms and facilities',
      'Reduce operating costs by 60%',
      'Achieve carbon neutrality'
    ],
    location: 'Maldives',
    powerRequirement: '80-120 kW'
  },
  {
    id: 'farming-cooperative',
    title: '🌾 Agricultural Cooperative Power',
    description: 'Electrify farming operations including irrigation, processing, and cold storage for 100 farmers.',
    icon: <Target className="w-6 h-6 text-energy-green" />,
    difficulty: 'Advanced',
    budget: 120000,
    duration: '6 weeks',
    category: 'Agriculture',
    participants: 432,
    completions: 156,
    rating: 4.5,
    tags: ['Agriculture', 'Irrigation', 'Food Security', 'Cooperative'],
    objectives: [
      'Power irrigation systems for 500 acres',
      'Support grain processing facility',
      'Enable cold storage for produce',
      'Create reliable income stream'
    ],
    location: 'Maharashtra, India',
    powerRequirement: '150-200 kW'
  },
  {
    id: 'arctic-research',
    title: '🏔️ Arctic Research Station',
    description: 'Extreme weather microgrid for year-round research operations. Must function in -40°C temperatures.',
    icon: <Star className="w-6 h-6 text-energy-blue" />,
    difficulty: 'Advanced',
    budget: 300000,
    duration: '2 months',
    category: 'Research',
    participants: 89,
    completions: 23,
    rating: 5.0,
    tags: ['Extreme Weather', 'Research', 'Arctic', 'Resilient'],
    objectives: [
      'Operate in temperatures down to -40°C',
      'Power research equipment 24/7',
      'Ensure communications connectivity',
      'Plan for 6-month supply deliveries'
    ],
    location: 'Svalbard, Norway',
    powerRequirement: '50-75 kW'
  }
];

const Challenges = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { user } = useAuth();

  const difficulties = ['All', 'Beginner', 'Intermediate', 'Advanced'];
  const categories = ['All', 'Education', 'Humanitarian', 'Sustainability', 'Tourism', 'Agriculture', 'Research'];

  const filteredChallenges = challenges.filter(challenge => {
    const matchesSearch = challenge.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         challenge.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         challenge.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesDifficulty = selectedDifficulty === 'All' || challenge.difficulty === selectedDifficulty;
    const matchesCategory = selectedCategory === 'All' || challenge.category === selectedCategory;
    
    return matchesSearch && matchesDifficulty && matchesCategory;
  });

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
              <Link to="/" className="flex items-center gap-2">
                <Button variant="ghost" size="sm">
                  <Home className="w-4 h-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
              <div className="border-l border-border h-8" />
              <h1 className="text-2xl font-bold text-primary">Microgrid Challenges</h1>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-sm">
                <Trophy className="w-4 h-4 mr-1" />
                {challenges.reduce((sum, c) => sum + c.completions, 0)} Completed
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <Badge className="mb-4" variant="outline">
            ⚡ Real-World Energy Challenges
          </Badge>
          <h2 className="text-4xl sm:text-5xl font-bold mb-6">
            Test Your <span className="text-primary">Microgrid Skills</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Solve real-world energy challenges from around the globe. Each challenge teaches you the complexities 
            of designing resilient, sustainable, and cost-effective energy systems.
          </p>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 max-w-4xl mx-auto mb-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">{challenges.length}</div>
              <div className="text-sm text-muted-foreground">Active Challenges</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">
                {challenges.reduce((sum, c) => sum + c.participants, 0).toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground">Global Participants</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">
                ${challenges.reduce((sum, c) => sum + c.budget, 0).toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground">Total Project Value</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600">15+</div>
              <div className="text-sm text-muted-foreground">Countries Impacted</div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      placeholder="Search challenges, locations, or technologies..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-muted-foreground" />
                    <select 
                      value={selectedDifficulty}
                      onChange={(e) => setSelectedDifficulty(e.target.value)}
                      className="px-3 py-2 border border-input rounded-md bg-background text-sm"
                    >
                      {difficulties.map(diff => (
                        <option key={diff} value={diff}>{diff}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <select 
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="px-3 py-2 border border-input rounded-md bg-background text-sm"
                    >
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Challenges Grid */}
        <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredChallenges.map((challenge) => (
            <Card 
              key={challenge.id} 
              className="group hover:shadow-card transition-all duration-300 cursor-pointer relative overflow-hidden"
            >
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="p-2 bg-energy-green/20 rounded-lg">
                    {challenge.icon}
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <Badge className={getDifficultyColor(challenge.difficulty)}>
                      {challenge.difficulty}
                    </Badge>
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 text-yellow-500 fill-current" />
                      <span className="text-xs font-medium">{challenge.rating}</span>
                    </div>
                  </div>
                </div>
                <CardTitle className="text-lg leading-tight">{challenge.title}</CardTitle>
                <CardDescription className="text-sm leading-relaxed">
                  {challenge.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Key Metrics */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-green-600" />
                    <span className="text-muted-foreground">Budget:</span>
                    <span className="font-medium">${challenge.budget.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-blue-600" />
                    <span className="text-muted-foreground">Duration:</span>
                    <span className="font-medium">{challenge.duration}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-yellow-600" />
                    <span className="text-muted-foreground">Power:</span>
                    <span className="font-medium">{challenge.powerRequirement}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-purple-600" />
                    <span className="text-muted-foreground">Participants:</span>
                    <span className="font-medium">{challenge.participants}</span>
                  </div>
                </div>

                {/* Location */}
                <div className="text-sm">
                  <span className="text-muted-foreground">Location: </span>
                  <span className="font-medium">{challenge.location}</span>
                </div>

                {/* Progress */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Completion Rate</span>
                    <span className="font-medium">
                      {Math.round((challenge.completions / challenge.participants) * 100)}%
                    </span>
                  </div>
                  <Progress 
                    value={(challenge.completions / challenge.participants) * 100} 
                    className="h-2"
                  />
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1">
                  {challenge.tags.slice(0, 3).map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {challenge.tags.length > 3 && (
                    <Badge variant="secondary" className="text-xs">
                      +{challenge.tags.length - 3}
                    </Badge>
                  )}
                </div>

                {/* CTA */}
                {user ? (
                  <Link to={`/challenge/${challenge.id}`}>
                    <Button variant="energy" className="w-full group-hover:shadow-glow transition-all duration-300">
                      Accept Challenge
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                ) : (
                  <Button 
                    variant="energy" 
                    className="w-full group-hover:shadow-glow transition-all duration-300"
                    onClick={() => setShowAuthModal(true)}
                  >
                    <User className="mr-2 h-4 w-4" />
                    Sign In to Accept Challenge
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* No Results */}
        {filteredChallenges.length === 0 && (
          <div className="text-center py-12">
            <Search className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
            <p className="text-lg text-muted-foreground mb-2">No challenges found</p>
            <p className="text-sm text-muted-foreground">Try adjusting your search terms or filters</p>
          </div>
        )}

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <Card className="p-8 bg-gradient-hero text-white">
            <CardContent>
              <Award className="w-12 h-12 mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-4">Ready to Make an Impact?</h3>
              <p className="text-lg mb-6 opacity-90">
                Join thousands of innovators solving real-world energy challenges. 
                Every microgrid you design brings us closer to universal energy access.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/simulator">
                  <Button variant="hero" size="lg" className="bg-white text-primary hover:bg-gray-100">
                    <Zap className="mr-2 h-5 w-5" />
                    Launch Simulator
                  </Button>
                </Link>
                <Link to="/">
                  <Button variant="outline" size="lg" className="bg-white/10 text-white border-white/30 hover:bg-white/20">
                    Learn More
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
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

export default Challenges;