import {useLocation, useNavigate} from 'react-router-dom';
import moment from 'moment';

import { useAppDispatch, useAppSelector } from 'redux/hooks';
import { addToCart } from 'features/cartSlice';
import { ProductType } from './Products';

import style from 'module.css/product.module.css';

const ProductDetails = () => {
  const product: ProductType = useLocation().state;

  const {title, image, category, slug, description, price, createdAt, quantity, sold} = product;
  const imageUrl = `${process.env.REACT_APP_IMAGE_PATH}/products/${image}`;

  const { cartItems } = useAppSelector(state => state.cartR);
  const addedToCart = cartItems.find(item => item._id === product._id);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  return (
    <section className={style.products__details}>
        <article key={product._id}>
          <img src={`${imageUrl}`} alt={slug} />
          <div className={style.product__info_details}>
            <h2 className='page__title'>{title}</h2>
            <p>Category: {category.name}</p>
            <div className={style.product__description}>
              <p>Description:</p>
              <p>{description}</p>
            </div>
            <p>Published: {moment(createdAt).fromNow()}</p>
            <p>In stock: {quantity - sold !== 0 ? quantity - sold : 'Sold out'}</p>
            <div className={style.product__options}>
              <button onClick={() => navigate('/')}>All products</button>
              <p>Price: {price.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</p>
              {
                !addedToCart ?
                  <button onClick={() => dispatch(addToCart(product))}>Add to cart</button>
                :
                <h3>In the 🛒</h3>
              }
              <button onClick={() => navigate('/cart')}>Cart</button>
            </div>
          </div>
        </article>
    </section>
  )
}

export default ProductDetails;