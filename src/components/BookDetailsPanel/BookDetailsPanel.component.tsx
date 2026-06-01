import { useSearchParams } from 'react-router';
import { THEME_DARK, useTheme } from '../../context/Theme/Theme.shared';
import { booksApi, useGetBookDetailsQuery } from '../../store/api/booksApi';
import { useAppDispatch } from '../../store/hooks';
import { formatBookDescription } from '../../util/bookDescription.util';
import { buildDetailsSearchParams } from '../../util/detailsSearchParam.util';
import { getQueryErrorMessage } from '../../util/queryError.util';
import BookCoverComponent from '../BookCover/BookCover.component';
import BookTitleComponent from '../BookTitle/BookTitle.component';
import ErrorMessageComponent from '../ErrorMessage/ErrorMessage.component';

type BookDetailsPanelProps = {
  workKey: string;
};

const BookDetailsPanelComponent = ({ workKey }: BookDetailsPanelProps) => {
  const dispatch = useAppDispatch();
  const { theme } = useTheme();
  const isDarkTheme = theme === THEME_DARK;
  const [, setSearchParams] = useSearchParams();
  const {
    data: bookDetails,
    isLoading,
    isFetching,
    error,
    refetch,
  } = useGetBookDetailsQuery(workKey);

  const showLoader = isLoading || (isFetching && !bookDetails);
  const errorMessage = getQueryErrorMessage(
    error,
    'Cannot load book details. Please try again.'
  );

  const closeDetails = () => {
    setSearchParams((current) => buildDetailsSearchParams(current, null), {
      replace: false,
    });
  };

  const handleRefresh = () => {
    dispatch(
      booksApi.util.invalidateTags([{ type: 'BookDetails', id: workKey }])
    );
    void refetch();
  };

  const closeButtonClassName = isDarkTheme
    ? 'text-white hover:bg-white/10'
    : 'text-neutral-700 hover:bg-neutral-100';
  const mutedTextClassName = isDarkTheme ? 'text-blue-100' : 'text-neutral-600';
  const panelClassName = isDarkTheme
    ? 'bg-flannel-dark text-white'
    : 'bg-white text-neutral-900';

  const renderHeaderActions = () => (
    <div className="absolute top-3 right-3 flex items-center gap-2">
      <button
        type="button"
        className={`rounded px-2 py-1 text-sm font-medium ${closeButtonClassName}`}
        aria-label="Refresh details"
        onClick={handleRefresh}
      >
        Refresh
      </button>
      <button
        type="button"
        className={`rounded px-2 py-1 text-sm font-medium ${closeButtonClassName}`}
        aria-label="Close details"
        onClick={closeDetails}
      >
        Close
      </button>
    </div>
  );

  const renderLoader = () =>
    showLoader ? (
      <p className={`mt-8 text-center italic ${mutedTextClassName}`}>
        Loading book details...
      </p>
    ) : null;

  const renderError = () =>
    errorMessage ? <ErrorMessageComponent message={errorMessage} /> : null;

  const renderPublishDate = (firstPublishDate?: string) =>
    firstPublishDate ? (
      <p className={`text-sm ${mutedTextClassName}`}>
        First published: {firstPublishDate}
      </p>
    ) : null;

  const renderDescription = (description: string | null) =>
    description ? (
      <p className="text-sm leading-relaxed">{description}</p>
    ) : (
      <p className={`text-sm ${mutedTextClassName}`}>
        No description available.
      </p>
    );

  const renderSubjects = (subjects?: string[]) =>
    subjects && subjects.length > 0 ? (
      <p className={`text-sm ${mutedTextClassName}`}>
        Subjects: {subjects.slice(0, 8).join(', ')}
      </p>
    ) : null;

  const renderContent = () => {
    if (showLoader || errorMessage || !bookDetails) {
      return null;
    }

    const description = formatBookDescription(bookDetails.description);
    const coverId = bookDetails.covers?.[0];

    return (
      <div className="mt-6 flex flex-col gap-4">
        <BookCoverComponent
          coverId={coverId}
          imageClassName="h-[180px] w-[120px] self-center rounded object-cover bg-neutral-100"
          placeholderClassName="h-[180px] w-[120px] self-center rounded"
        />
        <BookTitleComponent
          title={bookDetails.title}
          variant="details"
          className={isDarkTheme ? 'text-white' : undefined}
        />
        {renderPublishDate(bookDetails.first_publish_date)}
        {renderDescription(description)}
        {renderSubjects(bookDetails.subjects)}
      </div>
    );
  };

  return (
    <section
      className={`relative flex h-full min-h-[320px] flex-col gap-4 rounded-md p-4 ${panelClassName}`}
      aria-label="Book details"
      onClick={(event) => event.stopPropagation()}
    >
      {renderHeaderActions()}
      {renderLoader()}
      {renderError()}
      {renderContent()}
    </section>
  );
};

export default BookDetailsPanelComponent;
