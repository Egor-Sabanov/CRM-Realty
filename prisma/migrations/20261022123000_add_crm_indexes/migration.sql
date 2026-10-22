CREATE INDEX "Lead_agentId_idx" ON "Lead"("agentId");
CREATE INDEX "Lead_propertyId_idx" ON "Lead"("propertyId");
CREATE INDEX "LeadActivity_leadId_idx" ON "LeadActivity"("leadId");
CREATE INDEX "Property_status_idx" ON "Property"("status");
CREATE INDEX "Lead_status_updatedAt_idx" ON "Lead"("status", "updatedAt");