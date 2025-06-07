import { ProfileUI } from '@ui-pages';
import { FC, SyntheticEvent, useEffect, useState, useMemo } from 'react';
import { useSelector, useDispatch } from '../../services/store';
import {
  getUser,
  getUserState,
  updateUser
} from '../../services/slices/userSlice';
import { Preloader } from '@ui';

export const Profile: FC = () => {
  const { userData, request: loading } = useSelector(getUserState);
  const dispatch = useDispatch();

  const initialUser = useMemo(
    () => ({
      name: userData?.name || '',
      email: userData?.email || ''
    }),
    [userData]
  );

  const [formValue, setFormValue] = useState({
    name: initialUser.name,
    email: initialUser.email,
    password: ''
  });

  useEffect(() => {
    setFormValue((prevState) => ({
      ...prevState,
      name: initialUser.name,
      email: initialUser.email
    }));
  }, [initialUser]);

  const isFormChanged = useMemo(
    () =>
      formValue.name !== initialUser.name ||
      formValue.email !== initialUser.email ||
      !!formValue.password,
    [formValue, initialUser]
  );

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    dispatch(updateUser(formValue));
    dispatch(getUser());
  };

  const handleCancel = (e: SyntheticEvent) => {
    e.preventDefault();
    setFormValue({
      name: initialUser.name,
      email: initialUser.email,
      password: ''
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValue((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };

  if (loading) {
    return <Preloader />;
  }

  return (
    <ProfileUI
      formValue={formValue}
      isFormChanged={isFormChanged}
      handleCancel={handleCancel}
      handleSubmit={handleSubmit}
      handleInputChange={handleInputChange}
    />
  );
};
