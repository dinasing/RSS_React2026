import {
  startTransition,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useSearchParams } from 'react-router';
import { getBookDetails } from '../../api/books.api';
import type { BookDetailsType } from '../../types/bookDetails.type';
import { formatBookDescription } from '../../util/bookDescription.util';
import { buildDetailsSearchParams } from '../../util/detailsSearchParam.util';
import ErrorMessageComponent from '../ErrorMessage/ErrorMessage.component';

const getCoverUrl = (coverId: number, size: 'S' | 'M' | 'L' = 'M') =>
  `https://covers.openlibrary.org/b/id/${coverId}-${size}.jpg`;

type BookDetailsPanelProps = {
  workKey: string;
};

const BookDetailsPanelComponent = ({ workKey }: BookDetailsPanelProps) => {
  const [, setSearchParams] = useSearchParams();
  const [bookDetails, setBookDetails] = useState<BookDetailsType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const loadedWorkKeyRef = useRef<string | null>(null);

  const closeDetails = () => {
    setSearchParams((current) => buildDetailsSearchParams(current, null), {
      replace: false,
    });
  };

  const loadDetails = useCallback(async (key: string) => {
    if (loadedWorkKeyRef.current === key) {
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);
    setBookDetails(null);

    try {
      const details = await getBookDetails(key);
      loadedWorkKeyRef.current = key;
      setBookDetails(details);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Cannot load book details. Please try again.';
      setErrorMessage(message);
      loadedWorkKeyRef.current = null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    startTransition(() => {
      void loadDetails(workKey);
    });
  }, [loadDetails, workKey]);

  const description = formatBookDescription(bookDetails?.description);
  const coverId = bookDetails?.covers?.[0];

  return (
    <section
      className="relative flex h-full min-h-[320px] flex-col gap-4 rounded-md bg-white p-4 text-neutral-900"
      aria-label="Book details"
      onClick={(event) => event.stopPropagation()}
    >
      <button
        type="button"
        className="absolute top-3 right-3 rounded px-2 py-1 text-sm font-medium text-neutral-700 hover:bg-neutral-100"
        aria-label="Close details"
        onClick={closeDetails}
      >
        Close
      </button>

      {isLoading ? (
        <p className="mt-8 text-center text-neutral-600 italic">
          Loading book details...
        </p>
      ) : null}

      {errorMessage ? <ErrorMessageComponent message={errorMessage} /> : null}

      {!isLoading && !errorMessage && bookDetails ? (
        <div className="mt-6 flex flex-col gap-4">
          {coverId ? (
            <img
              src={getCoverUrl(coverId)}
              alt=""
              className="h-[180px] w-[120px] self-center rounded object-cover bg-neutral-100"
            />
          ) : null}
          <h2 className="pr-12 text-xl font-semibold">{bookDetails.title}</h2>
          {bookDetails.first_publish_date ? (
            <p className="text-sm text-neutral-600">
              First published: {bookDetails.first_publish_date}
            </p>
          ) : null}
          {description ? (
            <p className="text-sm leading-relaxed">{description}</p>
          ) : (
            <p className="text-sm text-neutral-600">
              No description available.
            </p>
          )}
          {bookDetails.subjects && bookDetails.subjects.length > 0 ? (
            <p className="text-sm text-neutral-600">
              Subjects: {bookDetails.subjects.slice(0, 8).join(', ')}
            </p>
          ) : null}
        </div>
      ) : null}
    </section>
  );
};

export default BookDetailsPanelComponent;
