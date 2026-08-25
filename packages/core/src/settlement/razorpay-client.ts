import Razorpay from "razorpay";
import { DraftQuote } from "../types/schemas";

export class RazorpaySettlementClient {
  private readonly rzp: Razorpay;

  constructor(key_id: string, key_secret: string) {
    if (!key_id || !key_secret) {
      throw new Error("FATAL: Razorpay credentials are required.");
    }
    this.rzp = new Razorpay({ key_id, key_secret });
  }

  /**
   * Dispatches the approved transaction to the Razorpay network.
   * Utilizes the cryptographic nonce to guarantee idempotency.
   */
  public async createTestOrder(quote: DraftQuote) {
    try {
      const order = await this.rzp.orders.create({
        amount: quote.netAmountPaise,
        currency: quote.currency,
        receipt: quote.nonce, // Ties the Razorpay ledger directly to our local Anti-Replay nonce
        notes: {
          draftId: quote.draftId,
          sessionId: quote.sessionId,
          agentId: quote.agentId,
          system: "ACG_MONETARY_FIREWALL"
        }
      });

      return {
        success: true,
        orderId: order.id,
        status: order.status,
      };
    } catch (error: any) {
      // In a production system, this error routes to the Webhook Failsafe queue.
      return {
        success: false,
        error: error.message || "Razorpay API Exception"
      };
    }
  }
}