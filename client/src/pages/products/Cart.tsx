import {Link} from 'react-router-dom';
import { useAppDispatch, useAppSelector } from 'redux/hooks';
import { FaTrash } from "react-icons/fa";

import { removeFromCart } from 'features/cartSlice';
import { useNavigate } from 'react-router-dom';

import style from 'module.css/product.module.css';
const Cart = () => {
    const {cartItems} = useAppSelector(state => state.cartR);
    const imageUrl = `${process.env.REACT_APP_IMAGE_PATH}/products`;
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const handleRemoveItem = (id: string) => {
        dispatch(removeFromCart(id));
    }

    const product = cartItems.map(product => {
        const {image, title, slug, price, order, quantity} = product;
        return <article key={product._id} className={style.product}>
                <img src={`${imageUrl}/${image}`} alt={title} />
                <div className={style.product__info}>
                    <div className={style.product__options}>
                        <h2 className='page__title'>{title}</h2>
                        <Link to={`/product/${slug}`} state={product} className={style.product__link}>View product details</Link>
                    </div>
                    <div className={style.product__options}>
                        <p>Price: {price.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</p>
                        <button onClick={() => {}} disabled={order === 0}>-</button>
                        <p>Quantity: {order}</p>
                        <button onClick={() => {}} disabled={order === quantity}>+</button>
                    </div>
                    <div className={style.product__options}>
                        <button onClick={() => navigate('/')}>Back</button>
                        <p>Total: {price * order}</p>
                        <FaTrash onClick={() => handleRemoveItem(product._id)} className={style.fa_trash} />
                    </div>
                </div>
        </article>
    });

  return (
    <section className={style.products}>
        {product}
        <div className={style.payment}></div>
    </section>
  )
}

export default Cart;