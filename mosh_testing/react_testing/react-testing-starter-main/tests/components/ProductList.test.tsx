import { render, screen, waitForElementToBeRemoved } from "@testing-library/react";
import ProductList from "../../src/components/ProductList";
import { server } from "../mocks/server";
import { delay, http, HttpResponse } from "msw";
import AllProviders from "../AllProviders";


describe('ProductList', () => {
  const renderProductList = () => {
    render(<ProductList />, { wrapper: AllProviders });
  };

  it('should render the list of products', async () => {
    renderProductList();

    const listItems = await screen.findAllByRole('listitem');
    expect(listItems.length).toBeGreaterThan(0);
  })

  it('should render no products if no products are found', async () => {
    server.use(http.get('/products', () =>  HttpResponse.json([])));

    renderProductList();

    const element = await screen.findByText(/no products/i);
    expect(element).toBeInTheDocument();
  })

  it('should render error message when there is an error', async () => {
    server.use(http.get('/products', () => HttpResponse.error()));
    
    renderProductList();

    const message = await screen.findByText(/error/i);
    expect(message).toBeInTheDocument();
  })

  it('should render a loading indicator when in the process of getting the data', async () => {
    server.use(http.get('/products', async () => {
      await delay();
      return HttpResponse.json([]);
    }));

    renderProductList();

    const message = await screen.findByText(/loading/i);
    expect(message).toBeInTheDocument();
  })

  it('should not render a loading indicator after data is received', async () => {
    renderProductList();

    await waitForElementToBeRemoved(() => {
      return screen.queryByText(/loading/i);
    });
  })

  it('should not render a loading indicator when there is an error', async () => {
    server.use(http.get('/products', () => HttpResponse.error()));
    renderProductList();

    await waitForElementToBeRemoved(() => {
      return screen.queryByText(/loading/i);
    });
  })
})