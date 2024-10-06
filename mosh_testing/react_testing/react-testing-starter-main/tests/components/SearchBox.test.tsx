import { render, screen } from "@testing-library/react";
import SearchBox from "../../src/components/SearchBox";
import userEvent from "@testing-library/user-event";

describe('SearchBox', () => {
  it('should render the correct text input', () => {
    const handleChange = () => { };
    render(<SearchBox onChange={handleChange} />);

    const inputTextElement = screen.getByPlaceholderText(/search/i)

    expect(inputTextElement).toBeInTheDocument();
  });

  it('should call the callback when the enter key is pressed and some text is in the searchbox', async () => {
    const mockedCallback = vi.fn();

    render(<SearchBox onChange={mockedCallback} />);

    const inputTextElement = screen.getByRole('textbox');
    const user = userEvent.setup();
    await user.type(inputTextElement, 'test{Enter}');
   
    expect(mockedCallback).toHaveBeenCalledOnce();
    expect(mockedCallback).toHaveBeenCalledWith('test');
  });

  it('should not call the callback when the enter key is pressed and no text is in the searchbox', async () => {
    const mockedCallback = vi.fn();

    render(<SearchBox onChange={mockedCallback} />);

    const inputTextElement = screen.getByRole('textbox');
    const user = userEvent.setup();
    await user.type(inputTextElement, '{Enter}');
   
    expect(mockedCallback).not.toHaveBeenCalled()
  });
})