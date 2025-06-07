import { FC } from 'react';
import { AppHeaderUI } from '@ui';
import { useSelector } from '../../services/store';
import { getUserState } from '../../services/slices/userSlice';

export const AppHeader: FC = () => {
  const { userData } = useSelector(getUserState);
  const userName = userData?.name || '';

  return <AppHeaderUI userName={userName} />;
};
