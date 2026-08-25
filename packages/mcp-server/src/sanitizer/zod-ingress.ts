import { z } from "zod";

export class ZodIngress {
  /**
   * Safely parses raw probabilistic JSON from an LLM.
   * If validation fails, it generates an auto-correction prompt for the agent.
   */
  public static sanitize<T>(
    schema: z.ZodType<T>, 
    data: unknown
  ): { success: true; data: T } | { success: false; autoCorrectPrompt: string } {
    
    const result = schema.safeParse(data);
    
    if (result.success) {
      return { success: true, data: result.data };
    }

    // Use .issues instead of .errors for strict Zod type compliance
    const errorDetails = result.error.issues.map(issue => 
      `[Path: ${issue.path.join(".")}] - ${issue.message}`
    ).join(" | ");

    const autoCorrectPrompt = `VALIDATION_FAILED: Your JSON payload was rejected. Please correct the following errors and retry the tool execution: ${errorDetails}`;

    return { success: false, autoCorrectPrompt };
  }
}