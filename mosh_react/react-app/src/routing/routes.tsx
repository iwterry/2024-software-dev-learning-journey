import { createBrowserRouter, Link } from "react-router-dom";
import Contact from "../components/LearningRouting/Contact";
import User from "../components/LearningRouting/User";
import NavigationMenu from "../components/LearningRouting/NavigationMenu";
import ProtectedRoute from "../components/LearningRouting/ProtectedRoute";
import ErrorPage from "../components/LearningRouting/ErrorPage";
import ProgramError from "../components/LearningRouting/ProgramError";
import GamesApp from "../games-project/components/GamesApp";

const router = createBrowserRouter([
  {
    path: '/',
    errorElement: <ErrorPage />,
    element: (
      <>
        <div>Root of website</div>
        <Link to="/users">Go to users page</Link>
      </>
    )
  },
  {
    path: '/games-app',
    element: <GamesApp />
  },
  {
    path: '/users',
    element: <div>Hello users</div>
  },
  {
    path: '/users/:id',
    element: <User />
  },
  {
    path: '/contact',
    element: <Contact />
  },
  {
    path: '/news',
    element: <NavigationMenu />,
    children: [
      {
        path: 'sports',
        element: (
          <ul>
            <li>basketball</li>
            <li>baseball</li>
            <li>football</li>
          </ul>
        )
      },
      {
        path: 'cooking',
        element: <div>Cooking</div>
      },
      {
        path: 'cars',
        element: <div>Cars</div>
      }
    ]
  },
  {
    path: '/login',
    element: <div>Login Page</div>
  },
  {
    path: '/protected',
    element: <ProtectedRoute />,
    children: [
      {
        path: '',
        element: <div>Protected</div>
      },
      {
        path: 'page1',
        element: <div>Protected Page 1</div>    
      },
      {
        path: 'page2',
        element: <div>Protected Page 2</div>
      }
    ]
  },
  {
    path: '/throw-error',
    errorElement: <ErrorPage />,
    element: <ProgramError />
  }
]);

export default router;