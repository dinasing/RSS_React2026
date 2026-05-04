import { Component } from 'react';

class SearchInputComponent extends Component {
  render() {
    return (
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Search for a book"
          className="bg-white rounded-md p-2"
        />
        <button type="button" className="bg-white rounded-md p-2">
          Search
        </button>
      </div>
    );
  }
}

export default SearchInputComponent;
