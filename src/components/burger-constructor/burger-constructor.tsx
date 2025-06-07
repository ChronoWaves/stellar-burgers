import { FC } from 'react';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useDispatch, useSelector } from '../../services/store';
import { useNavigate } from 'react-router-dom';
import {
  getConstructorState,
  orderBurger,
  setRequest,
  resetModal
} from '../../services/slices/constructorSlice';
import { getUserState } from '../../services/slices/userSlice';

export const BurgerConstructor: FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { constructorItems, orderModalData, orderRequest } =
    useSelector(getConstructorState);
  const { isAuthenticated } = useSelector(getUserState);

  const ingredients = constructorItems.ingredients.map(
    (ingredient: TConstructorIngredient) => ingredient._id
  );
  const bun = constructorItems.bun?._id;
  const arr = bun ? [bun, ...ingredients, bun] : ingredients;

  const onOrderClick = () => {
    if (isAuthenticated) {
      if (constructorItems.bun) {
        dispatch(setRequest(true));
        dispatch(orderBurger(arr));
      }
    } else {
      navigate('/login');
    }
  };

  const closeOrderModal = () => {
    dispatch(setRequest(false));
    dispatch(resetModal());
  };

  const price = constructorItems.bun
    ? constructorItems.bun.price * 2 +
      constructorItems.ingredients.reduce(
        (sum, ingredient: TConstructorIngredient) => sum + ingredient.price,
        0
      )
    : constructorItems.ingredients.reduce(
        (sum, ingredient: TConstructorIngredient) => sum + ingredient.price,
        0
      );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
