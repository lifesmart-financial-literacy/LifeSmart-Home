import { render, screen } from '@testing-library/react';
import App from './App';

test('renders home screen with Sign In', () => {
  render(<App />);
  const signInButton = screen.getByText(/sign in/i);
  expect(signInButton).toBeInTheDocument();
});
