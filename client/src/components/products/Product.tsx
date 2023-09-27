import {useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {toast} from 'react-toastify';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

import { ProductType } from 'pages/products/Products';
import { useAppDispatch, useAppSelector } from 'redux/hooks';
import { addToCart } from 'features/cartSlice';
import { deleteProductRequest } from 'services/ProductServices';
import UpdateProduct from './UpdateProduct';

import style from 'module.css/product.module.css';

type ProductPropsType = {
    products: ProductType[]
}

const Product = ({products}: ProductPropsType) => {
    const {is_admin} = useAppSelector(state => state.userR.userData.user);
    const { cartItems } = useAppSelector(state => state.cartR);
    const imageUrl = `${process.env.REACT_APP_IMAGE_PATH}/products`;

    const [editProductInfo, setEditProductInfo] = useState('');

    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const handleDeleteProduct = (id: string) => {
        confirmAlert({
          customUI: ({ onClose }) => {
            return (
              <div className={style.alert}>
                <h2 className={style.alert__title}>Confirm product delete</h2>
                <p className={style.alert__body}>Are you sure?</p>
                <div className={style.alert__buttons}>
                  <button onClick={() => {confirmDeleteProduct(id); onClose()}} className={style.alert__btn}>Yes</button>
                  <button onClick={onClose} className={style.alert__btn}>No</button>
                </div>
              </div>
            );
          },
          closeOnClickOutside: false,
        });
      }
  
      const confirmDeleteProduct = async (id: string) => {
        try {
            await deleteProductRequest(id);
            window.location.reload();
        } catch (error: any) {
            toast.error(error.response.data.message);
        }
    }

    const product = products.map(product => {
        const {_id, image, title, slug, description, price} = product;
        const addedToCart = cartItems.some(item => item._id === product._id);
        return <article key={product._id} className={editProductInfo !== _id && editProductInfo !== '' ? style.product_hidden : style.product}>
                  {
                    editProductInfo !== _id ?
                    <>
                    <img src={`${imageUrl}/${image}`} alt={title} />
                    <div className={style.product__info}>
                      <h2 className='page__title'>{title}</h2>
                      <p>{description.substring(0, 35)} ...<Link to={`/product/${slug}`} state={product} className={style.product__link}>view more</Link></p>
                      <div className={style.product__options}>
                        <p>- Price: {price.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</p>
                        {
                        !addedToCart ?
                        <button onClick={() => {dispatch(addToCart(product))}}>Add to cart</button>
                        :
                        <h3>In the 🛒</h3>
                        }
                        <button onClick={() => navigate('/cart')}>To cart</button>
                      </div>
                      {
                      is_admin &&
                      <div className={style.product__options}>
                        <button onClick={() => setEditProductInfo(_id)}>Edit</button>
                        <button onClick={() => handleDeleteProduct(_id)}>Delete</button>
                      </div>
                      }
                    </div>
                    </>
                    :
                    <UpdateProduct setUpdateProductInfo={setEditProductInfo} product={product} imageUrl={imageUrl} />
                  }
               </article>});

  return (
    <>
    {
        product.length ?
        <section className={style.products}>{product}</section>
        :
        <h2 className='page__title'>No products found...</h2>
    }
    </>
  )
}

export default Product;