import { useState } from 'react';
import type { SearchResultItemType } from '../../types/searchResultItem.type';

type SearchResultItemProps = {
  searchResultItem: SearchResultItemType;
};

const getCover = (cover_i: number, size: 'S' | 'M' | 'L' = 'M') =>
  `https://covers.openlibrary.org/b/id/${cover_i}-${size}.jpg`;

const SearchResultItemComponent = ({
  searchResultItem,
}: SearchResultItemProps) => {
  const [failedCoverId, setFailedCoverId] = useState<number | null>(null);
  const { title, author_name, first_publish_year, cover_i } = searchResultItem;
  const coverLoadFailed = cover_i != null && failedCoverId === cover_i;

  const renderTitle = () => <p className="font-medium">{title}</p>;

  const renderAuthorName = () => (
    <p className="text-neutral-600">
      {author_name?.join(', ') || 'Unknown author'}
    </p>
  );

  const renderFirstPublishYear = () => (
    <p>({first_publish_year || 'Unknown year'})</p>
  );

  const renderCover = () => {
    const coverUrl = cover_i ? getCover(cover_i) : null;
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
        onError={() => setFailedCoverId(cover_i ?? null)}
      />
    );
  };

  return (
    <div
      className="p-4 bg-white rounded-md
          flex flex-row justify-between
          items-center gap-4"
    >
      <div className="grid grid-cols-[80px_1fr] gap-2">
        <div>{renderCover()}</div>
        <div>
          {renderTitle()}
          {renderAuthorName()}
          {renderFirstPublishYear()}
        </div>
      </div>
    </div>
  );
};

export default SearchResultItemComponent;
