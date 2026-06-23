import { render, screen } from '@testing-library/react';
import PageTitleComponent from './PageTitle.component';

describe('PageTitleComponent', () => {
  it('renders the title as a heading', () => {
    const title = 'Book search!';
    render(<PageTitleComponent title={title} />);

    expect(
      screen.getByRole('heading', { level: 1, name: title })
    ).toBeInTheDocument();
  });
});
