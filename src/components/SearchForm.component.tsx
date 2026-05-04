import { Component } from 'react';

type SearchFormComponentProps = {
  handleSearch: (query: string) => void;
  query: string | null;
};

class SearchFormComponent extends Component<SearchFormComponentProps> {
  constructor(props: SearchFormComponentProps) {
    super(props);
    this.search = this.search.bind(this);
  }

  search(formData: FormData): void {
    const query = formData.get('query');
    this.props.handleSearch(typeof query === 'string' ? query : '');
  }

  render() {
    const { query } = this.props;

    return (
      <form name="search-form" action={this.search} className="flex gap-2">
        <input
          type="text"
          placeholder="Search for a book"
          className="bg-white rounded-md p-2"
          name="query"
          defaultValue={query ?? ''}
          maxLength={100}
        />
        <button
          type="submit"
          className="bg-white rounded-md p-2"
          aria-label="Search for a book"
        >
          Search
        </button>
      </form>
    );
  }
}

export default SearchFormComponent;
