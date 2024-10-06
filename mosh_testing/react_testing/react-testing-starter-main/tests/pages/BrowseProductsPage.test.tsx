import { render, screen, waitForElementToBeRemoved } from "@testing-library/react";
import BrowseProducts from "../../src/pages/BrowseProductsPage";
import { Category, Product } from "../../src/entities";
import { server } from "../mocks/server";
import { delay, http, HttpResponse } from "msw";
import { Theme } from "@radix-ui/themes";
import { CartProvider } from "../../src/providers/CartProvider";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "react-query";

describe('BrowseProductPage',  () => {
  // #################### NEEDED TO DEAL WITH ISSUES ####################
  // idea rom https://github.com/ZeeCoder/use-resize-observer/issues/40
  class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
  window.ResizeObserver = ResizeObserver;

  // idea from https://github.com/testing-library/user-event/discussions/1087
  HTMLElement.prototype.hasPointerCapture = () => false;
  HTMLElement.prototype.scrollIntoView = () => {};
  // ########################### END ############################

  const products: Product[] = [];
  const categories: Category[] = [];
  const user = userEvent.setup();

  beforeAll(() => {
    categories.push(
      {
        id: 1,
        name: 'Category-1'
      },
      {
        id: 2,
        name: 'Category-2'
      },
      {
        id: 3,
        name: 'Category-3'
      }
    );

    products.push(
      {
        id: 1,
        name: 'Product-1',
        price: 1,
        categoryId: categories[0].id
      },
      {
        id: 2,
        name: 'Product-2',
        price: 2,
        categoryId: categories[1].id
      },
      {
        id: 3,
        name: 'Product-3',
        price: 3,
        categoryId: categories[0].id
      }
    );
  })


  beforeEach(() => {
    server.use(
      http.get('/products', () => {
        return HttpResponse.json(products); 
      }),
      http.get('/categories', () => {
        return HttpResponse.json(categories); 
      }),
    )
  })

  afterEach(() => {
    server.resetHandlers();
  })

  const renderBrowseProducts = () => {
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false
        }
      }
    });

    render(
      <QueryClientProvider client={queryClient}>
        <CartProvider>
          <Theme>
            <BrowseProducts />
          </Theme>
        </CartProvider>
      </QueryClientProvider>
    );
  };

  const renderAndWaitForLoadingToFinishFor = async (items: 'products'|'categories') => {
    renderBrowseProducts();

    await waitForElementToBeRemoved(() => screen.queryByRole(
      'progressbar', { name: new RegExp(items, 'i') }
    ));
  };

  it('should show loading skeletons when fetching categories', () => {
    server.use(http.get('/categories', async () => {
      await delay();
      return HttpResponse.json([]);
    }));

    renderBrowseProducts();

    const progressBar = screen.getByRole('progressbar', { name: /categories/i });
    expect(progressBar).toBeInTheDocument();
  })

  it('should not show loading skeletons after categories have been fetched', async () => {
    await renderAndWaitForLoadingToFinishFor('categories');
  })

  it('should not show loading skeletons after error occurs when fetching categories', async () => {
    server.use(http.get('/categories', () => HttpResponse.error()));

    await renderAndWaitForLoadingToFinishFor('categories');
  })

  it('should show loading skeletons when fetching products', () => {
    server.use(http.get('/products', async () => {
      await delay();
      return HttpResponse.json([]);
    }));

    renderBrowseProducts();

    const progressBar = screen.getByRole('progressbar', { name: /products/i });
    expect(progressBar).toBeInTheDocument();
  })

  it('should not show loading skeletons after products have been fetched', async () => {
    await renderAndWaitForLoadingToFinishFor('products');
  })

  it('should not show loading skeletons after error occurs when fetching products', async () => {
    server.use(http.get('/products', () => HttpResponse.error()));

    await renderAndWaitForLoadingToFinishFor('products');
  })

  it('should not render an error message when an error occurs for fetching categories', async () => {
    server.use(http.get('/categories', () => HttpResponse.error()));
    
    await renderAndWaitForLoadingToFinishFor('categories');

    const message = screen.queryByText(/error/i);
    expect(message).not.toBeInTheDocument();
  })

  it('should not render category drop-down list when an error occurs when fetching categories', async () => {
    server.use(http.get('/categories', () => HttpResponse.error()));

    await renderAndWaitForLoadingToFinishFor('categories');
    
    const comboBoxes = screen.queryAllByRole('combobox');
    const categoryRegExpr = /category/i;
    const categoryComboBox = comboBoxes.find(
      (comboBox) => categoryRegExpr.test(comboBox.textContent || '')
    ) || null;

    expect(categoryComboBox).not.toBeInTheDocument();
  })

  it('should render an error message when an error occurs for fetching products', async () => {
    server.use(http.get('/products', () => HttpResponse.error()));
    
    await renderAndWaitForLoadingToFinishFor("products");

    const message = screen.getByText(/error/i);
    expect(message).toBeInTheDocument();
    
  })

  it('should render category filter options with correct categories', async () => {
    await renderAndWaitForLoadingToFinishFor('categories');

    const comboBox = screen.queryByRole('combobox');
    expect(comboBox).toBeInTheDocument();
    expect(comboBox).toHaveTextContent(/category/i);

    await user.click(comboBox!);
    
    const options = screen.getAllByRole('option');
    expect(options).toHaveLength(categories.length + 1) // plus 1 is for the all categories label

    const categoryNames = [
      'all', // representing the selection for all categories
      ...categories.map(({ name}) => name)
    ];

    categoryNames
      .forEach((categoryName) => {
        const regExprForCategoryName = new RegExp(categoryName, 'i');
        const categoryOption = screen.getByRole('option', { name: regExprForCategoryName });
        expect(categoryOption).toBeInTheDocument();
      });
  });

  it('should render all products', async () => {
    await renderAndWaitForLoadingToFinishFor('products');

    products.forEach((product) => {
      const productName = screen.getByText(product.name, { exact: false });
      expect(productName).toBeInTheDocument();
    })
  })

  it('should filter products by category', async () => {
    await renderAndWaitForLoadingToFinishFor('categories');
    const comboBox = screen.getByRole('combobox');
    await user.click(comboBox);
    const category = categories[0];
    const option = screen.getByRole('option', { name: new RegExp(category.name, 'i') });


    await user.click(option);


    const selectedProducts = products.filter((product) => product.categoryId === category.id);
    selectedProducts.forEach((product) => {
      const productName = screen.getByText(product.name, {exact: false});
      expect(productName).toBeInTheDocument();
    });

    const rows = screen.queryAllByRole('row');
    expect(rows).toHaveLength(selectedProducts.length + 1) // plus 1 because of header row
  })

  it('should render all products when the all category is selected', async () => {
    await renderAndWaitForLoadingToFinishFor('categories');
    const comboBox = screen.getByRole('combobox');
    await user.click(comboBox);
    const option = screen.getByRole('option', { name: /all/i});


    await user.click(option);


    products.forEach((product) => {
      const productName = screen.getByText(product.name, {exact: false});
      expect(productName).toBeInTheDocument();
    });

    const rows = screen.queryAllByRole('row');
    expect(rows).toHaveLength(products.length + 1) // plus 1 because of header row
  })

})