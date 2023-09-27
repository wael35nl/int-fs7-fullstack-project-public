import { useCategoriesContext } from "context/CategoriesContext";
import CreateCategory from "components/categories/CreateCategory";
import Category from 'components/categories/Category';

import style from 'module.css/product.module.css';

const AllCategories = () => {
    const {categories} = useCategoriesContext();

  return (
    <div className={style.categories__container}>
        <CreateCategory />
        <section className={style.categories}>
          <Category categories={categories} />
        </section>
    </div>
  );
}

export default AllCategories;