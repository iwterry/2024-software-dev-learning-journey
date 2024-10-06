import { render, screen, waitForElementToBeRemoved } from "@testing-library/react";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import routes from "../../src/routes";
import { PropsWithChildren, ReactNode } from "react";
import { server } from "../mocks/server";
import { http, HttpResponse } from "msw";
import { Category, Product } from "../../src/entities";


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


describe('ProductDetailPage', () => {
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

  beforeEach(() => {
    server.use(
      http.get('/categories', () => HttpResponse.json(categories)),
      http.get('/products', () => HttpResponse.json(products)),
      http.get('/products/1', () => HttpResponse.json(products[0])),
      
    )
  })

  afterEach(() => {
    server.resetHandlers()
  })

  const renderProductDetailPage = () => {
    const router = createMemoryRouter(routes, { initialEntries: ['/products/1']});

    render(<RouterProvider router={router} />);
  }

  it('should render product detail', async () => {
    renderProductDetailPage();

    await waitForElementToBeRemoved(() => screen.getByText('loading', { exact: false }));

    const productName = screen.getByRole('heading', { name: new RegExp(products[0].name, 'i')});
    const productPrice = screen.getByText(products[0].price, { exact: false });

    expect(productName).toBeInTheDocument();
    expect(productPrice).toBeInTheDocument();
  })
})