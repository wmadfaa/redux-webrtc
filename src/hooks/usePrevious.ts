import { useEffect, useRef } from "react";

// const {receiveAmount, sendAmount } = props
// const prevAmount = usePrevious({receiveAmount, sendAmount});

const usePrevious = <T = object>(value: T): T => {
  const ref = useRef<T>({} as T);
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
};

export default usePrevious;
