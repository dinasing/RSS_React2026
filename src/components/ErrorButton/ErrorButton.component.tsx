import { Component } from 'react';

type ErrorButtonComponentState = {
  triggerCrash: boolean;
};

class ErrorButtonComponent extends Component<
  object,
  ErrorButtonComponentState
> {
  state: ErrorButtonComponentState = { triggerCrash: false };

  render() {
    if (this.state.triggerCrash) {
      throw new Error('You clicked the button to see the error!');
    }

    return (
      <button
        type="button"
        onClick={() => this.setState({ triggerCrash: true })}
        className="bg-red-800 text-white rounded-md p-2"
      >
        Click to see the Error!
      </button>
    );
  }
}

export default ErrorButtonComponent;
