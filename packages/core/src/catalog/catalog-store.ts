import { ProductSKU, VolumeDiscountRule, ResolvedOrderItem } from "../types/schemas";
import { DiscountEngine } from "./discount-engine";

export class CatalogStore {
  private skus = new Map<string, ProductSKU>();
  private discountEngine: DiscountEngine;

  constructor(skus: ProductSKU[], rules: VolumeDiscountRule[]) {
    skus.forEach(sku => this.skus.set(sku.skuId, sku));
    this.discountEngine = new DiscountEngine(rules);
  }

  public getSku(skuId: string): ProductSKU {
    const sku = this.skus.get(skuId);
    if (!sku) throw new Error(`CATALOG_ERROR: SKU ${skuId} not found in authoritative database.`);
    if (!sku.inStock) throw new Error(`CATALOG_ERROR: SKU ${skuId} is currently out of stock.`);
    return sku;
  }

  public getAllSkus(): ProductSKU[] {
    return Array.from(this.skus.values());
  }

  /**
   * Takes an AI's requested item and re-hydrates it with real database prices.
   */
  public resolveItem(skuId: string, quantity: number): ResolvedOrderItem {
    const sku = this.getSku(skuId);
    
    if (quantity > sku.maxOrderQuantity) {
       throw new Error(`CATALOG_ERROR: Requested quantity ${quantity} exceeds maximum limit of ${sku.maxOrderQuantity} for ${skuId}.`);
    }

    const discountPct = this.discountEngine.calculateDiscountPercentage(skuId, quantity);
    
    const grossSubtotal = sku.basePricePaise * quantity;
    
    // Strict integer math enforcement (The Paise Invariant)
    const discountAmount = Math.floor(grossSubtotal * (discountPct / 100)); 
    const netSubtotal = grossSubtotal - discountAmount;

    return {
      skuId: sku.skuId,
      name: sku.name,
      quantity,
      unitPricePaise: sku.basePricePaise,
      subtotalPaise: netSubtotal
    };
  }
}