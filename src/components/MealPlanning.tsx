import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Spinner,
  Text,
} from "@chakra-ui/react";
import { z as Zod } from "zod";
import { trpc } from "../trpc.ts";
import { MealCard } from "./meal-planner/MealCard.tsx";

const acceptableMealCount = Zod.coerce.number().int().min(1).max(9);

/**
 * Allows users to use AI to plan responsible meals and grocery orders for their
 * families.
 */
export function MealPlanning() {
  const mealPlanGeneration = trpc.generateMealPlans.useMutation();

  const submitMealPlanRequest = (
    submission: React.FormEvent<HTMLFormElement>,
  ) => {
    submission.preventDefault();
    const data = new FormData(submission.currentTarget);

    const mealCount = data.get("mealCount");
    console.log(
      `Submitted request to general a meal plan with the following data: `,
      data,
    );

    return mealPlanGeneration.mutate({
      mealCount:
        typeof mealCount === "string"
          ? acceptableMealCount.default(1).parse(mealCount)
          : 1,
    });
  };

  return (
    <Box>
      <Heading>Let's plan some meals!</Heading>
      <br />
      <br />
      <form onSubmit={submitMealPlanRequest}>
        <FormControl>
          <FormLabel htmlFor="mealCount">
            How many dinners are you looking to plan?
          </FormLabel>
          <Input
            defaultValue={1}
            htmlSize={10}
            name="mealCount"
            placeholder="A number between 1 and 9"
            type="number"
            width="auto"
          />
        </FormControl>
        <br />
        <Button
          isDisabled={mealPlanGeneration.isPending}
          isLoading={mealPlanGeneration.isPending}
          type="submit"
        >
          Generate a meal plan!
        </Button>
      </form>
      <br />
      <Box key="suggestions">
        {mealPlanGeneration.isPending ? (
          <Spinner />
        ) : mealPlanGeneration.data ? (
          <>
            {mealPlanGeneration.data.meals.length > 0 ? (
              <>
                {mealPlanGeneration.data.meals.map((meal) => (
                  <MealCard key={meal.dishes.main.name} meal={meal} />
                ))}
              </>
            ) : (
              <Text>No meals could be generated</Text>
            )}
          </>
        ) : mealPlanGeneration.error ? (
          mealPlanGeneration.error.message
        ) : null}
      </Box>
    </Box>
  );
}
export default MealPlanning;
