-- Create suppliers table
CREATE TABLE public.suppliers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users,
  name TEXT NOT NULL,
  supplier_type TEXT NOT NULL,
  contact_person TEXT,
  phone TEXT,
  email TEXT,
  location TEXT,
  status TEXT NOT NULL DEFAULT '潜在',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.suppliers ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for suppliers
CREATE POLICY "Users can view their own suppliers" 
ON public.suppliers 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own suppliers" 
ON public.suppliers 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own suppliers" 
ON public.suppliers 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own suppliers" 
ON public.suppliers 
FOR DELETE 
USING (auth.uid() = user_id);

-- Allow anonymous access policies for demo purposes
CREATE POLICY "Allow anonymous access to suppliers" 
ON public.suppliers 
FOR ALL 
USING (true) 
WITH CHECK (true);

-- Add check constraint for status
ALTER TABLE public.suppliers ADD CONSTRAINT suppliers_status_check 
CHECK (status = ANY (ARRAY['潜在'::text, '合作中'::text, '暂停'::text, '停止合作'::text]));

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_suppliers_updated_at
BEFORE UPDATE ON public.suppliers
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();