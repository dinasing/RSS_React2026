import type { SearchResultItemType } from '../../types/searchResultItem.type';
import BookCoverComponent from '../BookCover/BookCover.component';
import BookTitleComponent from '../BookTitle/BookTitle.component';

type SearchResultItemProps = {
  searchResultItem: SearchResultItemType;
  isSelected?: boolean;
  onToggleSelect: (item: SearchResultItemType) => void;
  onOpenDetails: (workKey: string) => void;
};

const SearchResultItemComponent = ({
  searchResultItem,
  isSelected = false,
  onToggleSelect,
  onOpenDetails,
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
    <article
      className={`w-full rounded-md bg-white p-4 text-left
          flex flex-row items-start gap-4
          ${isSelected ? 'ring-2 ring-blue-500' : ''}`}
    >
      <input
        type="checkbox"
        checked={isSelected}
        aria-label={`Select ${title}`}
        className="h-4 w-4 cursor-pointer"
        onClick={(event) => event.stopPropagation()}
        onChange={(event) => {
          event.stopPropagation();
          onToggleSelect(searchResultItem);
        }}
      />
      <button
        type="button"
        onClick={(event) => {
          event.stopPropagation();
          onOpenDetails(searchResultItem.key);
        }}
        className="grid flex-1 cursor-pointer grid-cols-[80px_1fr] gap-2 text-left"
      >
        <div aria-hidden="true">
          <BookCoverComponent coverId={cover_i} />
        </div>
        <div>
          <BookTitleComponent title={title} />
          {renderAuthorName()}
          {renderFirstPublishYear()}
        </div>
      </button>
    </article>
  );
};

export default SearchResultItemComponent;
