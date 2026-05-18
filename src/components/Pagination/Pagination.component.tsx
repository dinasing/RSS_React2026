type PaginationComponentProps = {
  page: number;
  numFound: number;
  limit: number;
  onPrevious: () => void;
  onNext: () => void;
};

const PaginationComponent = (props: PaginationComponentProps) => {
  const { page, numFound, onPrevious, onNext, limit } = props;
  const totalPages = Math.ceil(numFound / limit);

  const renderPreviousButton = () => (
    <button
      disabled={page === 1}
      onClick={onPrevious}
      className="bg-blue-500 text-white px-2 py-1 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
    >
      Prev
    </button>
  );

  const renderNextButton = () => (
    <button
      disabled={page === totalPages}
      onClick={onNext}
      className="bg-blue-500 text-white px-2 py-1 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
    >
      Next
    </button>
  );

  const renderPageNumber = () => (
    <span className="text-white font-bold text-lg">{page}</span>
  );

  return (
    <div className="flex items-center justify-center gap-2 mt-4">
      {renderPreviousButton()}
      {renderPageNumber()}
      {renderNextButton()}
    </div>
  );
};

export default PaginationComponent;
