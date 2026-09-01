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
  // --- INFRASTRUCTURE ---
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
  // --- RETAIL / CORPORATE EQUIPMENT ---
  {
    skuId: "SK101",
    name: "1000X THE COLLEXION",
    description: "Premium Wireless Noise Cancelling Headphones",
    category: "Audio",
    basePricePaise: 3499000, // ₹34,990.00
    currency: "INR",
    inStock: true,
    maxOrderQuantity: 50,
    tags: ["Sony", "Premium", "Audio"]
  },
  {
    skuId: "SK102",
    name: "WH-1000XM6",
    description: "Flagship Wireless Noise Cancelling Headphones",
    category: "Audio",
    basePricePaise: 2999000, // ₹29,990.00
    currency: "INR",
    inStock: true,
    maxOrderQuantity: 50,
    tags: ["Sony", "Flagship", "ANC"]
  },
  {
    skuId: "SK103",
    name: "WH-1000XM4 Premium",
    description: "Classic Wireless Noise Canceling Headphones",
    category: "Audio",
    basePricePaise: 2499000, // ₹24,990.00
    currency: "INR",
    inStock: true,
    maxOrderQuantity: 100,
    tags: ["Sony", "Classic", "ANC"]
  },
  {
    skuId: "SK104",
    name: "ULT WEAR",
    description: "Bass Heavy Wireless Headphones",
    category: "Audio",
    basePricePaise: 1699000, // ₹16,990.00
    currency: "INR",
    inStock: true,
    maxOrderQuantity: 100,
    tags: ["Sony", "Bass", "Street"]
  },
  {
    skuId: "SK105",
    name: "WH-CH720N",
    description: "Lightweight ANC Everyday Headphones",
    category: "Audio",
    basePricePaise: 999000, // ₹9,990.00
    currency: "INR",
    inStock: true,
    maxOrderQuantity: 100,
    tags: ["Sony", "Budget", "Everyday"]
  },
  {
    skuId: "SK106",
    name: "HDB-630",
    description: "Audiophile Closed-Back Studio Headphones",
    category: "Audio",
    basePricePaise: 2299000, // ₹22,990.00
    currency: "INR",
    inStock: true,
    maxOrderQuantity: 50,
    tags: ["Sennheiser", "Studio", "Pro"]
  },
  {
    skuId: "SK107",
    name: "Momentum 4 Wireless",
    description: "Premium Audiophile ANC Travel Headphones",
    category: "Audio",
    basePricePaise: 3499000, // ₹34,990.00
    currency: "INR",
    inStock: true,
    maxOrderQuantity: 50,
    tags: ["Sennheiser", "Premium", "Travel"]
  },
  {
    skuId: "SK108",
    name: "Accentum Wireless",
    description: "Everyday ANC Value Headphones",
    category: "Audio",
    basePricePaise: 1499000, // ₹14,990.00
    currency: "INR",
    inStock: true,
    maxOrderQuantity: 100,
    tags: ["Sennheiser", "Value", "ANC"]
  },
  {
    skuId: "SK109",
    name: "Nothing Headphone (1)",
    description: "Transparent Design ANC Headphones with LDAC",
    category: "Audio",
    basePricePaise: 1299900, // ₹12,999.00
    currency: "INR",
    inStock: true,
    maxOrderQuantity: 100,
    tags: ["Nothing", "Design", "LDAC"]
  },
  {
    skuId: "SK110",
    name: "CMF By Nothing Pro",
    description: "Budget ANC Value Headphones",
    category: "Audio",
    basePricePaise: 499900, // ₹4,999.00
    currency: "INR",
    inStock: true,
    maxOrderQuantity: 100,
    tags: ["Nothing", "CMF", "Value"]
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

// Setup a mock budget for the AI Session
const SESSION_ID = "session_mock_123";
governor.registerSession({
  sessionId: SESSION_ID,
  merchantId: "acg_merchant",
  agentId: "Agentic CLI", // Rebranded
  maxTotalBudgetPaise: 500000, 
  maxPerTransactionPaise: 500000,
  totalSpentPaise: 0,
  remainingAllowancePaise: 500000,
  maxVelocityPerMinute: 10,
  status: "ACTIVE",
  createdAt: Date.now(),
  expiresAt: Date.now() + 86400000 
});

export const kernel = {
  catalog,
  quoteBuilder: new QuoteBuilder(catalog, signer),
  gatekeeper: new Gatekeeper(signer, nonces, clock, governor),
  governor,
  rzpClient: new RazorpaySettlementClient(
    process.env.RAZORPAY_KEY_ID || "rzp_test_fallback",
    process.env.RAZORPAY_KEY_SECRET || "fallback_secret"
  ),
  SESSION_ID
};