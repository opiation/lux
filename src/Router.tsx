import { Text } from "@chakra-ui/react";
import { lazy } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { App } from "./App.tsx";

const Accounting = lazy(() => import("./components/accounting/Accounting.tsx"));
const MealPlanning = lazy(() => import("./components/MealPlanning.tsx"));

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<App />} path="/">
          <Route element={<Text>Hello, world!</Text>} index />
          <Route element={<Accounting />} path="accounting/*" />
          <Route element={<MealPlanning />} path="meal-planner/*" />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
