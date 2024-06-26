import { Box, Button, Heading, Spinner, Text } from "@chakra-ui/react";
import ReactMarkdown from "react-markdown";
import { trpc } from "../../trpc.ts";

export function MealPlanGenerator() {
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
