# SDK Integration & Facade Pattern

The ACG is designed as a drop-in middleware package for existing enterprise merchants. It does not require merchants to replace their existing databases or storefronts.

## The AgenticGateway SDK

Merchants instantiate the ACG Firewall in their Node.js backend using the Facade pattern:

```TypeScript
import { AgenticGateway } from "@acg/core";// 1. Initialize the Gateway SDK
const acg = new AgenticGateway({
  hmacSecret: process.env.ACG_SECRET,
  razorpayKeyId: process.env.RZP_KEY,
  razorpayKeySecret: process.env.RZP_SECRET
});// 2. Register a budget for the buyer's AI
acg.governor.registerSession({
  sessionId: "techcorp_ai_1",
  agentId: "TechCorp Procurement Bot",
  remainingAllowancePaise: 50000000 // ₹500,000 limit
});
```

## The Database Adapter Pattern

If a merchant has an existing Postgres database containing 50,000 products, they do not manually duplicate data. They map their existing query to the ACG's `.loadInventory()` schema.

```TypeScript
async function syncExistingStoreToAI() {
  const myExistingProducts = await prisma.product.findMany();  const aiTransactableSkus = myExistingProducts.map(dbItem => ({
    skuId: dbItem.id,
    name: dbItem.title,
    basePricePaise: Math.floor(dbItem.priceInRupees * 100),
    category: dbItem.category,
    inStock: dbItem.inventoryCount > 0,
    maxOrderQuantity: dbItem.inventoryCount,
    currency: "INR",
    tags: []
  }));  acg.loadInventory(aiTransactableSkus);
}
```

This pattern ensures the ACG remains a frictionless, non-destructive layer sitting securely above the merchant's core infrastructure.
