ALTER TABLE "Agent" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Property" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Lead" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "LeadActivity" ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON TABLE "Agent", "Property", "Lead", "LeadActivity" FROM anon, authenticated;
GRANT ALL ON TABLE "Agent", "Property", "Lead", "LeadActivity" TO service_role;