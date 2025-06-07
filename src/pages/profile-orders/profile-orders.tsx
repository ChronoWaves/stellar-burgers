import { ProfileOrdersUI } from '@ui-pages';
import { FC, useEffect } from 'react';
import { useSelector, useDispatch } from '../../services/store';
import { getOrdersAll, getUserState } from '../../services/slices/userSlice';
import { getFeeds } from '../../services/slices/feedSlice';
import { Preloader } from '@ui';

export const ProfileOrders: FC = () => {
  const { userOrders, request } = useSelector(getUserState);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!userOrders.length && !request) {
      dispatch(getOrdersAll());
      dispatch(getFeeds());
    }
  }, [dispatch, userOrders, request]);

  if (request) {
    return <Preloader />;
  }

  return <ProfileOrdersUI orders={userOrders} />;
};
