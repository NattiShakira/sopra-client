import "styles/ui/Button.scss";

export const Button = props => (
  <button
    {...props} // Takes all the props of the component
    style={{width: props.width, ...props.style}}
    className={`primary-button ${props.className}`}>
    {props.children}
  </button>
);
