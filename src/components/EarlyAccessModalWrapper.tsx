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
import { Sparkles, Send, CheckCircle } from "lucide-react";

interface EarlyAccessModalWrapperProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EarlyAccessModalWrapper = ({ isOpen, onClose }: EarlyAccessModalWrapperProps) => {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isSubmitted, setIsSubmitted] = React.useState(false);
  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    organization: '',
    role: '',
    useCase: '',
    interests: [] as string[],
    newsletter: true
  });
  const { toast } = useToast();

  const interestOptions = [
    'Educational Projects',
    'Rural Electrification',
    'Humanitarian Aid',
    'Commercial Applications',
    'Research & Development',
    'Policy & Planning'
  ];

  const handleInterestChange = (interest: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      interests: checked
        ? [...prev.interests, interest]
        : prev.interests.filter(i => i !== interest)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    setIsSubmitting(false);
    setIsSubmitted(true);
    
    toast({
      title: "Application Submitted!",
      description: "Thank you for your interest. We'll be in touch soon.",
    });

    // Close modal after success message
    setTimeout(() => {
      onClose();
      setIsSubmitted(false);
      setFormData({
        name: '',
        email: '',
        organization: '',
        role: '',
        useCase: '',
        interests: [],
        newsletter: true
      });
    }, 2000);
  };

  if (isSubmitted) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
          <div className="text-center py-8">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-green-600 mb-2">Thank You!</h3>
            <p className="text-muted-foreground">
              Your early access application has been submitted successfully. 
              We'll review your information and get back to you soon.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Sparkles className="w-6 h-6 text-primary" />
            Get Early Access to EnergyFlow
          </DialogTitle>
          <DialogDescription className="text-base">
            Join our select group of beta users and help shape the future of microgrid design. 
            Get exclusive access to advanced features and priority support.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="useCase">How do you plan to use EnergyFlow? *</Label>
            <Textarea
              id="useCase"
              placeholder="Tell us about your intended use case, projects, or research goals..."
              className="min-h-[100px]"
              value={formData.useCase}
              onChange={(e) => setFormData(prev => ({ ...prev, useCase: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-3">
            <Label>Areas of Interest (select all that apply)</Label>
            <div className="grid grid-cols-2 gap-3">
              {interestOptions.map((interest) => (
                <div key={interest} className="flex items-center space-x-2">
                  <Checkbox
                    id={interest}
                    checked={formData.interests.includes(interest)}
                    onCheckedChange={(checked) => handleInterestChange(interest, checked as boolean)}
                  />
                  <Label htmlFor={interest} className="text-sm font-normal">
                    {interest}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
            >
              Maybe Later
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="min-w-[120px]"
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