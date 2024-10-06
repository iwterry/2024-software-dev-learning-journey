import { render, screen } from "@testing-library/react";
import { User } from "@auth0/auth0-react";
import { useAuth0 } from "@auth0/auth0-react";
import AuthStatus from "../../src/components/AuthStatus";


vi.mock('@auth0/auth0-react');

type AuthState = {
  user?: User;
  isAuthenticated?: boolean;
  isLoading?: boolean;
}

describe('AuthStatus', () => {
  const setMockedUseAuth0 = (authState?: AuthState) => {
    const defaultAuthState: AuthState = {
      user: undefined,
      isAuthenticated: false,
      isLoading: false
    };

    vi.mocked(useAuth0).mockReturnValue({
      user: authState?.user || defaultAuthState.user,
      isLoading: authState?.isLoading || defaultAuthState.isLoading!,
      isAuthenticated: authState?.isAuthenticated || defaultAuthState.isAuthenticated!,
      // the below properties are needed for mocking purposes are not needed by this application and not used during testing
      getAccessTokenSilently: vi.fn().mockResolvedValue(''),
      getAccessTokenWithPopup: vi.fn(),
      getIdTokenClaims: vi.fn(),
      loginWithRedirect: vi.fn(),
      loginWithPopup: vi.fn(),
      logout: vi.fn(),
      handleRedirectCallback: vi.fn()
    })
  } 

  it('should render loading message while getting the authentication status', () => {
    setMockedUseAuth0({ isLoading: true });

    render(<AuthStatus />);

    const loadingText = screen.getByText('loading', { exact: false });
    expect(loadingText).toBeInTheDocument();
  })

  it('should render username and logout button when authenticated user', () => {
    setMockedUseAuth0({ isAuthenticated: true, user: { name: 'Test User' } });

    render(<AuthStatus />);

    const usernameText = screen.getByText('Test User', { exact: false });
    const logoutButton = screen.getByRole('button', {name: /log out/i});
    const loginButton = screen.queryByRole('button', {name: /log in/i});

    expect(usernameText).toBeInTheDocument();
    expect(logoutButton).toBeInTheDocument();
    expect(loginButton).not.toBeInTheDocument();
  })

  it('should render login button when unauthenticated user', () => {
    setMockedUseAuth0();

    render(<AuthStatus />);

    const logoutButton = screen.queryByRole('button', {name: /log out/i});
    const loginButton = screen.getByRole('button', {name: /log in/i});

    expect(logoutButton).not.toBeInTheDocument();
    expect(loginButton).toBeInTheDocument();
  })
})