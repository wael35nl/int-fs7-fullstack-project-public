import { useState, useRef, ChangeEvent, FormEvent } from 'react';
import {toast} from 'react-toastify';

import { createProductRequest } from 'services/ProductServices';
import { useCategoriesContext } from 'context/CategoriesContext';

import style from 'module.css/product.module.css';

const CreateProduct = () => {
    const {categories} = useCategoriesContext();
    const option = categories.map(category => <option key={category._id} value={category.name}>{category.name}</option>);

    const [product, setProduct] = useState<{ [key: string]: string}>({ category: '', title: '', description: '', image: '', price: '', quantity: '' });
    const { title, description, price, quantity } = product;
    const ref = useRef<any>();

    const handleInputChange = (e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement> | any): void => {
        const {name, value, files} = e.target;
        setProduct(product => ({ ...product, [name]: files ? files[0] : String(value) }));
    }

    const handleInputSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const newProduct = new FormData();
        for (const key in product) {
            newProduct.append(key, product[key]);
        }
        const response = await createProductRequest(newProduct);
        toast.success(response.message);
        setProduct({ title: '', description: '', price: '', quantity: '' });
        ref.current.value = '';
        } catch (error: any) {
            toast.error(error.response.data.message);
        }
    }

    return (
        <div className={style.product__container}>
            <h2 className='page__title'>Create new product</h2>
            <form className={style.product__form} onSubmit={handleInputSubmit}>
                <label htmlFor='category'>Category: &nbsp; </label>
                <select name="category" id="category" onChange={handleInputChange}>
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
                <textarea rows={10} name='description' id='description' value={description} onChange={handleInputChange} required />
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
                <input type='file' name='image' id='image' accept='image/*' ref={ref} onChange={handleInputChange} />
                <hr />
                <hr />
                <button type='submit'>Create</button>
            </form>
        </div>
    )
}

export default CreateProduct;