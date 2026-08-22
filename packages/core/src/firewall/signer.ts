import { createHmac, timingSafeEqual } from "crypto";
import { DraftQuote } from "../types/schemas";

export class HmacSigner {
  private readonly secret: string;

  constructor(secret: string) {
    if (!secret || secret.length < 32) {
      throw new Error("FATAL: HMAC secret must be at least 32 characters long.");
    }
    this.secret = secret;
  }

  /**
   * Deterministically serializes the quote payload into a strict string.
   * Order matters. Do not change this structure.
   */
  private serializePayload(quote: Omit<DraftQuote, "signature">): string {
    const itemString = quote.items
      .sort((a, b) => a.skuId.localeCompare(b.skuId))
      .map((i) => `${i.skuId}:${i.quantity}:${i.unitPricePaise}:${i.subtotalPaise}`)
      .join("|");

    return [
      quote.draftId,
      quote.merchantId,
      quote.sessionId,
      quote.agentId,
      itemString,
      quote.netAmountPaise,
      quote.nonce,
      quote.issuedAt,
      quote.expiresAt,
    ].join("||");
  }

  /**
   * Generates a SHA-256 HMAC signature for the drafted quote.
   */
  public sign(quote: Omit<DraftQuote, "signature">): string {
    const payload = this.serializePayload(quote);
    return createHmac("sha256", this.secret).update(payload).digest("hex");
  }

  /**
   * Verifies the signature using a constant-time comparison to prevent timing attacks.
   */
  public verify(quote: DraftQuote): boolean {
    const expectedSignature = this.sign(quote);
    
    const expectedBuffer = Buffer.from(expectedSignature, "hex");
    const actualBuffer = Buffer.from(quote.signature, "hex");

    if (expectedBuffer.length !== actualBuffer.length) {
      return false;
    }

    return timingSafeEqual(expectedBuffer, actualBuffer);
  }
}