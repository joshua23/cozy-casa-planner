-- Update the pricing_model check constraint to allow more values
ALTER TABLE construction_teams DROP CONSTRAINT construction_teams_pricing_model_check;

-- Add updated check constraint with more pricing models
ALTER TABLE construction_teams ADD CONSTRAINT construction_teams_pricing_model_check 
CHECK (pricing_model = ANY (ARRAY['包工'::text, '包料'::text, '包工包料'::text, '包工不包料'::text, '按天计价'::text, '按项目计价'::text]));

-- Add missing trigger for updated_at if not exists
CREATE TRIGGER update_construction_teams_updated_at
    BEFORE UPDATE ON public.construction_teams
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();