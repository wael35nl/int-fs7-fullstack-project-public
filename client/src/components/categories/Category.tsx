import {useState, ChangeEvent, FormEvent} from 'react';
import {toast} from 'react-toastify';

import { updateCategoryRequest, deleteCategoryRequest } from "services/categoryServices";
import { useCategoriesContext } from 'context/CategoriesContext';
import { CategoriesType } from 'App';

import style from 'module.css/product.module.css';

type CategoryPropsType = {
    categories : CategoriesType
}

const Category = ({categories}: CategoryPropsType) => {
  const {setCategoriesLength} = useCategoriesContext();
  const [categoryId, setCategoryId] = useState('');
  const [name, setName] = useState('');

  const handleUpdateCategory = async (id: string, name: string) => {
    setName(name);
    setCategoryId(id);
  }

  const handleNameInput = (e: ChangeEvent<HTMLInputElement>): void => {
    setName(e.target.value);
  }

  const handleNameSubmit = async (e: FormEvent<HTMLFormElement>, id: string) => {
    e.preventDefault()
    try {
          const response = await updateCategoryRequest(id, name);
          toast.success(response.message);
          setCategoriesLength(catLength => catLength - 1);
          setCategoryId('');
        } catch (error: any) {
          toast.error(error.response.data.message);
        }
  }

    const handleDeleteCategory = async (id: string) => {
        try {
          const response = await deleteCategoryRequest(id);
          toast.success(response.message);
          setCategoriesLength(catLength => catLength - 1);
        } catch (error: any) {
          toast.error(error.response.data.message);
        }
      }

    const category = categories.map((category, index) =>
      categoryId === category._id ?
      <form key={category._id} onSubmit={(e) => handleNameSubmit(e, category._id)} className={style.category}>
        <label>Category name:</label>
        <input type="text" name='name' value={name} onChange={handleNameInput}/>
        <div className={style.category__options}>
          <button type='submit' disabled={name === category.name}>Update</button>
          <button onClick={(e) => {e.preventDefault(); setCategoryId('')}}>Cancel</button>
        </div>
      </form>
      :
      <article key={category._id} className={style.category}>
        <h2>{index + 1}- {category.name}</h2>
        <div className={style.category__options}>
          <button onClick={() => handleUpdateCategory(category._id, category.name)}>Edit</button>
          <button onClick={() => handleDeleteCategory(category._id)}>DeLete</button>
        </div>
      </article>);

  return (
    <>{category}</>
  )
}

export default Category;