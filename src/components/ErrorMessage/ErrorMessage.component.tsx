type ErrorMessageComponentProps = {
  message: string;
};

const ErrorMessageComponent = ({ message }: ErrorMessageComponentProps) => (
  <div
    role="alert"
    className="rounded-md border border-red-300 bg-red-50 p-4 text-red-900"
  >
    {message}
  </div>
);

export default ErrorMessageComponent;
