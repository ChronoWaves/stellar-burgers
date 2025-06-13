import { FC, SyntheticEvent, useCallback } from 'react';
import { LoginUI } from '@ui-pages';
import { useDispatch, useSelector } from '../../services/store';
import { Navigate } from 'react-router-dom';
import {
  getError,
  getUserState,
  loginUser
} from '../../services/slices/userSlice';
import { useForm } from '../../hooks/useForm';

export const Login: FC = () => {
  const { values, setValues } = useForm({ email: '', password: '' });
  const { isAuthenticated } = useSelector(getUserState);
  const error = useSelector(getError);
  const dispatch = useDispatch();

  const setEmail: React.Dispatch<React.SetStateAction<string>> = (value) =>
    setValues((prev) => ({
      ...prev,
      email: typeof value === 'function' ? value(prev.email) : value
    }));

  const setPassword: React.Dispatch<React.SetStateAction<string>> = (value) =>
    setValues((prev) => ({
      ...prev,
      password: typeof value === 'function' ? value(prev.password) : value
    }));

  const handleSubmit = useCallback(
    (e: SyntheticEvent) => {
      e.preventDefault();
      if (!values.email || !values.password) {
        return;
      }
      dispatch(loginUser({ email: values.email, password: values.password }));
    },
    [values, dispatch]
  );

  if (isAuthenticated) {
    return <Navigate to='/' />;
  }

  return (
    <LoginUI
      errorText={error?.toString()}
      email={values.email}
      password={values.password}
      setEmail={setEmail}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};
