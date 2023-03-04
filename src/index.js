import React from "react"; // Imported the library itself. Contains Component class and useState function
import ReactDOM from "react-dom"; // Necessary as it contains a render() function
import "styles/index.scss";
import App from "App";

/**
 * This is the entry point of your React application where the root element is in the public/index.html.
 * We call this a “root” DOM node because everything inside it will be managed by React DOM.
 * Applications built with just React usually have a single root DOM node.
 * More: https://reactjs.org/docs/rendering-elements.html
 */
ReactDOM.render(<App />, document.getElementById("root"));
