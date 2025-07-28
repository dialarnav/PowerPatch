import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Handshake, Send, CheckCircle, Users, Globe, Zap } from "lucide-react";

interface PartnerModalProps {
  children: React.ReactNode;
}

const PartnerModal = ({ children }: PartnerModalProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    organizationName: '',
    contactName: '',
    email: '',
    phone: '',
    website: '',
    organizationType: '',
    partnershipType: '',
    description: '',
    goals: '',
    timeline: '',
    resources: [] as string[],
    newsletter: true
  });
  const { toast } = useToast();

  const organizationTypes = [
    'Educational Institution',
    'NGO/Non-Profit',
    'Government Agency',
    'Research Institution',
    'Corporate/Business',
    'International Organization',
    'Other'
  ];

  const partnershipTypes = [
    'Educational Partnership',
    'Research Collaboration',
    'Implementation Partner',
    'Funding/Sponsorship',
    'Technology Integration',
    'Content Development',
    'Community Outreach'
  ];

  const resourceOptions = [
    'Funding/Grants',
    'Technical Expertise',
    'Educational Content',
    'Real-world Data',
    'Field Testing Sites',
    'Student/Volunteer Network',
    'Marketing/Outreach',
    'Translation Services'
  ];

  const handleResourceChange = (resource: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      resources: checked
        ? [...prev.resources, resource]
        : prev.resources.filter(r => r !== resource)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));

    setIsSubmitting(false);
    setIsSubmitted(true);
    
    toast({
      title: "Partnership Application Submitted!",
      description: "Thank you for your interest. Our partnerships team will contact you within 48 hours.",
    });

    // Close modal after success message
    setTimeout(() => {
      setIsOpen(false);
      setIsSubmitted(false);
      setFormData({
        organizationName: '',
        contactName: '',
        email: '',
        phone: '',
        website: '',
        organizationType: '',
        partnershipType: '',
        description: '',
        goals: '',
        timeline: '',
        resources: [],
        newsletter: true
      });
    }, 3000);
  };

  if (isSubmitted) {
    return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          {children}
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <div className="text-center py-8">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-green-600 mb-2">Partnership Application Received!</h3>
            <p className="text-muted-foreground mb-4">
              Thank you for your interest in partnering with PowerPatch. 
              Our partnerships team will review your application and contact you within 48 hours.
            </p>
            <div className="bg-muted p-4 rounded-lg">
              <p className="text-sm text-muted-foreground">
                We're excited about the possibility of working together to democratize energy access worldwide.
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Handshake className="w-6 h-6 text-primary" />
            Partner with PowerPatch
          </DialogTitle>
          <DialogDescription className="text-base">
            Join our mission to democratize clean energy design. Partner with us to bring microgrid 
            education and solutions to communities worldwide.
          </DialogDescription>
        </DialogHeader>

        {/* Partnership Types */}
        <div className="bg-gradient-section p-4 rounded-lg mb-6">
          <h4 className="font-medium mb-3">Partnership Opportunities:</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="flex items-center gap-2 p-2 bg-background rounded">
              <Users className="w-4 h-4 text-blue-600" />
              <span className="text-sm">Educational Programs</span>
            </div>
            <div className="flex items-center gap-2 p-2 bg-background rounded">
              <Globe className="w-4 h-4 text-green-600" />
              <span className="text-sm">Global Deployment</span>
            </div>
            <div className="flex items-center gap-2 p-2 bg-background rounded">
              <Zap className="w-4 h-4 text-yellow-600" />
              <span className="text-sm">Innovation & Research</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Organization Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Organization Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="organizationName">Organization Name *</Label>
                <Input
                  id="organizationName"
                  placeholder="Enter organization name"
                  value={formData.organizationName}
                  onChange={(e) => setFormData(prev => ({ ...prev, organizationName: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="organizationType">Organization Type *</Label>
                <select
                  id="organizationType"
                  className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm"
                  value={formData.organizationType}
                  onChange={(e) => setFormData(prev => ({ ...prev, organizationType: e.target.value }))}
                  required
                >
                  <option value="">Select type...</option>
                  {organizationTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                type="url"
                placeholder="https://yourorganization.com"
                value={formData.website}
                onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
              />
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contact Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="contactName">Contact Name *</Label>
                <Input
                  id="contactName"
                  placeholder="Primary contact person"
                  value={formData.contactName}
                  onChange={(e) => setFormData(prev => ({ ...prev, contactName: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="contact@organization.com"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+1 (555) 123-4567"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
              />
            </div>
          </div>

          {/* Partnership Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Partnership Details</h3>
            
            <div className="space-y-2">
              <Label htmlFor="partnershipType">Partnership Type *</Label>
              <select
                id="partnershipType"
                className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm"
                value={formData.partnershipType}
                onChange={(e) => setFormData(prev => ({ ...prev, partnershipType: e.target.value }))}
                required
              >
                <option value="">Select partnership type...</option>
                {partnershipTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Organization Description *</Label>
              <Textarea
                id="description"
                placeholder="Tell us about your organization, mission, and current work..."
                className="min-h-[100px]"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="goals">Partnership Goals *</Label>
              <Textarea
                id="goals"
                placeholder="What do you hope to achieve through this partnership? How does it align with your mission?"
                className="min-h-[100px]"
                value={formData.goals}
                onChange={(e) => setFormData(prev => ({ ...prev, goals: e.target.value }))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="timeline">Proposed Timeline</Label>
              <Input
                id="timeline"
                placeholder="e.g., 6 months, 1 year, ongoing..."
                value={formData.timeline}
                onChange={(e) => setFormData(prev => ({ ...prev, timeline: e.target.value }))}
              />
            </div>
          </div>

          {/* Resources */}
          <div className="space-y-3">
            <Label>Resources You Can Contribute (select all that apply)</Label>
            <div className="grid grid-cols-2 gap-3">
              {resourceOptions.map((resource) => (
                <div key={resource} className="flex items-center space-x-2">
                  <Checkbox
                    id={resource}
                    checked={formData.resources.includes(resource)}
                    onCheckedChange={(checked) => handleResourceChange(resource, checked as boolean)}
                  />
                  <Label htmlFor={resource} className="text-sm font-normal">
                    {resource}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="newsletter"
              checked={formData.newsletter}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, newsletter: checked as boolean }))}
            />
            <Label htmlFor="newsletter" className="text-sm">
              Subscribe to PowerPatch partnership updates and collaboration opportunities
            </Label>
          </div>

          <div className="bg-muted p-4 rounded-lg">
            <h4 className="font-medium mb-2">Next Steps:</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-start gap-2">
                <Badge variant="secondary" className="w-2 h-2 rounded-full p-0 mt-2" />
                <span>Partnership team review (within 48 hours)</span>
              </div>
              <div className="flex items-start gap-2">
                <Badge variant="secondary" className="w-2 h-2 rounded-full p-0 mt-2" />
                <span>Initial discussion call to explore synergies</span>
              </div>
              <div className="flex items-start gap-2">
                <Badge variant="secondary" className="w-2 h-2 rounded-full p-0 mt-2" />
                <span>Collaborative proposal development</span>
              </div>
              <div className="flex items-start gap-2">
                <Badge variant="secondary" className="w-2 h-2 rounded-full p-0 mt-2" />
                <span>Partnership agreement and launch</span>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="min-w-[140px]"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Submitting...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Send className="w-4 h-4" />
                  Submit Application
                </div>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PartnerModal;