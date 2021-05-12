import { useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { bindActionCreators } from 'redux';
import { actionCreators } from '../state';

export const useActions = () => {
  const dispatch = useDispatch();

  // useMemo is like useState and useEffet put together. Whenever dispatch changes (something in the array),
  // react reruns the callback function. This return value from the inner function is used as the overall return
  // from the useActions hooks. This calc is done only once, the first time we call useMemo, or when something in
  // the dependency array changes. Overall, action creators are bound once.
  return useMemo(() => {
    return bindActionCreators(actionCreators, dispatch);
  }, [dispatch]);
};
