type BookTitleProps = {
  title: string;
  variant?: 'list' | 'details';
};

const BookTitleComponent = ({ title, variant = 'list' }: BookTitleProps) => {
  if (variant === 'details') {
    return (
      <h2 className="pr-12 text-xl font-semibold text-neutral-900">{title}</h2>
    );
  }

  return <p className="font-medium text-neutral-900">{title}</p>;
};

export default BookTitleComponent;
