import React, { FC } from 'react';
import {
  Button,
  ConstructorElement,
  CurrencyIcon
} from '@zlden/react-developer-burger-ui-components';
import styles from './burger-constructor.module.css';
import { BurgerConstructorUIProps } from './type';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorElement, Modal } from '@components';
import { Preloader, OrderDetailsUI } from '@ui';

const BunSection = ({
  bun,
  position
}: {
  bun: TConstructorIngredient | null;
  position: string;
}) =>
  bun ? (
    <div
      className={`${styles.element} ${position === 'top' ? 'mb-4' : 'mt-4'} mr-4`}
    >
      <ConstructorElement
        type={position === 'top' ? 'top' : 'bottom'}
        isLocked
        text={`${bun.name} (${position === 'top' ? 'верх' : 'низ'})`}
        price={bun.price}
        thumbnail={bun.image}
      />
    </div>
  ) : (
    <div
      className={`${styles.noBuns} ${position === 'top' ? styles.noBunsTop : styles.noBunsBottom} ml-8 mb-4 mr-5 text text_type_main-default`}
    >
      Выберите булки
    </div>
  );

export const BurgerConstructorUI: FC<BurgerConstructorUIProps> = ({
  constructorItems,
  orderRequest,
  price,
  orderModalData,
  onOrderClick,
  closeOrderModal
}) => (
  <section className={styles.burger_constructor}>
    <BunSection bun={constructorItems.bun} position='top' />
    <ul className={styles.elements}>
      {constructorItems.ingredients.length > 0 ? (
        constructorItems.ingredients.map(
          (item: TConstructorIngredient, index: number) => (
            <BurgerConstructorElement
              ingredient={item}
              index={index}
              totalItems={constructorItems.ingredients.length}
              key={item.id}
            />
          )
        )
      ) : (
        <div
          className={`${styles.noBuns} ml-8 mb-4 mr-5 text text_type_main-default`}
        >
          Выберите начинку
        </div>
      )}
    </ul>
    <BunSection bun={constructorItems.bun} position='bottom' />
    <div className={`${styles.total} mt-10 mr-4`}>
      <div className={`${styles.cost} mr-10`}>
        <p className={`text ${styles.text} mr-2`}>{price}</p>
        <CurrencyIcon type='primary' />
      </div>
      <Button
        htmlType='button'
        type='primary'
        size='large'
        onClick={onOrderClick}
        data-cy='order-button'
      >
        Оформить заказ
      </Button>
    </div>
    {orderRequest && (
      <Modal onClose={closeOrderModal} title={'Оформляем заказ...'}>
        <Preloader />
      </Modal>
    )}
    {orderModalData && (
      <Modal
        onClose={closeOrderModal}
        title={orderRequest ? 'Оформляем заказ...' : ''}
      >
        <OrderDetailsUI orderNumber={orderModalData.number} />
      </Modal>
    )}
  </section>
);
