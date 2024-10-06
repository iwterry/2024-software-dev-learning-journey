import { createBrowserRouter } from "react-router-dom";
import ErrorPage from "../pages/ErrorPage";
import GameDetailPage from "../pages/GameDetailPage";
import HomePage from "../pages/HomePage";
import Layout from "../pages/Layout";
const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    errorElement: (
      <Layout>
        <ErrorPage />
      </Layout>
    ),
    children: [
      {
        path: '',
        element: <HomePage />
      },
      {
        path: 'games/:slug',
        element: <GameDetailPage />
      }
    ]
  }
]);

export default router;