import { FC, useEffect, useMemo } from 'react';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient } from '@utils-types';
import { useSelector, useDispatch } from '../../services/store';
import { useParams } from 'react-router-dom';
import {
  getOrderByNumber,
  getOrderState
} from '../../services/slices/orderSlice';
import { getIngredientState } from '../../services/slices/ingredientSlice';

export const OrderInfo: FC = () => {
  const { number } = useParams<{ number: string }>();
  const orderNumber = Number(number);
  const { ingredients } = useSelector(getIngredientState);
  const { orderByNumberResponse, request } = useSelector(getOrderState);
  const dispatch = useDispatch();

  useEffect(() => {
    if (orderNumber) {
      dispatch(getOrderByNumber(orderNumber));
    }
  }, [dispatch, orderNumber]);

  const orderInfo = useMemo(() => {
    if (!orderByNumberResponse || ingredients.length === 0) return null;

    const date = new Date(orderByNumberResponse.createdAt);

    const ingredientMap = new Map<string, TIngredient>();
    ingredients.forEach((ingredient) => {
      ingredientMap.set(ingredient._id, ingredient);
    });

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = orderByNumberResponse.ingredients.reduce(
      (acc: TIngredientsWithCount, ingredientId) => {
        const ingredient = ingredientMap.get(ingredientId);
        if (ingredient) {
          if (!acc[ingredientId]) {
            acc[ingredientId] = { ...ingredient, count: 1 };
          } else {
            acc[ingredientId].count++;
          }
        }
        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, { price, count }) => acc + price * count,
      0
    );

    return {
      ...orderByNumberResponse,
      ingredientsInfo,
      date,
      total
    };
  }, [orderByNumberResponse, ingredients]);

  if (!orderInfo || request) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
