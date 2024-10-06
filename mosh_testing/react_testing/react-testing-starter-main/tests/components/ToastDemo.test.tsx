import { render, screen, waitFor } from "@testing-library/react";
import ToastDemo from "../../src/components/ToastDemo";
import userEvent from "@testing-library/user-event";
import { Toaster } from "react-hot-toast";

describe('ToastDemo', () => {
  it('should render a button', () => {
    render(<ToastDemo />);

    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent(/toast/i);

    const successText = screen.queryByText(/success/i);
    expect(successText).not.toBeInTheDocument();
  })

  it('should show success toast when button is clicked', async () => {
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

    // NOTE: without mocking matchMedia, you will get an error "matchMedia is not a function"

    render(
      <>
        <ToastDemo />
        <Toaster />
      </>
    );

    const button = screen.getByRole('button');
    const user = userEvent.setup();

    await user.click(button);

    await waitFor(() => {
      const successText = screen.getByText(/success/i);
      expect(successText).toBeInTheDocument();
    });
  })


})