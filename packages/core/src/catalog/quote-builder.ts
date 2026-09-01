import { randomUUID } from "crypto";
import { CatalogStore } from "./catalog-store";
import { HmacSigner } from "../firewall/signer";
import { OrderItemInput, DraftQuote } from "../types/schemas";

export class QuoteBuilder {
  constructor(
    private catalog: CatalogStore,
    private signer: HmacSigner
  ) {}

  /**
   * Compiles the AI's intent into a cryptographically sealed DraftQuote.
   */
  public buildDraft(
    merchantId: string,
    tenantId: string,
    clientId: string,
    sessionId: string,
    agentId: string,
    inputs: OrderItemInput[]
  ): DraftQuote {
    let grossAmountPaise = 0;
    let netAmountPaise = 0;
    const resolvedItems = [];

    // Zero-Trust Hydration: AI provides IDs, we look up the truth.
    for (const input of inputs) {
      const resolved = this.catalog.resolveItem(input.skuId, input.quantity);
      resolvedItems.push(resolved);
      grossAmountPaise += (this.catalog.getSku(input.skuId).basePricePaise * input.quantity);
      netAmountPaise += resolved.subtotalPaise;
    }

    const discountAmountPaise = grossAmountPaise - netAmountPaise;
    const issuedAt = Date.now();
    
    const quote: Omit<DraftQuote, "signature"> = {
      draftId: randomUUID(),
      merchantId,
      tenantId,
      clientId,
      sessionId,
      agentId,
      items: resolvedItems,
      grossAmountPaise,
      discountAmountPaise,
      netAmountPaise,
      currency: "INR",
      nonce: randomUUID(), // The anti-replay token
      issuedAt,
      expiresAt: issuedAt + 300000 // 5-minute execution window for HITL delays
    };

    const signature = this.signer.sign(quote);

    return {
      ...quote,
      signature
    };
  }
}