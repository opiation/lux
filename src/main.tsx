import { ChakraProvider } from "@chakra-ui/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import Router from "./Router.tsx";
import { theme } from "./theme.js";
import { trpc } from "./trpc.ts";
import { httpBatchLink } from "@trpc/client";

const defaultQueryClient = new QueryClient();
const trpcClient = trpc.createClient({
  links: [httpBatchLink({ url: "http://localhost:3000/trpc" })],
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <trpc.Provider client={trpcClient} queryClient={defaultQueryClient}>
      <QueryClientProvider client={defaultQueryClient}>
        <ChakraProvider theme={theme}>
          <Router />
        </ChakraProvider>
        <ReactQueryDevtools client={defaultQueryClient} />
      </QueryClientProvider>
    </trpc.Provider>
  </StrictMode>,
);
