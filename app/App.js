"use client";

import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
  QueryClientProvider,
} from "@tanstack/react-query";
import Home from "./page";
import React from "react";

export default function App() {
  const [queryClient] = React.useState(() => new QueryClient());
  const dehydratedState = dehydrate(queryClient);

  return (
    <QueryClientProvider client={queryClient}>
      <HydrationBoundary state={dehydratedState}>
        <Home />
      </HydrationBoundary>
    </QueryClientProvider>
  );
}
