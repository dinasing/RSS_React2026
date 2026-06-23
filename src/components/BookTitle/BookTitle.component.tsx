type BookTitleProps = {
  title: string;
  variant?: 'list' | 'details';
  className?: string;
};

const BookTitleComponent = ({
  title,
  variant = 'list',
  className,
}: BookTitleProps) => {
  if (variant === 'details') {
    return (
      <h2
        className={`pr-12 text-xl font-semibold ${className ?? 'text-neutral-900'}`}
      >
        {title}
      </h2>
    );
  }

  return (
    <p className={`font-medium ${className ?? 'text-neutral-900'}`}>{title}</p>
  );
};

export default BookTitleComponent;
