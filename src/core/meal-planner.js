// @ts-check

import { z as Zod } from "zod";
import * as Ollama from "../projects/opiation/lux/src/core/ollama.js";

/**
 * @typedef {Object} MealPlanner
 * @property {(params?: Partial<MealPlanRequestParams>) => Promise<MealPlan>} generateMealPlans
 *   Generate a meal plan with the given {@link MealPlanRequestParams} `params`
 */

export const MealPlanRequestParams = Zod.object({
  /** The number of adults each meal in the plan is intended to feed */
  adultCount: Zod.number().min(0)
    .optional(),

  /** The number of children each meal in the plan is intended to feed */
  childCount: Zod.number().min(0)
    .optional(),

  /** The number of meals that should be included in the meal plan */
  mealCount: Zod.number().min(1)
    .optional(),
});
/** @typedef {Zod.infer<typeof MealPlanRequestParams>} MealPlanRequestParams */

/** @satisfies {Required<MealPlanRequestParams>} */
export const defaultMealPlanRequestParams = Object.freeze({
  adultCount: 2,
  childCount: 2,
  mealCount: 7
});

const systemMessage = `
You are a dietitian specializing in planning healthy meals meeting vegetarian and vegan dietary restrictions for adults and young children.

Response with a JSON object matching the schema of the example below:

{
  meals: [
    {
      dishes: {
        main: {
          name: "Vegan Quinoa Stuffed Bell Peppers",
          description: "Roasted bell peppers filled with quinoa, black beans, and cheese (optional)",
          ingredients: ["quinoa", "bell peppers"],
          instructions: ["Roast the bell peppers", "Cook the Quinoa"],
          relatedLinks: []
        },
        side: { ... },
        desert: { ... }
      }
    }
  ]
}

Note that each meal must have a "name", "description" and set of "dishes". The set of "dishes" must include a "main" and "side", and may include a "desert". Each dish must include a "name", "ingredients" array, "instructions" array and may include "relatedLinks" with URLs to existing recipes similar to this dish.
`.trim();

export const Dish = Zod.object({
  name: Zod.string().trim().min(1),
  description: Zod.string().trim().min(1).optional(),
  ingredients: Zod.array(Zod.string().trim().min(1)).optional(),
  instructions: Zod.array(Zod.string().trim().min(1)).optional(),
  relatedLinks: Zod.array(Zod.string().url()).optional()
});
/** @typedef {Zod.infer<typeof Dish>} Dish */

export const Meal = Zod.object({
  dishes: Zod.object({
    main: Dish,
    side: Dish,
    desert: Dish.optional()
  })
})
/** @typedef {Zod.infer<typeof Meal>} Meal */

export const MealPlan = Zod.object({
  meals: Zod.array(Meal)
});
/** @typedef {Zod.infer<typeof MealPlan>} MealPlan */

export function usingOllama(model = "llama3") {
  /** @satisfies {MealPlanner} */
  const self = {
    async generateMealPlans(params = defaultMealPlanRequestParams) {
      const { adultCount, childCount, mealCount } =
        { ...defaultMealPlanRequestParams, ...params };
      
      const completion = await Ollama.generate({
        format: "json",
        model,
        prompt: `I need help planning dinner for the next ${mealCount} days. We are a family of ${adultCount + childCount} with ${adultCount} adults and ${childCount} young children. We follow a vegetarian diet preferring vegan options when available. Please provide ${mealCount} meal ideas including at least a main dish and side dish for each meal.`,
        stream: false,
        system: systemMessage,
      });

      return MealPlan.parse(JSON.parse(completion.response));
    },
  };

  return self;
}
