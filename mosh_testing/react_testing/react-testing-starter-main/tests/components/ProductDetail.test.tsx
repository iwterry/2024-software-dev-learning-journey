import { render, screen, waitForElementToBeRemoved } from "@testing-library/react";
import ProductDetail from "../../src/components/ProductDetail";
import { server } from "../mocks/server";
import { delay, http, HttpResponse } from "msw";
import { products } from "../mocks/data";
import AllProviders from "../AllProviders";

describe('ProductDetail', () => {
  it('should render no product message when there is no product with the given id', async () => {
    const idOfNonExistentProduct = 100;
    server.use(http.get('/products/:id', () => HttpResponse.json(null)));

    render(<ProductDetail productId={idOfNonExistentProduct} />, { wrapper: AllProviders });

    const message = await screen.findByText(/not found/i);
    expect(message).toBeInTheDocument();
  })

  it('should render correct product info when product with the given id exists', async () => {
    const idOfExistentProduct = 1;

    render(<ProductDetail productId={idOfExistentProduct} />, { wrapper: AllProviders });

    const heading = await screen.findByRole('heading', { name: /product detail/i });
    expect(heading).toBeInTheDocument();
    
    const productName = await screen.findByText(products.get(1)?.name as string, {exact: false});
    expect(productName).toBeInTheDocument();
    
    const productPrice = await screen.findByText('$' + products.get(1)?.price, { exact: false });
    expect(productPrice).toBeInTheDocument();
  })

  it('should render invalid product id message product id is 0', async () => {
    const invalidProductId = 0;

    render(<ProductDetail productId={invalidProductId} />, { wrapper: AllProviders });

    const message = await screen.findByText(/invalid productId/i);
    expect(message).toBeInTheDocument();
  })

  it('should render an error message when there is an error', async () => {
    server.use(http.get('/products/:id', () => HttpResponse.error()));
    render(<ProductDetail productId={1}/>, { wrapper: AllProviders });

    const message = await screen.findByText(/error/i);
    expect(message).toBeInTheDocument();
  })

  it('should render a loading indicator when fetching data', async () => {
    server.use(http.get('/products/:id', async () => {
      await delay();
      return HttpResponse.json(null);
    }));

    render(<ProductDetail productId={1} />, { wrapper: AllProviders });

    const message = await screen.findByText(/loading/i);
    expect(message).toBeInTheDocument();
  })

  it('should not render a loading indicator after data is received', async () => {
    render(<ProductDetail productId={1} />, { wrapper: AllProviders });
    await waitForElementToBeRemoved(() => screen.queryByText(/loading/i));
  })

  it('should not render a loading indicator after error occurs', async () => {
    server.use(http.get('/products/:id', () => HttpResponse.error()));

    render(<ProductDetail productId={1} />, { wrapper: AllProviders });

    await waitForElementToBeRemoved(() => screen.queryByText(/loading/i));
  })
})