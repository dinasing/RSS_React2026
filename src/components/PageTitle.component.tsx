import { Component } from 'react';

type PageTitleComponentProps = {
  title: string;
};

class PageTitleComponent extends Component<PageTitleComponentProps> {
  render() {
    const title = this.props.title;

    return (
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-white">{title}</h1>
      </div>
    );
  }
}

export default PageTitleComponent;
