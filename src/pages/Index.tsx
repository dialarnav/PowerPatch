import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Zap, Sun, Wind, Battery, Globe, Users, Target, BookOpen, Award, ArrowRight, Play, TrendingUp } from "lucide-react";
import heroImage from "@/assets/hero-energy.jpg";
import solarIcon from "@/assets/solar-icon.png";
import windIcon from "@/assets/wind-icon.png";
import batteryIcon from "@/assets/battery-icon.png";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-section">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-transparent"></div>
        </div>
        
        <div className="relative z-10 text-center max-w-6xl mx-auto">
          <Badge className="mb-6 bg-white/20 text-white border-white/30" variant="outline">
            🌍 Powering 770 Million Dreams
          </Badge>
          
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            Build Your Own <span className="bg-gradient-accent bg-clip-text text-transparent">Microgrid</span>.
            <br />Change the World.
          </h1>
          
          <p className="text-xl sm:text-2xl text-gray-200 mb-8 max-w-4xl mx-auto leading-relaxed">
            PowerPatch lets anyone design clean, resilient energy systems — no experience needed. 
            Learn, simulate, and share custom microgrids that bring light to communities and hope to the planet.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button variant="hero" size="lg" className="text-lg px-8 py-4">
              <Play className="mr-2 h-5 w-5" />
              Launch Simulator
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8 py-4 bg-white/10 text-white border-white/30 hover:bg-white/20">
              <BookOpen className="mr-2 h-5 w-5" />
              Learn How It Works
            </Button>
          </div>
          
          <div className="mt-12 grid grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-white">770M+</div>
              <div className="text-sm text-gray-300">People without power</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white">24/7</div>
              <div className="text-sm text-gray-300">Clean energy access</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white">∞</div>
              <div className="text-sm text-gray-300">Possibilities</div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="mb-4" variant="outline">
              🔧 How PowerPatch Works
            </Badge>
            <h2 className="text-4xl sm:text-5xl font-bold mb-6">
              Design. Simulate. <span className="text-primary">Impact.</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Transform your ideas into real-world energy solutions through our intuitive platform
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="relative overflow-hidden group hover:shadow-card transition-all duration-300">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto mb-4 p-4 bg-gradient-hero rounded-full w-20 h-20 flex items-center justify-center">
                  <img src={solarIcon} alt="Solar" className="w-10 h-10" />
                </div>
                <CardTitle className="text-xl">Design Your Microgrid</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center text-base leading-relaxed">
                  Drag and drop components like solar panels, wind turbines, batteries, and backup generators. 
                  Create a setup that powers homes, schools, or even entire villages.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden group hover:shadow-card transition-all duration-300">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto mb-4 p-4 bg-gradient-hero rounded-full w-20 h-20 flex items-center justify-center">
                  <TrendingUp className="w-10 h-10 text-white" />
                </div>
                <CardTitle className="text-xl">Simulate & Optimize</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center text-base leading-relaxed">
                  See how your system performs using real-world data. Get instant feedback on cost, emissions, 
                  and uptime. Learn how different setups affect power reliability and sustainability.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden group hover:shadow-card transition-all duration-300">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto mb-4 p-4 bg-gradient-hero rounded-full w-20 h-20 flex items-center justify-center">
                  <Users className="w-10 h-10 text-white" />
                </div>
                <CardTitle className="text-xl">Share Your Solution</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center text-base leading-relaxed">
                  Export your microgrid plan as a visual report. Share with others, inspire action, 
                  or submit your grid to real-world NGOs or energy challenges.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Why It Matters Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-section">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="mb-4" variant="outline">
                🌍 770 Million Reasons to Act
              </Badge>
              <h2 className="text-4xl sm:text-5xl font-bold mb-6">
                Every Connection <span className="text-primary">Matters</span>
              </h2>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                Over 770 million people live without access to electricity. Without power, children can't study at night. 
                Hospitals can't store vaccines. Communities are left behind.
              </p>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                PowerPatch was built to educate, empower, and energize. By turning microgrid design into an interactive 
                experience, we help youth learn systems thinking — and communities plan real solutions.
              </p>
              
              <div className="grid grid-cols-2 gap-6 mb-8">
                <div className="text-center p-4 bg-card rounded-lg border">
                  <Target className="w-8 h-8 text-primary mx-auto mb-2" />
                  <div className="font-semibold">SDG 7</div>
                  <div className="text-sm text-muted-foreground">Clean Energy</div>
                </div>
                <div className="text-center p-4 bg-card rounded-lg border">
                  <Globe className="w-8 h-8 text-primary mx-auto mb-2" />
                  <div className="font-semibold">SDG 13</div>
                  <div className="text-sm text-muted-foreground">Climate Action</div>
                </div>
                <div className="text-center p-4 bg-card rounded-lg border">
                  <BookOpen className="w-8 h-8 text-primary mx-auto mb-2" />
                  <div className="font-semibold">SDG 4</div>
                  <div className="text-sm text-muted-foreground">Quality Education</div>
                </div>
                <div className="text-center p-4 bg-card rounded-lg border">
                  <Users className="w-8 h-8 text-primary mx-auto mb-2" />
                  <div className="font-semibold">SDG 11</div>
                  <div className="text-sm text-muted-foreground">Sustainable Communities</div>
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              <Card className="p-6 hover:shadow-card transition-all duration-300">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-energy-yellow/20 rounded-lg">
                    <Sun className="w-6 h-6 text-energy-yellow" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Rural Education</h3>
                    <p className="text-sm text-muted-foreground">
                      Students can study after dark, access digital resources, and connect with global learning opportunities.
                    </p>
                  </div>
                </div>
              </Card>
              
              <Card className="p-6 hover:shadow-card transition-all duration-300">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-energy-blue/20 rounded-lg">
                    <Zap className="w-6 h-6 text-energy-blue" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Healthcare Access</h3>
                    <p className="text-sm text-muted-foreground">
                      Reliable power for vaccine storage, medical equipment, and emergency lighting saves lives.
                    </p>
                  </div>
                </div>
              </Card>
              
              <Card className="p-6 hover:shadow-card transition-all duration-300">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-energy-green/20 rounded-lg">
                    <Wind className="w-6 h-6 text-energy-green" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Economic Growth</h3>
                    <p className="text-sm text-muted-foreground">
                      Small businesses thrive with reliable power, creating jobs and building resilient local economies.
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Real-World Challenges Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="mb-4" variant="outline">
              ⚡ Real-World Challenges
            </Badge>
            <h2 className="text-4xl sm:text-5xl font-bold mb-6">
              Can You Power a School? A Village? <span className="text-primary">A Refugee Camp?</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Test your microgrid against real-world scenarios from around the world. Each challenge teaches you 
              trade-offs between cost, resilience, and environmental impact.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <Card className="relative overflow-hidden group hover:shadow-card transition-all duration-300 cursor-pointer">
              <CardHeader>
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-energy-yellow/20 rounded-lg">
                    <BookOpen className="w-6 h-6 text-energy-yellow" />
                  </div>
                  <Badge variant="secondary">Beginner</Badge>
                </div>
                <CardTitle>🏫 Power a Rural School in Kenya</CardTitle>
                <CardDescription>
                  Design a solar microgrid for 200 students. Balance cost with reliability for uninterrupted learning.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between text-sm text-muted-foreground mb-4">
                  <span>Budget: $15,000</span>
                  <span>Duration: 2 weeks</span>
                </div>
                <Button variant="energy" className="w-full">
                  Accept Challenge
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden group hover:shadow-card transition-all duration-300 cursor-pointer">
              <CardHeader>
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-energy-orange/20 rounded-lg">
                    <Users className="w-6 h-6 text-energy-orange" />
                  </div>
                  <Badge variant="secondary">Intermediate</Badge>
                </div>
                <CardTitle>🏕️ Refugee Camp Emergency Power</CardTitle>
                <CardDescription>
                  Rapid deployment system for 5,000 people. Must work in extreme conditions with minimal maintenance.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between text-sm text-muted-foreground mb-4">
                  <span>Budget: $50,000</span>
                  <span>Duration: 1 week</span>
                </div>
                <Button variant="energy" className="w-full">
                  Accept Challenge
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden group hover:shadow-card transition-all duration-300 cursor-pointer">
              <CardHeader>
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-energy-green/20 rounded-lg">
                    <Wind className="w-6 h-6 text-energy-green" />
                  </div>
                  <Badge variant="secondary">Advanced</Badge>
                </div>
                <CardTitle>🏠 Off-Grid Eco Community</CardTitle>
                <CardDescription>
                  100% renewable microgrid for 50 families. Zero emissions, maximum resilience, smart grid integration.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between text-sm text-muted-foreground mb-4">
                  <span>Budget: $200,000</span>
                  <span>Duration: 1 month</span>
                </div>
                <Button variant="energy" className="w-full">
                  Accept Challenge
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="text-center">
            <p className="text-lg text-muted-foreground mb-6">
              🎖️ Earn badges, compete with others, and climb the leaderboard as a microgrid innovator.
            </p>
            <Button variant="outline" size="lg">
              <Award className="mr-2 h-5 w-5" />
              View All Challenges
            </Button>
          </div>
        </div>
      </section>

      {/* Join the Movement Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-hero">
        <div className="max-w-4xl mx-auto text-center">
          <Badge className="mb-6 bg-white/20 text-white border-white/30" variant="outline">
            👥 Join the PowerPatch Community
          </Badge>
          
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            Join the <span className="text-accent">Energy Revolution</span>
          </h2>
          
          <p className="text-xl text-gray-200 mb-8 max-w-3xl mx-auto leading-relaxed">
            We're building a global network of students, teachers, engineers, and changemakers who believe in 
            decentralizing energy — and democratizing the knowledge to do it.
          </p>
          
          <p className="text-lg text-gray-300 mb-10">
            Whether you're a student, educator, NGO, or just someone with a bold idea — you can be part of this energy revolution.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button variant="hero" size="lg" className="bg-white text-primary hover:bg-gray-100">
              ✨ Get Early Access
            </Button>
            <Button variant="outline" size="lg" className="bg-white/10 text-white border-white/30 hover:bg-white/20">
              🤝 Partner With Us
            </Button>
          </div>
          
          <div className="max-w-md mx-auto">
            <p className="text-white mb-4">📬 Subscribe for Updates</p>
            <div className="flex gap-2">
              <Input 
                type="email" 
                placeholder="Enter your email" 
                className="bg-white/10 border-white/30 text-white placeholder:text-gray-300"
              />
              <Button variant="hero" className="bg-white text-primary hover:bg-gray-100">
                Subscribe
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 bg-card border-t">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-center md:text-left">
              <h3 className="text-2xl font-bold text-primary mb-2">PowerPatch</h3>
              <p className="text-muted-foreground">Where energy meets imagination</p>
            </div>
            
            <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
              <a href="#" className="hover:text-primary transition-colors">About</a>
              <a href="#" className="hover:text-primary transition-colors">Blog</a>
              <a href="#" className="hover:text-primary transition-colors">Contact</a>
              <a href="#" className="hover:text-primary transition-colors">Privacy</a>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
            <p>Built with ❤️ for the Moonshot Pirates by Arnav Sharma</p>
            <p className="mt-2">© 2025 PowerPatch. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;