import { useState } from 'react';

const ErrorButtonComponent = () => {
  const [triggerCrash, setTriggerCrash] = useState(false);

  if (triggerCrash) {
    throw new Error('You clicked the button to see the error!');
  }

  return (
    <button
      type="button"
      onClick={() => setTriggerCrash(true)}
      className="bg-red-800 text-white rounded-md p-2"
    >
      Click to see the Error!
    </button>
  );
};

export default ErrorButtonComponent;
