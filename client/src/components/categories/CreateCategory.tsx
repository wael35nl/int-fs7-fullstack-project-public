import {useState, ChangeEvent, FormEvent} from 'react';
import {toast} from 'react-toastify';

import { useCategoriesContext } from 'context/CategoriesContext';
import { createCategoryRequest } from 'services/categoryServices';

import style from 'module.css/product.module.css';

const CreateCategory = () => {
    const [category, setCategory] = useState('');
    const {setCategoriesLength} = useCategoriesContext();

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
        setCategory(e.target.value);
    }

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const response = await createCategoryRequest(category);
            toast.success(response.message);
            setCategoriesLength(catLength => catLength + 1);
            setCategory('');
        } catch (error: any) {
            toast.error(error.response.data.message);
        }
    }

  return (
    <>
        <h2 className='page__title'>&nbsp; &nbsp; Create Category</h2>
        <form onSubmit={handleSubmit} className={style.category__form}>
            <label>Category name:</label>
            <input type='text' name='category' id='category' value={category} onChange={handleInputChange} required />
            <button type='submit'>Add category</button>
        </form>
    </>
  )
}

export default CreateCategory;