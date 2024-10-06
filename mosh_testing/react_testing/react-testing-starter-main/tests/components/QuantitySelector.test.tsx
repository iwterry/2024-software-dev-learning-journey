import { render, screen } from "@testing-library/react";
import QuantitySelector from "../../src/components/QuantitySelector";
import { CartProvider } from "../../src/providers/CartProvider";
import { Product } from "../../src/entities";
import { categories } from "../mocks/data";
import userEvent from "@testing-library/user-event";

describe('QuantitySelector', () => {
  const user = userEvent.setup();
  const renderQuantitySelector = () => {
    const product: Product = {
      categoryId: categories[0].id,
      id: 1,
      name: 'Product-1',
      price: 1
    };

    render(
      <CartProvider>
        <QuantitySelector product={product}/>
      </CartProvider>
    )
  };

  const elements = {
    getAddToCartButton: () => screen.queryByRole('button', { name: /add to cart/i }),
    getIncrementButton: () => screen.queryByRole('button', { name: /\+/ }),
    getDecrementButton: () => screen.queryByRole('button', { name: /-/ }),
    getQuantity: () => screen.queryByRole('status')
  };

  it('should initially render an add to cart button', () => {
    renderQuantitySelector();

    expect(elements.getAddToCartButton()).toBeInTheDocument();
  })

  it('should not initially render increment and decrement buttons and quantity', () => {
    renderQuantitySelector();

    expect(elements.getIncrementButton()).not.toBeInTheDocument();
    expect(elements.getDecrementButton()).not.toBeInTheDocument();
    expect(elements.getQuantity()).not.toBeInTheDocument();
  })

  it('should render increment and decrement quantity buttons and quantity amount after clicking the add to cart button', async () => {
    renderQuantitySelector();
    const addButton = elements.getAddToCartButton()
    
    await user.click(addButton!);

    const quantity = elements.getQuantity();
    expect(elements.getIncrementButton()).toBeInTheDocument();
    expect(elements.getDecrementButton()).toBeInTheDocument();
    expect(quantity).toBeInTheDocument();
    expect(quantity).toHaveTextContent('1');
  })


  it('should not render add to cart button after being clicked', async () => {
    renderQuantitySelector();
    const addButton = elements.getAddToCartButton();
    
    await user.click(addButton!);

    expect(addButton).not.toBeInTheDocument();
  })

  it('should increment quantity and decrement quantity after clicking the increment and decrement buttons, respectively', async () => {
    renderQuantitySelector();

    await user.click(elements.getAddToCartButton()!);

    const quantity = elements.getQuantity();
    await user.click(elements.getIncrementButton()!);
    expect(quantity).toHaveTextContent('2');
    await user.click(elements.getDecrementButton()!);
    expect(quantity).toHaveTextContent('1');
  })

  it('should render only add to cart button when the quantity is 1 and the decrement button is clicked', async () => {
    renderQuantitySelector();
    await user.click(elements.getAddToCartButton()!);

    await user.click(elements.getDecrementButton()!);
    
    /* 
      NOTE: This getAddToCartButton call was needed again because the the add to cart button
        was first removed when clicked and then rendered again when decrement button was clicked.
        The first add to cart button is not the exact element as the second add to cart button 
        (which is the one now rendered in the DOM).
    */
    expect(elements.getAddToCartButton()).toBeInTheDocument(); 
    expect(elements.getIncrementButton()).not.toBeInTheDocument();
    expect(elements.getDecrementButton()).not.toBeInTheDocument();
    expect(elements.getQuantity()).not.toBeInTheDocument();
  })
})