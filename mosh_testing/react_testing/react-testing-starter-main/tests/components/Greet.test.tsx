import { render, screen } from "@testing-library/react";
import Greet from "../../src/components/Greet";


describe('Greet', () => {
  it('should render the name provided when the name is not an empty string', () => {
    render(<Greet name="Mosh" />);
    screen.debug(); // used to see the state of the DOM
    const heading = screen.getByRole('heading');
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent(/mosh/i);
  })
  it('should render login button when name is an empty string', () => {
    render(<Greet name="" />);
  
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent(/login/i);
  })
})