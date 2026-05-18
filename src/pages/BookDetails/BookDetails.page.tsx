import { useSearchParams } from 'react-router';
import BookDetailsPanelComponent from '../../components/BookDetailsPanel/BookDetailsPanel.component';
import { fromDetailsParam } from '../../util/detailsSearchParam.util';

const BookDetailsPage = () => {
  const [searchParams] = useSearchParams();
  const workKey = fromDetailsParam(searchParams.get('details'));

  if (!workKey) {
    return null;
  }

  return <BookDetailsPanelComponent key={workKey} workKey={workKey} />;
};

export default BookDetailsPage;
