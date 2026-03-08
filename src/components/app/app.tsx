import {
  ConstructorPage,
  Feed,
  Login,
  Register,
  ForgotPassword,
  ResetPassword,
  Profile,
  ProfileOrders,
  NotFound404
} from '@pages';
import { Modal, OrderInfo, IngredientDetails } from '@components';
import { AppDispatch, RootState } from '../../services/store';
import {
  fetchIngredients,
  fetchIngredientsById
} from '../../services/ingredientsSlice';
import '../../index.css';
import styles from './app.module.css';

import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useLayoutEffect } from 'react';

import { AppHeader } from '@components';
import { Preloader } from '@ui';

const App = () => {
  /** TODO: взять переменные из стора */
  const isIngredientsLoading = useSelector(
    (state: RootState) => state.ingredients.isLoading
  );
  const ingredients = useSelector(
    (state: RootState) => state.ingredients.ingredients
  );
  const selectedIngredient = useSelector(
    (state: RootState) => state.ingredients.selectedIngredient
  );
  const error = useSelector((state: RootState) => state.ingredients.error);
  const dispatch = useDispatch<AppDispatch>();

  const location = useLocation();
  const background = location.state?.background;
  const navigate = useNavigate();

  const handleClose = () => {
    navigate(-1);
  };

  useEffect(() => {
    dispatch(fetchIngredients());
  }, []);

  useLayoutEffect(() => {
    const pathParts = location.pathname.split('/');
    if (pathParts[1] === 'ingredients') {
      const ingredientId = pathParts[2];
      if (
        ingredientId &&
        (!selectedIngredient || selectedIngredient?._id !== ingredientId)
      ) {
        dispatch(fetchIngredientsById(ingredientId));
      }
    }
  }, [selectedIngredient, location.pathname, dispatch]);

  return (
    <div className={styles.app}>
      <AppHeader />
      {isIngredientsLoading ? (
        <Preloader />
      ) : error ? (
        <div className={`${styles.error} text text_type_main-medium pt-4`}>
          {error}
        </div>
      ) : ingredients.length > 0 ? (
        <>
          <Routes location={background || location}>
            <Route path='/' element={<ConstructorPage />} />
            <Route path='/feed' element={<Feed />} />
            <Route path='/login' element={<Login />} />
            <Route path='/register' element={<Register />} />
            <Route path='/forgot-password' element={<ForgotPassword />} />
            <Route path='/reset-password' element={<ResetPassword />} />
            <Route path='/profile' element={<Profile />} />
            <Route path='/profile/orders' element={<ProfileOrders />} />
            <Route path='*' element={<NotFound404 />} />
            <Route
              path='/ingredients/:id'
              element={
                <Modal title='' onClose={handleClose}>
                  <IngredientDetails />
                </Modal>
              }
            />
          </Routes>
          {background && (
            <Routes>
              <Route
                path='/feed/:number'
                element={
                  <Modal title='' onClose={handleClose}>
                    <OrderInfo />
                  </Modal>
                }
              />
              <Route
                path='/ingredients/:id'
                element={
                  <Modal title='' onClose={handleClose}>
                    <IngredientDetails />
                  </Modal>
                }
              />
              <Route
                path='/profile/orders/:number'
                element={
                  <Modal title='' onClose={handleClose}>
                    <OrderInfo />
                  </Modal>
                }
              />
            </Routes>
          )}
        </>
      ) : (
        <div className={`${styles.title} text text_type_main-medium pt-4`}>
          Нет игредиентов
        </div>
      )}
    </div>
  );
};

export default App;
