import { z } from "zod";

export interface MealPlanner {
  generateMealPlans(
    params?: Partial<MealPlanner.MealPlanRequestParams>
  ): Promise<string>;
}

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace MealPlanner {
  export type MealPlanRequestParams = {
    adultCount: number;
    childCount: number;
    mealCount: number;
  };
}

export const defaultMealPlanRequestParams = {
  adultCount: 2,
  childCount: 2,
  mealCount: 7,
} as const satisfies MealPlanner.MealPlanRequestParams;

export function usingOllama(
  baseAPIURL = "http://localhost:11434/api",
  model = "llama3"
) {
  const responseBody = z.object({
    model: z.string().trim().min(1),
    response: z.string().trim().min(1),
    done: z.boolean(),
  });

  return {
    async generateMealPlans(params) {
      const { adultCount, childCount, mealCount } = params
        ? { ...defaultMealPlanRequestParams, ...params }
        : defaultMealPlanRequestParams;

      const response = await fetch(`${baseAPIURL}/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model,
          prompt: `I need help planning dinner for the next ${mealCount} days. We are a family of ${adultCount + childCount} with ${adultCount} adults and ${childCount} young children. We follow a vegetarian diet preferring vegan options when available. Please provide ${mealCount} meal ideas including at least a main dish and side dish for each meal.`,
          stream: false,
          system:
            "You are a dietitian specializing in planning healthy meals meeting vegetarian and vegan dietary restrictions for adults and young children.",
        }),
      });

      const body = responseBody.parse(await response.json());

      return body.response;
    },
  } satisfies MealPlanner;
}
