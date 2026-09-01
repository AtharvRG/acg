import { z } from "zod";

// ==========================================
// 1. CATALOG & DYNAMIC PRICING SCHEMAS
// ==========================================
export const ProductSKUSchema = z.object({
  skuId: z.string(),
  name: z.string(),
  description: z.string(),
  category: z.string(),
  basePricePaise: z.number().int().nonnegative(),
  currency: z.literal("INR"),
  inStock: z.boolean(),
  maxOrderQuantity: z.number().int().positive(),
  tags: z.array(z.string()),
});
export type ProductSKU = z.infer<typeof ProductSKUSchema>;

// ==========================================
// 2. DRAFT INTENT & QUOTE SCHEMAS
// ==========================================
export const OrderItemInputSchema = z.object({
  skuId: z.string(),
  quantity: z.number().int().positive(),
});
export type OrderItemInput = z.infer<typeof OrderItemInputSchema>;

export const ResolvedOrderItemSchema = z.object({
  skuId: z.string(),
  name: z.string(),
  quantity: z.number().int().positive(),
  unitPricePaise: z.number().int().nonnegative(),
  subtotalPaise: z.number().int().nonnegative(),
});
export type ResolvedOrderItem = z.infer<typeof ResolvedOrderItemSchema>;

export const DraftQuoteSchema = z.object({
  draftId: z.string().uuid(),
  merchantId: z.string(),
  tenantId: z.string(),
  clientId: z.string(),
  sessionId: z.string(),
  agentId: z.string(),
  items: z.array(ResolvedOrderItemSchema),
  grossAmountPaise: z.number().int().nonnegative(),
  discountAmountPaise: z.number().int().nonnegative(),
  netAmountPaise: z.number().int().nonnegative(),
  currency: z.literal("INR"),
  nonce: z.string().uuid(),
  issuedAt: z.number().int().positive(),
  expiresAt: z.number().int().positive(),
  signature: z.string(), // HMAC hex string
});
export type DraftQuote = z.infer<typeof DraftQuoteSchema>;

// ==========================================
// 3. SESSION POLICY & GOVERNOR SCHEMAS
// ==========================================
export const SessionPolicySchema = z.object({
  sessionId: z.string(),
  merchantId: z.string(),
  agentId: z.string(),
  maxTotalBudgetPaise: z.number().int().nonnegative(),
  maxPerTransactionPaise: z.number().int().nonnegative(),
  totalSpentPaise: z.number().int().nonnegative(),
  remainingAllowancePaise: z.number().int().nonnegative(),
  pendingShortfallPaise: z.number().int().nonnegative().optional(), // <--- ADD THIS
  maxVelocityPerMinute: z.number().int().positive(),
  status: z.enum(["ACTIVE", "EXHAUSTED", "THROTTLED", "TERMINATED"]),
  createdAt: z.number().int().positive(),
  expiresAt: z.number().int().positive(),
});
export type SessionPolicy = z.infer<typeof SessionPolicySchema>;

// ==========================================
// 4. VOLUME DISCOUNT RULE SCHEMAS (Forgot this earlier :P)
// ==========================================
export const VolumeDiscountRuleSchema = z.object({
  ruleId: z.string(),
  targetSkuId: z.string(),
  minQuantity: z.number().int().positive(),
  discountPercentage: z.number().int().min(0).max(100), // Strict 0-100 integer range
  isActive: z.boolean(),
});
export type VolumeDiscountRule = z.infer<typeof VolumeDiscountRuleSchema>;