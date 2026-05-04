import { Component } from 'react';
import type { SearchResultItemType } from '../types/searchResultItem.type';

class SearchResultItemComponent extends Component<{
  searchResultItem: SearchResultItemType;
}> {
  renderTitle() {
    const { title } = this.props.searchResultItem;
    return <p className="font-medium">{title}</p>;
  }

  renderAuthorName() {
    const { author_name } = this.props.searchResultItem;
    return (
      <p className="text-neutral-600">
        {author_name?.join(', ') || 'Unknown author'}
      </p>
    );
  }

  renderFirstPublishYear() {
    const { first_publish_year } = this.props.searchResultItem;
    return <p>({first_publish_year || 'Unknown year'})</p>;
  }

  renderCover() {
    const { cover_i } = this.props.searchResultItem;
    const cover = cover_i ? this.getCover(cover_i) : '📖';
    return (
      <img
        src={cover}
        alt="Book cover"
        className="w-[80px] h-[120px] object-cover rounded shrink-0"
      />
    );
  }

  getCover = (cover_i, size = 'M') =>
    `https://covers.openlibrary.org/b/id/${cover_i}-${size}.jpg`;

  render() {
    return (
      <div
        className="p-4 bg-white rounded-md
          flex flex-row justify-between
          items-center gap-4"
      >
        <div className="grid grid-cols-[80px_1fr] gap-2">
          <div className="">{this.renderCover()}</div>
          <div className="">
            {this.renderTitle()}
            {this.renderAuthorName()}
            {this.renderFirstPublishYear()}
          </div>
        </div>
      </div>
    );
  }
}

export default SearchResultItemComponent;
