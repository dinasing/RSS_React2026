'use client';

import { useTranslations } from 'next-intl';
import { trimQuery } from '../../util/trimQuery.util';

type SearchFormComponentProps = {
  handleSearch: (query: string) => void;
  query: string | null;
};

const SearchFormComponent = ({
  handleSearch,
  query,
}: SearchFormComponentProps) => {
  const t = useTranslations('SearchForm');

  const search = (formData: FormData): void => {
    handleSearch(trimQuery(formData.get('query')));
  };

  return (
    <form name="search-form" action={search} className="flex gap-2">
      <input
        type="text"
        placeholder={t('placeholder')}
        className="bg-white rounded-md p-2"
        name="query"
        defaultValue={query ?? ''}
        maxLength={100}
      />
      <button
        type="submit"
        className="bg-white text-neutral-900 rounded-md p-2"
        aria-label={t('submitAriaLabel')}
      >
        {t('submit')}
      </button>
    </form>
  );
};

export default SearchFormComponent;
