import * as Ollama from "./ollama.js";

export interface MealPlanner {
  /**
   * Generate a meal plan with the given {@link MealPlanRequestParams} `params`.
   */
  generateMealPlans(params?: Partial<MealPlanRequestParams>): Promise<string>;
}

/**
 * Acceptable parameters for generating a meal plan.
 */
export type MealPlanRequestParams = {
  adultCount: number;
  childCount: number;
  mealCount: number;
}

export const defaultMealPlanRequestParams = {
  adultCount: 2,
  childCount: 2,
  mealCount: 7,
} as const satisfies MealPlanRequestParams;

export function usingOllama(model = "llama3") {
  return {
    async generateMealPlans(params) {
      const { adultCount, childCount, mealCount } = params
        ? { ...defaultMealPlanRequestParams, ...params }
        : defaultMealPlanRequestParams;
      
      const completion = await Ollama.generate({
        model,
        prompt: `I need help planning dinner for the next ${mealCount} days. We are a family of ${adultCount + childCount} with ${adultCount} adults and ${childCount} young children. We follow a vegetarian diet preferring vegan options when available. Please provide ${mealCount} meal ideas including at least a main dish and side dish for each meal.`,
        stream: false,
        system:
            "You are a dietitian specializing in planning healthy meals meeting vegetarian and vegan dietary restrictions for adults and young children.",
      });

      return completion.response;
    },
  } satisfies MealPlanner;
}
