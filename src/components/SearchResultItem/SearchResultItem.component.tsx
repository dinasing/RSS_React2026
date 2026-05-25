import { THEME_DARK, useTheme } from '../../context/Theme/Theme.shared';
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
  const { theme } = useTheme();
  const isDarkTheme = theme === THEME_DARK;
  const { title, author_name, first_publish_year, cover_i } = searchResultItem;

  const cardClassName = isDarkTheme
    ? 'bg-flannel-solid text-white'
    : 'bg-white text-neutral-900';
  const authorClassName = isDarkTheme ? 'text-blue-100' : 'text-neutral-600';
  const yearClassName = isDarkTheme ? 'text-blue-50' : 'text-neutral-700';

  const renderAuthorName = () => (
    <p className={authorClassName}>
      {author_name?.join(', ') || 'Unknown author'}
    </p>
  );

  const renderFirstPublishYear = () => (
    <p className={yearClassName}>({first_publish_year || 'Unknown year'})</p>
  );

  return (
    <article
      className={`relative w-full rounded-md p-4 text-left
          ${cardClassName}
          ${isSelected ? 'ring-2 ring-blue-500' : ''}`}
    >
      <input
        type="checkbox"
        checked={isSelected}
        aria-label={`Select ${title}`}
        className="absolute top-4 right-4 z-10 h-4 w-4 cursor-pointer"
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
        className="grid w-full cursor-pointer grid-cols-[80px_1fr] gap-2 pr-8 text-left"
      >
        <div aria-hidden="true">
          <BookCoverComponent coverId={cover_i} />
        </div>
        <div>
          <BookTitleComponent
            title={title}
            className={isDarkTheme ? 'text-white' : undefined}
          />
          {renderAuthorName()}
          {renderFirstPublishYear()}
        </div>
      </button>
    </article>
  );
};

export default SearchResultItemComponent;
