import { useCallback, useState } from 'react';

/**
 * @see https://usehooks.com/useToggle/#:~:text=Basically%2C%20what%20this%20hook%20does,%2C%20open%2Fclose%20side%20menu.
 */
export const useToggle = (
  initialState: boolean | (() => boolean) = false,
): [boolean, () => void] => {
  const [state, setState] = useState(initialState);
  const toggle = useCallback(() => setState((s) => !s), []);

  return [state, toggle];
};
