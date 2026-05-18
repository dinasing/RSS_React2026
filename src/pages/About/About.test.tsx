import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import About from './About.page';

describe('AboutPage', () => {
  it('renders page title, external links, and go home link', () => {
    render(
      <MemoryRouter>
        <About />
      </MemoryRouter>
    );

    expect(
      screen.getByRole('heading', { name: /about page/i })
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /open library/i })).toHaveAttribute(
      'href',
      'https://openlibrary.org/'
    );
    expect(screen.getByRole('link', { name: /github/i })).toHaveAttribute(
      'href',
      'https://github.com/dinasing'
    );
    expect(
      screen.getByRole('link', { name: /rss react 2026 course/i })
    ).toHaveAttribute('href', 'https://rs.school/courses/reactjs');
    expect(
      screen.getByRole('link', { name: /go back to the home page/i })
    ).toHaveAttribute('href', '/');
  });
});
