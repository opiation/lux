import { Box, Button, Heading, Spinner, Text } from "@chakra-ui/react";
import { trpc } from "../../trpc";

export function MealPlanGenerator() {
  const mealPlanGeneration = trpc.generateMealPlans.useMutation();

  return (
    <Box>
      <Heading>Let's plan some meals!</Heading>
      <Button onClick={() => mealPlanGeneration.mutate({})}>Do it now!</Button>
      <Box key="suggestions">
        {mealPlanGeneration.isPending ? (
          <Spinner />
        ) : mealPlanGeneration.data ? (
          <Text>{mealPlanGeneration.data}</Text>
        ) : mealPlanGeneration.error ? (
          mealPlanGeneration.error.message
        ) : null}
      </Box>
    </Box>
  );
}
