'use client';

import BookDetailsPanelComponent from '../../components/BookDetailsPanel/BookDetailsPanel.component';
import { useSearchParamsState } from '../../hooks/useSearchParamsState/useSearchParamsState.hook';
import { fromDetailsParam } from '../../util/detailsSearchParam.util';

const BookDetailsPage = () => {
  const [searchParams] = useSearchParamsState();
  const workKey = fromDetailsParam(searchParams.get('details'));

  if (!workKey) {
    return null;
  }

  return <BookDetailsPanelComponent key={workKey} workKey={workKey} />;
};

export default BookDetailsPage;
