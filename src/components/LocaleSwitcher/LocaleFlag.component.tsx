import type { Locale } from '../../i18n/config';

type LocaleFlagProps = {
  locale: Locale;
  className?: string;
};

const UsFlag = ({ className }: { className?: string }) => (
  <svg
    aria-hidden="true"
    className={className}
    viewBox="0 0 24 16"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect width="24" height="16" fill="#B22234" />
    <rect y="1.23" width="24" height="1.23" fill="#fff" />
    <rect y="3.69" width="24" height="1.23" fill="#fff" />
    <rect y="6.15" width="24" height="1.23" fill="#fff" />
    <rect y="8.62" width="24" height="1.23" fill="#fff" />
    <rect y="11.08" width="24" height="1.23" fill="#fff" />
    <rect y="13.54" width="24" height="1.23" fill="#fff" />
    <rect width="9.6" height="8.62" fill="#3C3B6E" />
    <circle cx="1.6" cy="1.44" r="0.55" fill="#fff" />
    <circle cx="3.2" cy="1.44" r="0.55" fill="#fff" />
    <circle cx="4.8" cy="1.44" r="0.55" fill="#fff" />
    <circle cx="6.4" cy="1.44" r="0.55" fill="#fff" />
    <circle cx="8" cy="1.44" r="0.55" fill="#fff" />
    <circle cx="2.4" cy="2.88" r="0.55" fill="#fff" />
    <circle cx="4" cy="2.88" r="0.55" fill="#fff" />
    <circle cx="5.6" cy="2.88" r="0.55" fill="#fff" />
    <circle cx="7.2" cy="2.88" r="0.55" fill="#fff" />
    <circle cx="1.6" cy="4.31" r="0.55" fill="#fff" />
    <circle cx="3.2" cy="4.31" r="0.55" fill="#fff" />
    <circle cx="4.8" cy="4.31" r="0.55" fill="#fff" />
    <circle cx="6.4" cy="4.31" r="0.55" fill="#fff" />
    <circle cx="8" cy="4.31" r="0.55" fill="#fff" />
    <circle cx="2.4" cy="5.75" r="0.55" fill="#fff" />
    <circle cx="4" cy="5.75" r="0.55" fill="#fff" />
    <circle cx="5.6" cy="5.75" r="0.55" fill="#fff" />
    <circle cx="7.2" cy="5.75" r="0.55" fill="#fff" />
    <circle cx="1.6" cy="7.18" r="0.55" fill="#fff" />
    <circle cx="3.2" cy="7.18" r="0.55" fill="#fff" />
    <circle cx="4.8" cy="7.18" r="0.55" fill="#fff" />
    <circle cx="6.4" cy="7.18" r="0.55" fill="#fff" />
    <circle cx="8" cy="7.18" r="0.55" fill="#fff" />
  </svg>
);

const RuFlag = ({ className }: { className?: string }) => (
  <svg
    aria-hidden="true"
    className={className}
    viewBox="0 0 24 16"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect width="24" height="5.33" fill="#fff" />
    <rect y="5.33" width="24" height="5.33" fill="#0039A6" />
    <rect y="10.67" width="24" height="5.33" fill="#D52B1E" />
  </svg>
);

const LocaleFlag = ({ locale, className = 'h-4 w-6' }: LocaleFlagProps) => {
  if (locale === 'ru') {
    return <RuFlag className={className} />;
  }

  return <UsFlag className={className} />;
};

export default LocaleFlag;
