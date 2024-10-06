import { render, screen, waitFor } from "@testing-library/react";
import { RouterProvider, createMemoryRouter } from "react-router-dom";
import routes from "../src/routes";
import { PropsWithChildren, ReactNode } from "react";
import { server } from "./mocks/server";
import { http, HttpResponse } from "msw";
import { Category, Product } from "../src/entities";

vi.mock('@auth0/auth0-react', () =>  {
  return {
    useAuth0: vi.fn().mockReturnValue({
      isAuthenticated: false,
      isLoading: false,
      user: undefined
    }),
    Auth0Provider: ({ children }: PropsWithChildren) => children,
    withAuthenticationRequired: (component: ReactNode) => component
  }
});

describe('Router', () => {
  // #################### NEEDED TO DEAL WITH ISSUES ####################
  // idea rom https://github.com/ZeeCoder/use-resize-observer/issues/40
  class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
  window.ResizeObserver = ResizeObserver;
  // ######################### END ####################################

  const categories: Category[] = [
    {
      id: 1,
      name: 'Category-1'
    }
  ];

  const products: Product[] = [
    {
      id: 1,
      name: 'Product-1',
      price: 123,
      categoryId: categories[0].id
    }
  ];

  const renderRouterProvider = (initialEntries: string[]) => {
    const router = createMemoryRouter(routes, { initialEntries });

    render(
      <RouterProvider router={router}/>
    );
  }

  beforeEach(() => {
    server.use(
      http.get('/categories', () => HttpResponse.json(categories)),
      http.get('/products', () => HttpResponse.json(products)),
      http.get('/products/1', () => HttpResponse.json(products[0]))
    );
  })

  afterEach(() => {
    server.resetHandlers();
  })
  
  it('should render the home page for / ', () => {
    renderRouterProvider(['/']);

    const heading = screen.getByRole('heading', { name: /home/i });
    expect(heading).toBeInTheDocument();
  })

  it('should render the products page for /products ', () => {
    renderRouterProvider(['/products']);

    const heading = screen.getByRole('heading', { name: /products/i });
    expect(heading).toBeInTheDocument();
  })

  it('should render the product detail page for /products/:id', async () => {
    renderRouterProvider(['/products/1']);

    await waitFor(() => {
      const heading = screen.getByRole('heading', { name: /product-1/i });
      expect(heading).toBeInTheDocument();
    });


  })

  it('should render not found page when route is invalid', async () => {
    renderRouterProvider(['/invalid-page']);

    const notFoundText = screen.getByText(/not found/i);
    expect(notFoundText).toBeInTheDocument();
  })

  it('should render admin home page for /admin', () => {
    renderRouterProvider(['/admin']);

    const heading = screen.getByRole('heading', { name: /admin/i });
    expect(heading).toBeInTheDocument();
  })
})