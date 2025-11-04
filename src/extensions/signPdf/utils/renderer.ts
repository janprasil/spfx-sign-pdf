import * as ReactDOM from "react-dom";
import * as React from "react";

export const createRenderer = () => {
  let element: HTMLElement | null = document.createElement("div");
  document.body.appendChild(element);

  const onClose = (): void => {
    if (element) {
      ReactDOM.unmountComponentAtNode(element);
      document.body.removeChild(element);
      element = null;
    }
  };

  const render = (
    node: React.FunctionComponentElement<any & { onClose: () => void }> // eslint-disable-line
  ) => {
    ReactDOM.render(React.cloneElement(node, { onClose }), element);
  };

  return {
    element,
    close: onClose,
    render,
  };
};
