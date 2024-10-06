import { render, screen, waitFor, waitForElementToBeRemoved } from "@testing-library/react";
import ProductForm from "../../src/components/ProductForm";
import { QueryClient, QueryClientProvider } from "react-query";
import { Product } from "../../src/entities";
import { Theme } from "@radix-ui/themes";
import { categories } from "../mocks/data";
import userEvent from "@testing-library/user-event";
import { ProductFormData } from "../../src/validationSchemas/productSchema";
import { Toaster } from "react-hot-toast";

describe('ProductForm', () => {
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

  // from https://stackoverflow.com/questions/39830580/jest-test-fails-typeerror-window-matchmedia-is-not-a-function
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(), // Deprecated
      removeListener: vi.fn(), // Deprecated
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
  // ########################### END ############################

  const user = userEvent.setup();
  const MAX_LENGTH_NAME_INPUT_FIELD = 255;
  const MAX_VALUE_PRICE_INPUT_FIELD = 1000;
  const MIN_VALUE_PRICE_INPUT_FIELD = 1;

  type RenderProductFormParamTypes = {
    onSubmit?: (product: ProductFormData) => Promise<void>;
    product?: Product; 
  };

  const renderProductForm = ({ onSubmit, product }: RenderProductFormParamTypes) => {
    const handler = onSubmit ? onSubmit : vi.fn();
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false
        }
      }
    });

    render(
      <QueryClientProvider client={queryClient}>
        <Theme>
          <ProductForm onSubmit={handler} product={product}/>
          <Toaster />
        </Theme>
      </QueryClientProvider>
    );
  };

  it('should render form fields', async () => {
    renderProductForm({});

    await waitForElementToBeRemoved(() => screen.queryByText('loading', {exact: false}));

    const nameInput = screen.getByPlaceholderText('name', { exact: false });
    expect(nameInput).toBeInTheDocument();

    const priceInput = screen.getByPlaceholderText('price', { exact: false });
    expect(priceInput).toBeInTheDocument();

    const categorySelector = screen.getByRole('combobox', { name: /category/i });
    expect(categorySelector).toBeInTheDocument();
    expect(categorySelector).toHaveTextContent(/category/i);
  })

  it('should show all categories for the category selector', async () => {
    renderProductForm({});

    await waitForElementToBeRemoved(() => screen.queryByText('loading', {exact: false}));
    
    const categorySelector = screen.getByRole('combobox', { name: /category/i });
    await user.click(categorySelector);

    const options = screen.getAllByRole('option');
    expect(options).toHaveLength(categories.length);

    categories.filter((category) => {
      const option = screen.getByRole('option', { name: new RegExp(category.name, 'i') });
      expect(option).toBeInTheDocument();
    })
  })

  it('should render form with the correct default values from the given product', async () => {
    const category = categories[0];
    const product: Product = {
      id: 1,
      categoryId: category.id,
      name: 'Product-1',
      price: 2
    }


    renderProductForm({ product });


    await waitForElementToBeRemoved(() => screen.queryByText('loading', {exact: false}));

    const nameInput = screen.getByPlaceholderText('name', { exact: false });
    const priceInput = screen.getByPlaceholderText('price', { exact: false });
    const categorySelector = screen.getByRole('combobox', { name: /category/i });

    expect(nameInput).toHaveValue(product.name);
    expect(priceInput).toHaveValue(String(product.price));
    expect(categorySelector).toHaveTextContent(category.name);
  })

  it('should have the name input field be focused once the form loads', async () => {
    renderProductForm({});

    await waitForElementToBeRemoved(() => screen.queryByText('loading', {exact: false}));

    const nameInput = screen.getByPlaceholderText('name', { exact: false });

    expect(nameInput).toHaveFocus();
  })

  it.each([
    {
      scenario: 'name field is empty',
      userInput: {
        name:  ''
      },
      keywordsForTextContent: [ /name/i, /required/i ]
    },
    {
      scenario: 'name field exceeds maximum length',
      userInput: {
        name: 'a'.repeat(MAX_LENGTH_NAME_INPUT_FIELD + 1)
      },
      keywordsForTextContent: [ MAX_LENGTH_NAME_INPUT_FIELD.toString() ]
    },
    {
      scenario: 'price field is empty',
      userInput: {
        price: ''
      },
      keywordsForTextContent: [ /price/i, /required/i ]
    },
    {
      scenario: 'price field is 0',
      userInput: {
        price: '0'
      },
      keywordsForTextContent: [ MIN_VALUE_PRICE_INPUT_FIELD.toString() ]
    },
    {
      scenario: 'price field is negative',
      userInput: {
        price: '-1'
      },
      keywordsForTextContent: [ MIN_VALUE_PRICE_INPUT_FIELD.toString() ]
    },
    {
      scenario: 'price field exceeds maximum value',
      userInput: {
        price: String(MAX_VALUE_PRICE_INPUT_FIELD + 1)
      },
      keywordsForTextContent: [ MAX_VALUE_PRICE_INPUT_FIELD.toString() ]
    },
    {
      scenario: 'no category is selected',
      userInput: {
        hasMadeCategorySelection: false
      },
      keywordsForTextContent:  [ /category/i, /required/i ]
    },
    
  ])('should render an error message if $scenario and form is submitted', async ({ userInput, keywordsForTextContent }) => {
    const {
      name='Product-1',
      price='10',
      hasMadeCategorySelection = true
    } = userInput;

    renderProductForm({});
    await waitForElementToBeRemoved(() => screen.queryByText('loading', {exact: false}));

    const nameInput = screen.getByPlaceholderText('name', { exact: false });
    const priceInput = screen.getByPlaceholderText('price', { exact: false });
    const categorySelector = screen.getByRole('combobox', { name: /category/i });
    const submitButton = screen.getByRole('button', { name: /submit/i });
    const getSomeOption = () => screen.getAllByRole('option')[0];

 
    if (name) await user.type(nameInput, name);
    if (price) await user.type(priceInput, price);
    if (hasMadeCategorySelection) {
      await user.tab(); // used only to remove the ACT warnings
      await user.click(categorySelector);
      await user.click(getSomeOption());
    }
    await user.click(submitButton);


    const alert = screen.getByRole('alert');
    expect(alert).toBeInTheDocument();
    keywordsForTextContent.forEach((keyword) => expect(alert).toHaveTextContent(keyword));
  })
  
  it('should call onSubmit with the correct arguments when the form is submitted correctly', async () => {
    const product: ProductFormData = {
      name: 'Product-1',
      price: 10,
      categoryId: categories[0].id
    };


    const mockedCallback = vi.fn();
  
    renderProductForm({ onSubmit: mockedCallback });
    await waitForElementToBeRemoved(() => screen.queryByText('loading', {exact: false}));

    const nameInput = screen.getByPlaceholderText('name', { exact: false });
    const priceInput = screen.getByPlaceholderText('price', { exact: false });
    const categorySelector = screen.getByRole('combobox', { name: /category/i });
    const submitButton = screen.getByRole('button', { name: /submit/i });
    let optionSelected = null;
    const getSomeOption = () => {
      optionSelected = screen.getAllByRole('option')[0];
      return optionSelected;
    };

 
    await user.type(nameInput, product.name);
    await user.type(priceInput, String(product.price));
    await user.tab(); // used only to remove the ACT warnings
    await user.click(categorySelector);
    await user.click(getSomeOption());
    await user.click(submitButton);

    const categorySelected = categories.find(({ name }) => new RegExp(name, 'i').test(optionSelected!.textContent));
    product.categoryId = categorySelected!.id
  
    expect(mockedCallback).toHaveBeenCalledOnce()
    expect(mockedCallback).toHaveBeenCalledWith(product);
  })

  it('should render an error message toast when form is submitted with an error', async () => {
    
      const productName = 'Product-1';
      const productPrice = '10';


    const mockedCallback = vi.fn().mockRejectedValue(new Error('Test Error'));
  
    renderProductForm({ onSubmit: mockedCallback });
    await waitForElementToBeRemoved(() => screen.queryByText('loading', {exact: false}));

    const nameInput = screen.getByPlaceholderText('name', { exact: false });
    const priceInput = screen.getByPlaceholderText('price', { exact: false });
    const categorySelector = screen.getByRole('combobox', { name: /category/i });
    const submitButton = screen.getByRole('button', { name: /submit/i });
    const getSomeOption = () => screen.getAllByRole('option')[0];

 
    await user.type(nameInput, productName);
    await user.type(priceInput, productPrice);
    await user.tab(); // used only to remove the ACT warnings
    await user.click(categorySelector);
    await user.click(getSomeOption());
    await user.click(submitButton);


    const status = await screen.findByRole('status');
    expect(status).toHaveTextContent(/error/i);
  })

  it('should disable and then enable submit button after valid form submission', async () => {
    
    const productName = 'Product-1';
    const productPrice = '10';

    renderProductForm({ onSubmit: vi.fn().mockReturnValue(new Promise<void>((resolve) =>{
      setTimeout(resolve, 1000);
    })) });
    await waitForElementToBeRemoved(() => screen.queryByText('loading', {exact: false}));

    const nameInput = screen.getByPlaceholderText('name', { exact: false });
    const priceInput = screen.getByPlaceholderText('price', { exact: false });
    const categorySelector = screen.getByRole('combobox', { name: /category/i });
    const submitButton = screen.getByRole('button', { name: /submit/i });
    const getSomeOption = () => screen.getAllByRole('option')[0];

 
    await user.type(nameInput, productName);
    await user.type(priceInput, productPrice);
    await user.tab(); // used only to remove the ACT warnings
    await user.click(categorySelector);
    await user.click(getSomeOption());
    await user.click(submitButton);


    await waitFor(() => expect(submitButton).toBeDisabled());
    await waitFor(() => expect(submitButton).toBeEnabled());
  })

  it('should re-enable submit button after form submission error ', async () => {
    
    const productName = 'Product-1';
    const productPrice = '10';

    renderProductForm({ onSubmit: vi.fn().mockRejectedValue(new Error('Test Error')) });
    await waitForElementToBeRemoved(() => screen.queryByText('loading', {exact: false}));

    const nameInput = screen.getByPlaceholderText('name', { exact: false });
    const priceInput = screen.getByPlaceholderText('price', { exact: false });
    const categorySelector = screen.getByRole('combobox', { name: /category/i });
    const submitButton = screen.getByRole('button', { name: /submit/i });
    const getSomeOption = () => screen.getAllByRole('option')[0];

 
    await user.type(nameInput, productName);
    await user.type(priceInput, productPrice);
    await user.tab(); // used only to remove the ACT warnings
    await user.click(categorySelector);
    await user.click(getSomeOption());
    await user.click(submitButton);

    expect(submitButton).toBeEnabled();
  })
})