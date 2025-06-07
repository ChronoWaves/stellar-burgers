import { FC, useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { useDispatch } from '../../services/store';

import { AppHeader, IngredientDetails, Modal, OrderInfo } from '@components';
import {
  ConstructorPage,
  Feed,
  ForgotPassword,
  Login,
  NotFound404,
  Profile,
  ProfileOrders,
  Register,
  ResetPassword
} from '@pages';
import { ProtectedRoute } from './protected-route';
import { getUser } from '../../services/slices/userSlice';
import { getIngredients } from '../../services/slices/ingredientSlice';
import styles from './app.module.css';

const App: FC = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const background = location.state?.background;
  const orderNumber = location.pathname.match(/\d+/)?.[0];

  useEffect(() => {
    dispatch(getUser());
    dispatch(getIngredients());
  }, [dispatch]);

  const renderOrderInfoModal = (title: string) => (
    <Modal title={title} onClose={() => history.back()}>
      <OrderInfo />
    </Modal>
  );

  const renderIngredientDetailsModal = () => (
    <Modal title='Детали ингредиента' onClose={() => history.back()}>
      <IngredientDetails />
    </Modal>
  );

  return (
    <div className={styles.app}>
      <AppHeader />
      <Routes location={background || location}>
        <Route path='/' element={<ConstructorPage />} />
        <Route path='/ingredients/:id' element={<IngredientDetails />} />
        <Route path='/feed' element={<Feed />} />
        <Route path='/feed/:number' element={<OrderInfo />} />
        <Route element={<ProtectedRoute onlyUnAuth />}>
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/forgot-password' element={<ForgotPassword />} />
          <Route path='/reset-password' element={<ResetPassword />} />
        </Route>
        <Route element={<ProtectedRoute onlyUnAuth={false} />}>
          <Route path='/profile' element={<Profile />} />
          <Route path='/profile/orders' element={<ProfileOrders />} />
          <Route path='/profile/orders/:number' element={<OrderInfo />} />
        </Route>
        <Route path='*' element={<NotFound404 />} />
      </Routes>

      {background && (
        <Routes>
          <Route
            path='/ingredients/:id'
            element={renderIngredientDetailsModal()}
          />
          <Route
            path='/feed/:number'
            element={renderOrderInfoModal(`#${orderNumber}`)}
          />
          <Route element={<ProtectedRoute onlyUnAuth={false} />}>
            <Route
              path='/profile/orders/:number'
              element={renderOrderInfoModal(`#${orderNumber}`)}
            />
          </Route>
        </Routes>
      )}
    </div>
  );
};

export default App;
