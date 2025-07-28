import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Handshake, Send, CheckCircle, Users, Globe, Zap } from "lucide-react";

interface PartnerModalWrapperProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PartnerModalWrapper = ({ isOpen, onClose }: PartnerModalWrapperProps) => {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isSubmitted, setIsSubmitted] = React.useState(false);
  const [formData, setFormData] = React.useState({
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
      onClose();
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
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
          <div className="text-center py-8">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-green-600 mb-2">Partnership Application Received!</h3>
            <p className="text-muted-foreground mb-4">
              Thank you for your interest in partnering with EnergyFlow. 
              Our partnerships team will review your application and contact you within 48 hours.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Handshake className="w-6 h-6 text-primary" />
            Partner with EnergyFlow
          </DialogTitle>
          <DialogDescription className="text-base">
            Join our mission to democratize clean energy design. Partner with us to bring microgrid 
            education and solutions to communities worldwide.
          </DialogDescription>
        </DialogHeader>

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

          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
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