import { createBrowserRouter } from "react-router-dom";
import { Text } from "@chakra-ui/react";
import App from "./App.tsx";

export function router() {
  return createBrowserRouter([
    {
      children: [
        {
          element: <Text>Hello, world</Text>,
        },
      ],
      element: <App />,
      path: "/",
    },
  ]);
}
