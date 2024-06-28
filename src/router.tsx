import { createBrowserRouter } from "react-router-dom";
import { Text } from "@chakra-ui/react";
import App from "./App.tsx";
import { Accounting } from "./components/Accounting.tsx";
import { MealPlanning } from "./components/MealPlanning.tsx";

export function router() {
  return createBrowserRouter([
    {
      children: [
        {
          element: <Text>Hello, world</Text>,
        },
        {
          element: <Accounting />,
          path: "/accounting"
        },
        {
          element: <MealPlanning />,
          path: "/meal-planner"
        }
      ],
      element: <App />,
      path: "/",
    },
  ]);
}
