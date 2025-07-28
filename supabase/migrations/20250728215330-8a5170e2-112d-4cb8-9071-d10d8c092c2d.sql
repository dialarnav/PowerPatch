-- Add address_scan_designs table for AI-generated house scans
CREATE TABLE public.address_scan_designs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  address TEXT NOT NULL,
  scan_data JSONB,
  ai_recommendations JSONB,
  components JSONB,
  total_cost DECIMAL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on address scans
ALTER TABLE public.address_scan_designs ENABLE ROW LEVEL SECURITY;

-- Create policies for address scans
CREATE POLICY "Users can view their own address scans" 
ON public.address_scan_designs 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own address scans" 
ON public.address_scan_designs 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own address scans" 
ON public.address_scan_designs 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own address scans" 
ON public.address_scan_designs 
FOR DELETE 
USING (auth.uid() = user_id);

-- Add update trigger for address scans
CREATE TRIGGER update_address_scan_designs_updated_at
BEFORE UPDATE ON public.address_scan_designs
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();