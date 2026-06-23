import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithIntl } from '../../test-utils/renderWithIntl';
import SearchFormComponent from './SearchForm.component';

describe('SearchFormComponent', () => {
  it('renders search input and submit button', () => {
    const handleSearch = vi.fn();
    renderWithIntl(
      <SearchFormComponent query="" handleSearch={handleSearch} />
    );

    expect(
      screen.getByPlaceholderText(/search for a book/i)
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /search for a book/i })
    ).toBeInTheDocument();
  });

  it('shows saved query in the input on mount', () => {
    const handleSearch = vi.fn();
    renderWithIntl(
      <SearchFormComponent query="saved term" handleSearch={handleSearch} />
    );

    expect(screen.getByDisplayValue('saved term')).toBeInTheDocument();
  });

  it('updates input when the user types', async () => {
    const user = userEvent.setup();
    const handleSearch = vi.fn();
    renderWithIntl(
      <SearchFormComponent query="" handleSearch={handleSearch} />
    );

    const input = screen.getByPlaceholderText(/search for a book/i);
    await user.type(input, 'react');

    expect(input).toHaveValue('react');
  });

  it('calls handleSearch with trimmed query on submit', async () => {
    const user = userEvent.setup();
    const handleSearch = vi.fn();
    renderWithIntl(
      <SearchFormComponent query="" handleSearch={handleSearch} />
    );

    await user.type(
      screen.getByPlaceholderText(/search for a book/i),
      '  react  '
    );
    await user.click(
      screen.getByRole('button', { name: /search for a book/i })
    );

    expect(handleSearch).toHaveBeenCalledTimes(1);
    expect(handleSearch).toHaveBeenCalledWith('react');
  });

  it('calls handleSearch with empty string for whitespace-only input', async () => {
    const user = userEvent.setup();
    const handleSearch = vi.fn();
    renderWithIntl(
      <SearchFormComponent query="" handleSearch={handleSearch} />
    );

    await user.type(screen.getByPlaceholderText(/search for a book/i), '   ');
    await user.click(
      screen.getByRole('button', { name: /search for a book/i })
    );

    expect(handleSearch).toHaveBeenCalledWith('');
  });

  it('treats null query as empty default value', () => {
    const handleSearch = vi.fn();
    renderWithIntl(
      <SearchFormComponent query={null} handleSearch={handleSearch} />
    );

    expect(screen.getByPlaceholderText(/search for a book/i)).toHaveValue('');
  });
});
