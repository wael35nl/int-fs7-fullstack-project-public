import {useState, ChangeEvent, FormEvent} from 'react';
import {toast} from 'react-toastify';

import { ProductType } from "pages/products/Products"
import { useCategoriesContext } from 'context/CategoriesContext';
import { updateProductRequest } from 'services/ProductServices';

import style from 'module.css/product.module.css';

type UpdateProductProps = {
    setUpdateProductInfo: React.Dispatch<React.SetStateAction<string>>
    product: ProductType
    imageUrl: string
}

const UpdateProduct = ({setUpdateProductInfo, product, imageUrl}: UpdateProductProps) => {
    const {category, ...rest} = product;
    const [productUpdate, setProductUpdate] = useState<any>({...rest, productCategory: product.category.name});
    const {productCategory, title, description, price, quantity, image} = productUpdate;

    const {categories} = useCategoriesContext();
    const option = categories.map(category => <option key={category._id} value={category.name}>{category.name}</option>);

    const handleInputChange = (e: ChangeEvent<HTMLInputElement> | any): void => {
        const {name, value, files} = e.target;
        setProductUpdate(({ ...productUpdate, [name]: files ? files[0] : String(value) }));
    }
  
    const handleInputSubmit = async (e: FormEvent<HTMLFormElement>, id: string) => {
        e.preventDefault();
        try {
            const updatedInfo = new FormData();
        for (const key in productUpdate) {
            updatedInfo.append(key, productUpdate[key]);
        }
        const response = await updateProductRequest(id, updatedInfo);
        toast.success(response.message);
        setTimeout(() => {window.location.reload()}, 500);
        setUpdateProductInfo('');
        } catch (error: any) {
            toast.error(error.response.data.message);
        }
    }

  return (
    <>
    <img src={`${imageUrl}/${product.image}`} alt={product.title} />
    <form className={style.product__update_form} onSubmit={(e) => handleInputSubmit(e, product._id)}>
        <label htmlFor='productCategory'>Category: &nbsp; </label>
        <select name="productCategory" id="productCategory" onChange={handleInputChange} defaultValue={product.category.name}>
            <option>Select category</option>
            {option}
        </select>
        <hr />
        <hr />
        <label>Title:</label>
        <input type='text' name='title' id='title' value={title} onChange={handleInputChange} required />
        <hr />
        <hr />
        <label>Description:</label>
        <textarea rows={8} name='description' id='description' value={description} onChange={handleInputChange} required />
        <hr />
        <hr />
        <label>Price:</label>
        <input type='number' name='price' id='price' value={price} onChange={handleInputChange} required />
        <hr />
        <hr />
        <label>Quantity:</label>
        <input type='number' name='quantity' id='quantity' value={quantity} onChange={handleInputChange} required />
        <hr />
        <hr />
        <label>Image:</label>
        <input type='file' name='image' id='image' accept='image/*' onChange={handleInputChange} />
        <hr />
        <hr />
        <div className={style.product__update_btn}>
            <button type="submit" disabled={(productCategory === product.category.name || productCategory === 'Select category') && title === product.title && description === product.description && price ===  product.price && quantity === product.quantity && image === product.image}>{((productCategory === product.category.name || productCategory === 'Select category') && title === product.title && description === product.description && price ===  product.price && quantity === product.quantity && image === product.image) ? 'Current info' : 'Update info'}</button>
            <button onClick={(e) => {e.preventDefault(); setUpdateProductInfo('')}}>Cancel</button>
        </div>
    </form>
    </>
  )
}

export default UpdateProduct;