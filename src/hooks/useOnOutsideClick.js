import { useEffect, useRef, useCallback } from "react";

const useOnOutsideClick = onOutsideClick => {
  const componentRef = useRef();

  const handleClick = useCallback(
    e => {
      if (componentRef.current && componentRef.current.contains(e.target)) {
        return;
      }
      onOutsideClick();
    },
    [onOutsideClick]
  );

  useEffect(() => {
    document.addEventListener("mousedown", handleClick);

    return () => document.removeEventListener("mousedown", handleClick);
  }, [handleClick]);

  return componentRef;
};

export default useOnOutsideClick;
