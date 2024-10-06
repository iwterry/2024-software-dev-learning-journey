import { render, screen } from "@testing-library/react";
import UserAccount from "../../src/components/UserAccount";
import { User } from "../../src/entities";

describe('UserAccount', () => {
  it('should render the edit button when user is an admin', () => {
    const user: User = {
      id: 1,
      name: 'testUser',
      isAdmin: true
    };

    render(<UserAccount user={user}/>);

    const button = screen.getByRole('button');

    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent(/edit/i);
  })

  it('should not render the edit button when user is not an admin', () => {
    const user: User = {
      id: 1,
      name: 'testUser',
      isAdmin: false
    };

    render(<UserAccount user={user}/>);

    const button = screen.queryByRole('button');

    // expect(button).toBeNull();

    expect(button).not.toBeInTheDocument();
  })

  it('should render the username', () => {
    const user: User = {
      id: 1,
      name: 'testUser',
      isAdmin: false
    };

    render(<UserAccount user={user}/>);

    const elementWithUsername = screen.queryByText(/testuser/i);

    expect(elementWithUsername).toBeInTheDocument();

  })
})