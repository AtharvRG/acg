import { CatalogStore } from "./catalog/catalog-store";
import { QuoteBuilder } from "./catalog/quote-builder";
import { DiscountEngine } from "./catalog/discount-engine";
import { HmacSigner } from "./firewall/signer";
import { NonceAuthority } from "./firewall/nonce-authority";
import { ClockMonitor } from "./firewall/clock-monitor";
import { SessionGovernor } from "./firewall/session-governor";
import { Gatekeeper } from "./firewall/gatekeeper";
import { RazorpaySettlementClient } from "./settlement/razorpay-client";
import { ProductSKU, VolumeDiscountRule } from "./types/schemas";

export interface GatewayConfig {
  hmacSecret: string;
  razorpayKeyId: string;
  razorpayKeySecret: string;
  clockDriftToleranceMs?: number;
}

/**
 * The core SDK entry point for @acg/core.
 * Merchants initialize this once in their backend to protect their infrastructure.
 */
export class AgenticGateway {
  public catalog: CatalogStore;
  public governor: SessionGovernor;
  public gatekeeper: Gatekeeper;
  public quoteBuilder: QuoteBuilder;
  public settlement: RazorpaySettlementClient;

  constructor(config: GatewayConfig) {
    const signer = new HmacSigner(config.hmacSecret);
    const nonces = new NonceAuthority();
    const clock = new ClockMonitor(); // Can accept config.clockDriftToleranceMs in a prod version
    
    this.governor = new SessionGovernor();
    this.gatekeeper = new Gatekeeper(signer, nonces, clock, this.governor);
    this.settlement = new RazorpaySettlementClient(config.razorpayKeyId, config.razorpayKeySecret);
    
    // Initialized empty. Merchants use .loadInventory() to inject their database.
    this.catalog = new CatalogStore([], []);
    this.quoteBuilder = new QuoteBuilder(this.catalog, signer);
  }

  /**
   * Plugs the merchant's actual database/inventory into the firewall.
   */
  public loadInventory(skus: ProductSKU[], rules: VolumeDiscountRule[] = []) {
    this.catalog = new CatalogStore(skus, rules);
    this.quoteBuilder = new QuoteBuilder(this.catalog, new HmacSigner(this.gatekeeper["signer"]["secret"]));
  }
}