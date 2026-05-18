type PageTitleComponentProps = {
  title: string;
};

const PageTitleComponent = ({ title }: PageTitleComponentProps) => {
  return (
    <div className="space-y-2">
      <h1 className="text-3xl font-bold text-white">{title}</h1>
    </div>
  );
};

export default PageTitleComponent;
