import type { SearchResultItemType } from '../../types/searchResultItem.type';
import BookCoverComponent from '../BookCover/BookCover.component';
import BookTitleComponent from '../BookTitle/BookTitle.component';

type SearchResultItemProps = {
  searchResultItem: SearchResultItemType;
  isSelected?: boolean;
  onSelect: (workKey: string) => void;
};

const SearchResultItemComponent = ({
  searchResultItem,
  isSelected = false,
  onSelect,
}: SearchResultItemProps) => {
  const { title, author_name, first_publish_year, cover_i } = searchResultItem;

  const renderAuthorName = () => (
    <p className="text-neutral-600">
      {author_name?.join(', ') || 'Unknown author'}
    </p>
  );

  const renderFirstPublishYear = () => (
    <p>({first_publish_year || 'Unknown year'})</p>
  );

  return (
    <button
      type="button"
      onClick={(event) => {
        event.stopPropagation();
        onSelect(searchResultItem.key);
      }}
      aria-pressed={isSelected}
      className={`w-full cursor-pointer rounded-md bg-white p-4 text-left
          flex flex-row items-center justify-between gap-4
          ${isSelected ? 'ring-2 ring-blue-500' : ''}`}
    >
      <div className="grid grid-cols-[80px_1fr] gap-2">
        <div>
          <BookCoverComponent coverId={cover_i} />
        </div>
        <div>
          <BookTitleComponent title={title} />
          {renderAuthorName()}
          {renderFirstPublishYear()}
        </div>
      </div>
    </button>
  );
};

export default SearchResultItemComponent;
