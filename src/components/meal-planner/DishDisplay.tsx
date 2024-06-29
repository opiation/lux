import { Heading, ListItem, Text, UnorderedList } from "@chakra-ui/react";
import { Fragment } from "react";
import { Dish } from "../../core/meal-planner.js";

export type DishDisplayProps = {
  dish: Dish
}

export function DishDisplay({ dish }: DishDisplayProps) {
  return (
    <>
      <Heading as="h5" size="sm">{dish.name}</Heading>
      {dish.description && <Text>{dish.description}</Text>}
      {dish.ingredients && dish.ingredients.length > 0 && (
        <Fragment key="ingredients">
          <Heading as="h6" size="xs">Ingredients</Heading>
          <UnorderedList>
            {dish.ingredients.map(ingredient => (
              <ListItem key={ingredient}>{ingredient}</ListItem>
            ))}
          </UnorderedList>
        </Fragment>
      )}
      {dish.instructions && dish.instructions.length > 0 && (
        <Fragment key="instructions">
          <Heading as="h6" size="xs">Instructions</Heading>
          <UnorderedList>
            {dish.instructions.map(instruction => (
              <ListItem key={instruction}>{instruction}</ListItem>
            ))}
          </UnorderedList>
        </Fragment>
      )}
    </>
  )
}
