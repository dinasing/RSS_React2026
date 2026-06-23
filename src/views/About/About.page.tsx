'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import GoHome from '../../components/GoHome/GoHome.component';

const AboutPage = () => {
  const t = useTranslations('About');
  const linkClassName =
    'text-blue-500 hover:text-blue-600 bg-white px-2 py-1 rounded-md';

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-bold">{t('title')}</h1>
      <p className="text-lg">
        {t.rich('description', {
          openLibraryLink: (chunks) => (
            <Link className={linkClassName} href="https://openlibrary.org/">
              {chunks}
            </Link>
          ),
        })}
      </p>
      <p className="text-md">
        {t.rich('author', {
          githubLink: (chunks) => (
            <Link className={linkClassName} href="https://github.com/dinasing">
              {chunks}
            </Link>
          ),
        })}
      </p>
      <p className="text-lg">
        {t.rich('course', {
          courseLink: (chunks) => (
            <Link
              className={linkClassName}
              href="https://rs.school/courses/reactjs"
            >
              {chunks}
            </Link>
          ),
        })}
      </p>
      <GoHome />
    </div>
  );
};

export default AboutPage;
