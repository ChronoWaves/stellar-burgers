import { FC, useMemo } from 'react';
import { TOrder } from '@utils-types';
import { FeedInfoUI } from '../ui/feed-info';
import { useSelector } from '../../services/store';
import { getFeedState } from '../../services/slices/feedSlice';

export const FeedInfo: FC = () => {
  const { orders, total, totalToday } = useSelector(getFeedState);

  const getOrders = (status: string): number[] =>
    orders
      .filter((item: TOrder) => item.status === status)
      .map((item: TOrder) => item.number)
      .slice(0, 20);

  const readyOrders = useMemo(() => getOrders('done'), [orders]);
  const pendingOrders = useMemo(() => getOrders('pending'), [orders]);

  const feed = useMemo(
    () => ({ orders, total, totalToday }),
    [orders, total, totalToday]
  );

  return (
    <FeedInfoUI
      readyOrders={readyOrders}
      pendingOrders={pendingOrders}
      feed={feed}
    />
  );
};
