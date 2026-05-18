type BookTitleProps = {
  title: string;
  variant?: 'list' | 'details';
};

const BookTitleComponent = ({ title, variant = 'list' }: BookTitleProps) => {
  if (variant === 'details') {
    return <h2 className="pr-12 text-xl font-semibold">{title}</h2>;
  }

  return <p className="font-medium">{title}</p>;
};

export default BookTitleComponent;
