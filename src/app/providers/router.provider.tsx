import { createRouter } from "@tanstack/react-router";
import { routeTree } from "../routeTree.gen";
import { useErrorStore } from "@/shared/stores/error.store";
import { RouterProvider as TanstackRouterProvider } from "@tanstack/react-router";
import { PageNotFound } from "../error/model/error";

const router = createRouter({
  routeTree,
  defaultNotFoundComponent: () => {
    useErrorStore.getState().setError(new PageNotFound());
    return null;
  },
});

export const RouterProvider = () => {
  return <TanstackRouterProvider router={router} />;
};
