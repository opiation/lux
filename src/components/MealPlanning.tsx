import { Box, Button, Heading, Spinner } from "@chakra-ui/react";
import { default as ReactMarkdown } from "react-markdown";
import { trpc } from "../trpc.ts";

/**
 * Allows users to use AI to plan responsible meals and grocery orders for their
 * families.
 */
export function MealPlanning() {
  const mealPlanGeneration = trpc.generateMealPlans.useMutation();

  return (
    <Box>
      <Heading>Let's plan some meals!</Heading>
      <Button onClick={() => mealPlanGeneration.mutate({ mealCount: 1 })}>Do it now!</Button>
      <Box key="suggestions">
        {mealPlanGeneration.isPending ? (
          <Spinner />
        ) : mealPlanGeneration.data ? (
          <ReactMarkdown>{mealPlanGeneration.data}</ReactMarkdown>
        ) : mealPlanGeneration.error ? (
          mealPlanGeneration.error.message
        ) : null}
      </Box>
    </Box>
  );
}
