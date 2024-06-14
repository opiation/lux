import { ChakraProvider } from "@chakra-ui/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { router } from "./router.tsx";
import { theme } from "./theme.js";

const defaultQueryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={defaultQueryClient}>
      <ChakraProvider theme={theme}>
        <RouterProvider router={router()} />
      </ChakraProvider>
      <ReactQueryDevtools client={defaultQueryClient} />
    </QueryClientProvider>
  </StrictMode>
);
