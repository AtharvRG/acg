import { 
  CatalogStore, 
  DiscountEngine, 
  HmacSigner, 
  NonceAuthority, 
  ClockMonitor, 
  SessionGovernor, 
  Gatekeeper, 
  QuoteBuilder,
  RazorpaySettlementClient,
  ProductSKU,
  VolumeDiscountRule
} from "@acg/core";
import dotenv from "dotenv";

dotenv.config();

// 1. Mock Data for the Hackathon Demo
const MOCK_SKUS: ProductSKU[] = [
  {
    skuId: "COMPUTE_01",
    name: "Enterprise GPU Compute Hour",
    description: "High-performance AI training compute cluster.",
    category: "Infrastructure",
    basePricePaise: 50000, // ₹500.00
    currency: "INR",
    inStock: true,
    maxOrderQuantity: 1000,
    tags: ["compute", "gpu", "ai"]
  },
  {
    skuId: "API_KEY_TIER_1",
    name: "Standard API Key (10k Requests)",
    description: "Standard access to the LLM inference gateway.",
    category: "Software",
    basePricePaise: 100000, // ₹1,000.00
    currency: "INR",
    inStock: true,
    maxOrderQuantity: 50,
    tags: ["api", "access"]
  }
];

const MOCK_RULES: VolumeDiscountRule[] = [
  { ruleId: "VOL_01", targetSkuId: "COMPUTE_01", minQuantity: 10, discountPercentage: 15, isActive: true },
  { ruleId: "VOL_02", targetSkuId: "COMPUTE_01", minQuantity: 50, discountPercentage: 25, isActive: true }
];

// 2. Initialize the Deterministic Firewall
const catalog = new CatalogStore(MOCK_SKUS, MOCK_RULES);
const signer = new HmacSigner("super-secret-enterprise-key-must-be-32-bytes");
const nonces = new NonceAuthority();
const clock = new ClockMonitor();
const governor = new SessionGovernor();

// Setup a mock budget for the AI Session (₹5,000 limit)
const SESSION_ID = "session_mock_123";
governor.registerSession({
  sessionId: SESSION_ID,
  merchantId: "merch_1",
  agentId: "agent_claude",
  maxTotalBudgetPaise: 500000, // ₹5,000
  maxPerTransactionPaise: 500000,
  totalSpentPaise: 0,
  remainingAllowancePaise: 500000,
  maxVelocityPerMinute: 10,
  status: "ACTIVE",
  createdAt: Date.now(),
  expiresAt: Date.now() + 86400000 // 1 day
});

export const kernel = {
  catalog,
  quoteBuilder: new QuoteBuilder(catalog, signer),
  gatekeeper: new Gatekeeper(signer, nonces, clock, governor),
  governor,
  rzpClient: new RazorpaySettlementClient(
    process.env.RAZORPAY_KEY_ID!,
    process.env.RAZORPAY_KEY_SECRET!
  ),
  SESSION_ID
};