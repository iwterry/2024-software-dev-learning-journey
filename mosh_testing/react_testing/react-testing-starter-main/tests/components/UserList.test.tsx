import { render, screen } from '@testing-library/react';
import { User } from '../../src/entities';
import UserList from '../../src/components/UserList';

describe('UserList', () => {
  it('should render no users when the users array is empty', () => {
    const users:User[] = [];

    render(<UserList users={users} />);

    const element = screen.getByText(/no users/i);

    expect(element).toBeInTheDocument();
  });
  it('should render a list of users when there is a user in the users array', () => {
    const users:User[] = [
      {
        id: 1,
        name: 'testUser1',
        isAdmin: true
      },
      {
        id: 2,
        name: 'testUser2',
        isAdmin: false
      }
    ];

    render(<UserList users={users} />);

    users.forEach((user) => {
      const link = screen.getByRole('link', { name: new RegExp(user.name, 'i') });
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute('href', `/users/${user.id}`)
    })
  });
})