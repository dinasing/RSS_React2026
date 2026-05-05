import { Component } from 'react';
import type { SearchResultItemType } from '../types/searchResultItem.type';

type SearchResultItemProps = {
  searchResultItem: SearchResultItemType;
};

type SearchResultItemState = {
  coverLoadFailed: boolean;
};

class SearchResultItemComponent extends Component<
  SearchResultItemProps,
  SearchResultItemState
> {
  state: SearchResultItemState = { coverLoadFailed: false };

  componentDidUpdate(prevProps: SearchResultItemProps) {
    if (
      prevProps.searchResultItem.cover_i !== this.props.searchResultItem.cover_i
    ) {
      this.setState({ coverLoadFailed: false });
    }
  }
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
    const coverUrl = cover_i ? this.getCover(cover_i) : null;
    const { coverLoadFailed } = this.state;

    const sizeClass = 'w-[80px] h-[120px] rounded shrink-0';

    if (!coverUrl || coverLoadFailed) {
      return (
        <div
          className={`${sizeClass} flex items-center justify-center bg-neutral-100 text-4xl`}
        >
          📖
        </div>
      );
    }

    return (
      <img
        src={coverUrl}
        alt="Book cover"
        className={`${sizeClass} object-cover bg-neutral-100`}
        onError={() => this.setState({ coverLoadFailed: true })}
      />
    );
  }

  getCover = (cover_i: number, size: 'S' | 'M' | 'L' = 'M') =>
    `https://covers.openlibrary.org/b/id/${cover_i}-${size}.jpg`;

  render() {
    return (
      <div
        className="p-4 bg-white rounded-md
          flex flex-row justify-between
          items-center gap-4"
      >
        <div className="grid grid-cols-[80px_1fr] gap-2">
          <div>{this.renderCover()}</div>
          <div>
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
