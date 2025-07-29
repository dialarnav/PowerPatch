import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Zap, Leaf, DollarSign, Shield, Home, Brain, Users, Trophy, Menu, BookOpen, Wind } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { AuthModal } from "@/components/AuthModal";
import { AddressScanModal } from "@/components/AddressScanModal";
import { useAuth } from "@/hooks/useAuth";
import { PartnerModalWrapper } from "@/components/PartnerModalWrapper";
import { EarlyAccessModalWrapper } from "@/components/EarlyAccessModalWrapper";
import { supabase } from "@/integrations/supabase/client";
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from "@/components/ui/navigation-menu";
const Index = () => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showAddressScan, setShowAddressScan] = useState(false);
  const [showPartnerModal, setShowPartnerModal] = useState(false);
  const [showEarlyAccessModal, setShowEarlyAccessModal] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const {
    user
  } = useAuth();
  const handleGetStarted = () => {
    if (user) {
      setShowAddressScan(true);
    } else {
      setShowAuthModal(true);
    }
  };
  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };
  return <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Navigation */}
      <nav className="bg-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Zap className="h-8 w-8 text-green-600 mr-2" />
              <span className="text-xl font-bold text-gray-900">PowerPatch
            </span>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              <NavigationMenu>
                <NavigationMenuList>
                  <NavigationMenuItem>
                    <NavigationMenuTrigger>Solutions</NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <div className="grid gap-3 p-6 md:w-[400px] lg:w-[500px]">
                        <div className="grid grid-cols-2 gap-4">
                          <NavigationMenuLink asChild>
                            <Link to="/simulator" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                              <div className="text-sm font-medium leading-none">Energy Simulator</div>
                              <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                                Design your microgrid system
                              </p>
                            </Link>
                          </NavigationMenuLink>
                          <NavigationMenuLink asChild>
                            <Link to="/challenges" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                              <div className="text-sm font-medium leading-none">Challenges</div>
                              <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                                Interactive scenarios
                              </p>
                            </Link>
                          </NavigationMenuLink>
                        </div>
                      </div>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>
              
              <Button onClick={handleGetStarted} className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2 shadow-md">
                <Brain className="h-4 w-4" />
                AI House Scan
              </Button>
              
              {user ? <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-700">
                    Welcome, {user.email}
                  </span>
                  <Button variant="outline" onClick={handleSignOut} className="text-sm">
                    Sign Out
                  </Button>
                </div> : <Button variant="outline" onClick={() => setShowAuthModal(true)} className="text-green-600 border-green-600 hover:bg-green-50">
                  Sign In
                </Button>}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                <Menu className="h-6 w-6" />
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && <div className="md:hidden bg-white border-t">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link to="/simulator" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-green-600 hover:bg-gray-50" onClick={() => setMobileMenuOpen(false)}>
                Energy Simulator
              </Link>
              <Link to="/challenges" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-green-600 hover:bg-gray-50" onClick={() => setMobileMenuOpen(false)}>
                Challenges
              </Link>
              <Button variant="ghost" onClick={() => {
            setShowPartnerModal(true);
            setMobileMenuOpen(false);
          }} className="w-full justify-start text-gray-700 hover:text-green-600">
                Partners
              </Button>
              <Button variant="ghost" onClick={() => {
            setShowEarlyAccessModal(true);
            setMobileMenuOpen(false);
          }} className="w-full justify-start text-gray-700 hover:text-green-600">
                Early Access
              </Button>
              <Button onClick={() => {
            handleGetStarted();
            setMobileMenuOpen(false);
          }} className="w-full bg-green-600 hover:bg-green-700 text-white flex items-center gap-2 shadow-md">
                <Brain className="h-4 w-4" />
                AI House Scan
              </Button>
              {user ? <div className="px-3 py-2 border-t">
                  <p className="text-sm text-gray-700 mb-2">
                    Welcome, {user.email}
                  </p>
                  <Button variant="outline" onClick={handleSignOut} className="w-full">
                    Sign Out
                  </Button>
                </div> : <Button variant="outline" onClick={() => {
            setShowAuthModal(true);
            setMobileMenuOpen(false);
          }} className="w-full text-green-600 border-green-600 hover:bg-green-50">
                  Sign In
                </Button>}
            </div>
          </div>}
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Power Your Future with{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-blue-600">
                Smart Energy
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Design, simulate, and optimize your microgrid system with AI-powered insights
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="outline" size="lg" asChild className="text-lg px-8 py-3">
                <Link to="/simulator">Try Simulator</Link>
              </Button>
              <Button variant="hero" size="lg" onClick={handleGetStarted} className="text-lg px-8 py-3">
                <Brain className="mr-2 h-5 w-5" />
                Get AI House Scan
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose EnergyFlow?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Advanced tools and AI-powered insights to help you make the best energy decisions
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Brain className="h-10 w-10 text-green-600 mb-2" />
                <CardTitle>AI-Powered Analysis</CardTitle>
                <CardDescription>
                  Get intelligent recommendations based on your specific location and energy needs
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Zap className="h-10 w-10 text-blue-600 mb-2" />
                <CardTitle>Energy Simulation</CardTitle>
                <CardDescription>
                  Model different scenarios and see real-time impact on your energy costs
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <DollarSign className="h-10 w-10 text-green-600 mb-2" />
                <CardTitle>Cost Optimization</CardTitle>
                <CardDescription>
                  Maximize savings with intelligent energy management and storage solutions
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Leaf className="h-10 w-10 text-green-600 mb-2" />
                <CardTitle>Sustainability Focus</CardTitle>
                <CardDescription>
                  Reduce your carbon footprint with renewable energy integration
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Shield className="h-10 w-10 text-blue-600 mb-2" />
                <CardTitle>Energy Independence</CardTitle>
                <CardDescription>
                  Achieve grid independence with backup power and energy storage
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Users className="h-10 w-10 text-purple-600 mb-2" />
                <CardTitle>Community Sharing</CardTitle>
                <CardDescription>
                  Connect with neighbors to share energy resources and knowledge
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-green-600 to-blue-600">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 text-center text-white">
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">50%</div>
              <div className="text-xl">Average Cost Reduction</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">10k+</div>
              <div className="text-xl">Homes Optimized</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">24/7</div>
              <div className="text-xl">Energy Monitoring</div>
            </div>
          </div>
        </div>
      </section>

      {/* Challenges Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-green-50 to-blue-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Take on Real-World <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-blue-600">Energy Challenges</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
              Test your skills with scenarios from around the globe. Each challenge teaches you the complexities of designing sustainable energy systems.
            </p>
          </div>
          
          <div className="relative">
            {/* Challenge Cards Slider */}
            <div className="flex gap-6 overflow-x-auto scrollbar-hide pb-4 snap-x snap-mandatory">
              {/* School Kenya Challenge */}
              <Card className="min-w-[320px] md:min-w-[380px] hover:shadow-lg transition-all duration-300 cursor-pointer snap-start group">
                <CardHeader>
                  <div className="flex items-start justify-between mb-3">
                    <div className="p-2 bg-yellow-100 rounded-lg">
                      <BookOpen className="w-6 h-6 text-yellow-600" />
                    </div>
                    <Badge className="bg-green-100 text-green-800">Beginner</Badge>
                  </div>
                  <CardTitle className="text-lg">🏫 Power a Rural School in Kenya</CardTitle>
                  <CardDescription>
                    Design a solar microgrid for 200 students. Balance cost with reliability for uninterrupted learning.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-green-600" />
                      <span>$15,000</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-blue-600" />
                      <span>1,247 participants</span>
                    </div>
                  </div>
                  <Link to="/challenges">
                    <Button className="w-full bg-green-600 hover:bg-green-700 text-white group-hover:shadow-md transition-all">
                      Take Challenge
                      <Trophy className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* Refugee Camp Challenge */}
              <Card className="min-w-[320px] md:min-w-[380px] hover:shadow-lg transition-all duration-300 cursor-pointer snap-start group">
                <CardHeader>
                  <div className="flex items-start justify-between mb-3">
                    <div className="p-2 bg-orange-100 rounded-lg">
                      <Users className="w-6 h-6 text-orange-600" />
                    </div>
                    <Badge className="bg-yellow-100 text-yellow-800">Intermediate</Badge>
                  </div>
                  <CardTitle className="text-lg">🏕️ Refugee Camp Emergency Power</CardTitle>
                  <CardDescription>
                    Rapid deployment system for 5,000 people. Must work in extreme conditions with minimal maintenance.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-green-600" />
                      <span>$50,000</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-blue-600" />
                      <span>743 participants</span>
                    </div>
                  </div>
                  <Link to="/challenges">
                    <Button className="w-full bg-green-600 hover:bg-green-700 text-white group-hover:shadow-md transition-all">
                      Take Challenge
                      <Trophy className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* Eco Community Challenge */}
              <Card className="min-w-[320px] md:min-w-[380px] hover:shadow-lg transition-all duration-300 cursor-pointer snap-start group">
                <CardHeader>
                  <div className="flex items-start justify-between mb-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <Wind className="w-6 h-6 text-green-600" />
                    </div>
                    <Badge className="bg-red-100 text-red-800">Advanced</Badge>
                  </div>
                  <CardTitle className="text-lg">🏠 Off-Grid Eco Community</CardTitle>
                  <CardDescription>
                    100% renewable microgrid for 50 families. Zero emissions, maximum resilience, smart grid integration.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-green-600" />
                      <span>$200,000</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-blue-600" />
                      <span>298 participants</span>
                    </div>
                  </div>
                  <Link to="/challenges">
                    <Button className="w-full bg-green-600 hover:bg-green-700 text-white group-hover:shadow-md transition-all">
                      Take Challenge
                      <Trophy className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* Island Resort Challenge */}
              <Card className="min-w-[320px] md:min-w-[380px] hover:shadow-lg transition-all duration-300 cursor-pointer snap-start group">
                <CardHeader>
                  <div className="flex items-start justify-between mb-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Zap className="w-6 h-6 text-blue-600" />
                    </div>
                    <Badge className="bg-yellow-100 text-yellow-800">Intermediate</Badge>
                  </div>
                  <CardTitle className="text-lg">🏝️ Sustainable Island Resort</CardTitle>
                  <CardDescription>
                    Replace diesel generators with clean energy for a tropical resort. Tourism meets sustainability.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-green-600" />
                      <span>$75,000</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-blue-600" />
                      <span>567 participants</span>
                    </div>
                  </div>
                  <Link to="/challenges">
                    <Button className="w-full bg-green-600 hover:bg-green-700 text-white group-hover:shadow-md transition-all">
                      Take Challenge
                      <Trophy className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
            
            <div className="text-center mt-8">
              <Link to="/challenges">
                <Button variant="outline" size="lg" className="text-lg px-8 py-3 border-green-600 text-green-600 hover:bg-green-50">
                  View All Challenges
                  <Trophy className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Ready to Transform Your Energy Future?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Join thousands of homeowners who have already optimized their energy systems
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="cta" size="lg" onClick={handleGetStarted} className="text-lg px-8 py-3">
              <Brain className="mr-2 h-5 w-5" />
              Start Your AI Analysis
            </Button>
            <Button variant="outline" size="lg" asChild className="text-lg px-8 py-3">
              <Link to="/challenges">
                <Trophy className="mr-2 h-5 w-5" />
                Try Challenges
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <Zap className="h-8 w-8 text-green-500 mr-2" />
                <span className="text-xl font-bold">EnergyFlow</span>
              </div>
              <p className="text-gray-400">
                Empowering sustainable energy solutions for a better tomorrow.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Solutions</h3>
              <ul className="space-y-2">
                <li><Link to="/simulator" className="text-gray-400 hover:text-white">Energy Simulator</Link></li>
                <li><Link to="/challenges" className="text-gray-400 hover:text-white">Challenges</Link></li>
                <li><Button variant="ghost" onClick={() => setShowPartnerModal(true)} className="text-gray-400 hover:text-white p-0 h-auto">Partners</Button></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Support</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white">Documentation</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Help Center</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white">About</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Careers</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Privacy</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 EnergyFlow. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Modals */}
      {showAuthModal && <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} onAuthSuccess={() => setShowAddressScan(true)} />}
      
      {showAddressScan && <AddressScanModal isOpen={showAddressScan} onClose={() => setShowAddressScan(false)} onScanComplete={() => {}} />}
      
      {showPartnerModal && <PartnerModalWrapper isOpen={showPartnerModal} onClose={() => setShowPartnerModal(false)} />}
      
      {showEarlyAccessModal && <EarlyAccessModalWrapper isOpen={showEarlyAccessModal} onClose={() => setShowEarlyAccessModal(false)} />}
    </div>;
};
export default Index;