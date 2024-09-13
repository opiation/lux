import { createBrowserRouter } from "react-router-dom";
import { Text } from "@chakra-ui/react";
import { lazy } from "react";
import { App } from "./App.tsx";

const Accounting = lazy(() => import("./components/accounting/Accounting.tsx"));
const MealPlanning = lazy(() => import("./components/MealPlanning.tsx"));

export function router() {
  return createBrowserRouter([
    {
      children: [
        {
          element: <Text>Hello, world</Text>,
        },
        {
          element: <Accounting />,
          path: "/accounting/*",
        },
        {
          element: <MealPlanning />,
          path: "/meal-planner/*",
        },
      ],
      element: <App />,
      path: "/",
    },
  ]);
}
