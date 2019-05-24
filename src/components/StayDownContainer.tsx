import React, {
  FunctionComponent,
  HTMLProps,
  RefObject,
  createRef,
  useEffect
} from "react";
import StayDown from "staydown";

interface IStayDownContainerProps extends HTMLProps<HTMLDivElement> {}

const StayDownContainer: FunctionComponent<IStayDownContainerProps> = ({
  children,
  ...props
}) => {
  const container: RefObject<HTMLDivElement> = createRef();
  let staydown: StayDown | undefined;

  useEffect(() => {
    if (container.current) {
      staydown = new StayDown({
        target: container.current,
        stickyHeight: 30
      });
      staydown.checkdown();
    }
    return () => {
      staydown = undefined;
    };
  });

  return (
    <div ref={container} {...props}>
      {children}
    </div>
  );
};

export default StayDownContainer;
