import { render, screen } from "@testing-library/react";
import OrderStatusSelector from "../../src/components/OrderStatusSelector";
import { Theme }  from "@radix-ui/themes";
import userEvent from "@testing-library/user-event";
// import ResizeObserver from 'resize-observer-polyfill';



describe('OrderStatusSelector', () => {
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

  const user = userEvent.setup();
  
  it('should render new as the default value', () => {
    render(
      <Theme>
        <OrderStatusSelector onChange={() => {}} />
      </Theme>
    )

    // NOTES:
    //  - without wrapping <OrderStatusSelector /> in <Theme> component, you will get an error "`useThemeContext` must be used within a `Theme`"
    //  - without  window.ResizeObserver = ResizeObserver, you will get an error "ResizeObserver is not defined"

    const button = screen.getByRole('combobox');
    expect(button).toHaveTextContent(/new/i);
  })

  it('should render correct statuses when the combobox is clicked', async () => {
    render(
      <Theme>
        <OrderStatusSelector onChange={() => {}} />
      </Theme>
    )

    // NOTES:
    //  - without wrapping <OrderStatusSelector /> in <Theme> component, you will get an error "`useThemeContext` must be used within a `Theme`"
    //  - without  window.ResizeObserver = ResizeObserver, you will get an error "ResizeObserver is not defined"
    //  - methods hasPointerCapture and scrollIntoView also needed to be mocked and they are shown above

    const button = screen.getByRole('combobox');
    await user.click(button);

    const options = screen.getAllByRole('option');
    expect(options).toHaveLength(3);

    const optionValues = options.map(({ textContent }) => textContent);

    expect(optionValues).toEqual(
      expect.arrayContaining([
        expect.stringMatching(/new/i),
        expect.stringMatching(/fulfilled/i),
        expect.stringMatching(/processed/i)
      ])
    );
  })

  it.each([
    { optionRegEx: /fulfilled/i, expectedOptionValue: 'fulfilled' },
    { optionRegEx: /processed/i, expectedOptionValue: 'processed' }
  ])('should call callback with correct value when option $expectedOptionValue is selected', async ({ optionRegEx, expectedOptionValue }) => {
    const handleChange = vi.fn();

    render(
      <Theme>
        <OrderStatusSelector onChange={handleChange} />
      </Theme>
    )

    // NOTES:
    //  - without wrapping <OrderStatusSelector /> in <Theme> component, you will get an error "`useThemeContext` must be used within a `Theme`"
    //  - without  window.ResizeObserver = ResizeObserver, you will get an error "ResizeObserver is not defined"
    //  - methods hasPointerCapture and scrollIntoView also needed to be mocked and they are shown above

    const button = screen.getByRole('combobox');
    await user.click(button);

    const selectedOption = screen.getByRole('option', { name: optionRegEx });

    await user.click(selectedOption);
    expect(handleChange).toHaveBeenCalledOnce();
    expect(handleChange).toHaveBeenCalledWith(expectedOptionValue);
  })

  
  it('should call callback with correct value when option \'new\' is selected when \'new\' currently selected', async () => {
    const handleChange = vi.fn();

    render(
      <Theme>
        <OrderStatusSelector onChange={handleChange} />
      </Theme>
    )

    // NOTES:
    //  - without wrapping <OrderStatusSelector /> in <Theme> component, you will get an error "`useThemeContext` must be used within a `Theme`"
    //  - without  window.ResizeObserver = ResizeObserver, you will get an error "ResizeObserver is not defined"
    //  - methods hasPointerCapture and scrollIntoView also needed to be mocked and they are shown above
    
    await user.click(screen.getByRole('combobox'));
    await user.click(screen.getByRole('option', { name: /processed/i }));
    await user.click(screen.getByRole('combobox'));
    await user.click(screen.getByRole('option', { name: /new/i }));

    const calls = handleChange.mock.calls;

    expect(calls).toHaveLength(2);
    expect(calls[1]).toEqual(['new']);
  })
})