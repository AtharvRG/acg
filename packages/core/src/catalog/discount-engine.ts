import { VolumeDiscountRule } from "../types/schemas";

export class DiscountEngine {
  constructor(private rules: VolumeDiscountRule[]) {}

  /**
   * Evaluates the highest applicable discount tier for a given quantity.
   */
  public calculateDiscountPercentage(skuId: string, quantity: number): number {
    const applicableRules = this.rules
      .filter(r => r.targetSkuId === skuId && r.isActive && quantity >= r.minQuantity)
      .sort((a, b) => b.minQuantity - a.minQuantity); // Sort highest quantity first

    // Return the highest tier percentage, or 0 if no rules apply
    return applicableRules.length > 0 ? applicableRules[0].discountPercentage : 0;
  }
}