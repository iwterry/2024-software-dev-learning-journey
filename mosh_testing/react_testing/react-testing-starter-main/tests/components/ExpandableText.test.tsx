import { render, screen } from "@testing-library/react";
import ExpandableText from "../../src/components/ExpandableText";
import userEvent from "@testing-library/user-event";

describe('ExpandableText', () => {
  const MAX_TEXT_LENGTH = 255;

  it('should render the entire text when text length is less than 255 characters', () => {
    const text = 'a'.repeat(MAX_TEXT_LENGTH - 1);

    render(<ExpandableText text={text} />);

    const elementWithTheText = screen.getByText(text);
    expect(elementWithTheText).toBeInTheDocument();

    const button = screen.queryByRole('button');
    expect(button).not.toBeInTheDocument();
  })

  it('should render the entire text when text length is 255 characters', () => {
    const text = 'a'.repeat(MAX_TEXT_LENGTH);

    render(<ExpandableText text={text} />);

    const elementWithTheText = screen.getByText(text);
    expect(elementWithTheText).toBeInTheDocument();

    const button = screen.queryByRole('button');
    expect(button).not.toBeInTheDocument();
  })

  it('should initially render shorter version of the text when text length exceeds 255 characters and a show more button', () => {
    const text = 'a'.repeat(MAX_TEXT_LENGTH + 1);

    render(<ExpandableText text={text} />);

    const elementWithTheText = screen.getByText('a'.repeat(MAX_TEXT_LENGTH) + '...');
    expect(elementWithTheText).toBeInTheDocument();

    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent(/more/i);
  })

  it('should render correct text and button when the text length exceeds 255 characters when the show more button is clicked', async () => {
    const text = 'a'.repeat(MAX_TEXT_LENGTH + 1);

    render(<ExpandableText text={text} />);

    const button = screen.getByRole('button');
    const user = userEvent.setup();
    await user.click(button);

    const elementWithTheText = screen.getByText(text);
    expect(elementWithTheText).toBeInTheDocument();

    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent(/less/i);
  })

  it('should render correct text and button when the text length exceeds 255 characters when the show less button is clicked', async () => {
    const text = 'a'.repeat(MAX_TEXT_LENGTH + 1);

    render(<ExpandableText text={text} />);

    const button = screen.getByRole('button');
    const user = userEvent.setup();
    await user.click(button);
    await user.click(button);

    const elementWithTheText = screen.getByText('a'.repeat(MAX_TEXT_LENGTH) + '...');
    expect(elementWithTheText).toBeInTheDocument();

    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent(/more/i);
  })
})