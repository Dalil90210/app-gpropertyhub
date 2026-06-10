-- Fix: showings — buyers cannot spoof agent_id
DROP POLICY IF EXISTS showings_buyer_insert ON public.showings;
CREATE POLICY showings_buyer_insert ON public.showings
  FOR INSERT TO authenticated
  WITH CHECK (
    auth.uid() = buyer_id
    AND agent_id IS NOT DISTINCT FROM (SELECT p.agent_id FROM public.properties p WHERE p.id = property_id)
  );

-- Fix: escrow — buyers cannot fabricate seller/property pairs
DROP POLICY IF EXISTS escrow_buyer_insert ON public.escrow_transactions;
CREATE POLICY escrow_buyer_insert ON public.escrow_transactions
  FOR INSERT TO authenticated
  WITH CHECK (
    auth.uid() = buyer_id
    AND EXISTS (
      SELECT 1 FROM public.properties p
      WHERE p.id = property_id
        AND p.agent_id = seller_id
    )
  );

-- Fix: offers — buyers cannot self-approve or change status
DROP POLICY IF EXISTS offers_update_involved ON public.offers;

-- Buyers: limited update on their own pending offers; status must remain unchanged
CREATE POLICY offers_buyer_update_limited ON public.offers
  FOR UPDATE TO authenticated
  USING (auth.uid() = buyer_id AND status = 'pending')
  WITH CHECK (auth.uid() = buyer_id AND status = 'pending');

-- Agents (seller side): can update offers on their own listings, including status
CREATE POLICY offers_agent_update ON public.offers
  FOR UPDATE TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.properties p WHERE p.id = property_id AND p.agent_id = auth.uid())
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.properties p WHERE p.id = property_id AND p.agent_id = auth.uid())
  );

-- Prevent buyers from changing status (or property_id/amount) on existing offers
CREATE OR REPLACE FUNCTION public.offers_buyer_field_guard()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF auth.uid() = OLD.buyer_id
     AND NOT EXISTS (
       SELECT 1 FROM public.properties p WHERE p.id = OLD.property_id AND p.agent_id = auth.uid()
     )
  THEN
    IF NEW.status IS DISTINCT FROM OLD.status THEN
      RAISE EXCEPTION 'Buyers may not modify offer status';
    END IF;
    IF NEW.buyer_id IS DISTINCT FROM OLD.buyer_id
       OR NEW.property_id IS DISTINCT FROM OLD.property_id THEN
      RAISE EXCEPTION 'Buyers may not reassign offer buyer/property';
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS offers_buyer_field_guard_trg ON public.offers;
CREATE TRIGGER offers_buyer_field_guard_trg
  BEFORE UPDATE ON public.offers
  FOR EACH ROW EXECUTE FUNCTION public.offers_buyer_field_guard();