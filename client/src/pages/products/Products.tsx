import { useState, useEffect, useCallback, ChangeEvent } from "react";
import {toast} from 'react-toastify';

import { useCategoriesContext } from "context/CategoriesContext";
import { getAllProductsRequest } from "services/ProductServices";
import Product from "components/products/Product";

import style from 'module.css/product.module.css';

export type ProductType = {
  category: {
    name: string
  },
  _id: string,
  title: string,
  slug: string,
  description: string,
  image: string,
  price: number,
  quantity: number,
  order: number,
  sold: number,
  createdAt: string
}

const Products = () => {
  const {categories} = useCategoriesContext();
  const option = categories.map(category => <option key={category._id} value={category.name}>{category.name}</option>);

  const [products, setProducts] = useState<ProductType[]>([]);

  // pagination
  const [page, setPage] = useState(sessionStorage.getItem('productPage') !== null ? JSON.parse(String(sessionStorage.getItem('productPage'))) : 0);
  const [totalPages, setTotalPages] = useState(0);

  // filter
  const [filterBy, setFilterBy] = useState(sessionStorage.getItem('filter') !== null ? JSON.parse(String(sessionStorage.getItem('filter'))) : 'All products');
  const [filteredProducts, setFilteredProducts] = useState<ProductType[]>([]);
  const handleFilter = (e: ChangeEvent<HTMLSelectElement>): void => {
    setFilterBy(e.target.value);
  }
  useEffect(() => {
    setFilteredProducts(filterBy !== 'All products' ? products.filter(product => product.category.name === filterBy) : products);
  }, [filterBy, products]);

  // search
  const [productTitle, setProductTitle] = useState('');
  const [searchedProducts, setSearchedProducts] = useState<ProductType[]>([]);
  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setProductTitle(e.target.value);
  }
  useEffect(() => {
    setSearchedProducts(filteredProducts.filter(product => product.title.toLocaleLowerCase().includes(productTitle.toLocaleLowerCase())));
  }, [filteredProducts, productTitle]);

  // sort
  const [sortedBy, setSortedBy] = useState(sessionStorage.getItem('sort') !== null ? JSON.parse(String(sessionStorage.getItem('sort'))) : 'date');
  const sortedProducts = [...searchedProducts];
  const sortedByPrice = sortedBy === 'price-up' ? sortedProducts.sort((a, b) => (a.price < b.price) ? -1 : 1) : sortedProducts.sort((a, b) => (a.price < b.price) ? 1 : -1);
  const handleSort = (e: ChangeEvent<HTMLSelectElement>): void => {
    setSortedBy(e.target.value);
  }

  const [isLoading, setIsLoading] = useState('Loading');

  const fetchAllProducts = useCallback(async () => {
    try {
      const response = await getAllProductsRequest(page, filterBy);
      setProducts(response.payload.products);
      setTotalPages(response.payload.totalPages);
      setIsLoading('');
    } catch (error: any) {
      toast.error(error.response.data.message);
    }
  }, [page, filterBy]);

  useEffect(() => {
    fetchAllProducts();
    sessionStorage.setItem('productPage', JSON.stringify(page));
    sessionStorage.setItem('sort', JSON.stringify(sortedBy));
    sessionStorage.setItem('filter', JSON.stringify(filterBy));
  }, [fetchAllProducts, filterBy, page, sortedBy]);

  return (
    <>
    {
      isLoading ?
      <div className={style.loading}>
        <h2 className="page__title">Loading Products...</h2>
        <div className={style.loader}></div>
      </div>
      :
      <>
      <div className={style.pagination}>
        {
          page === 0 ?
          <div>
            <label htmlFor='filter-by'>Category: &nbsp; </label>
            <select name='filter' id='filter-by' onChange={handleFilter} value={filterBy}>
              <option value='All products'>All products</option>
              {option}
            </select>
          </div> :
          <h2 className="page__title">{filterBy}</h2>
        }
        {
          filteredProducts.length !== 0 &&
          <>
            <button onClick={() => setPage(1)} hidden={page > 0}>Show in pages</button>
            <div>
              <label htmlFor='sort-by'>Sort by: &nbsp; </label>
              <select name='sort' id='sort-by' onChange={handleSort} defaultValue={sortedBy}>
                <option value='date'>Newest</option>
                <option value='price-up'>Price up</option>
                <option value='price-down'>Price down</option>
              </select>
            </div>
            <div>
              <label htmlFor='search'>Search product: &nbsp; </label>
              <input type="text" name="search" id="search" value={productTitle} onChange={handleSearchChange}/>
            </div>
          </>
        }
      </div>
      {sortedBy === 'date' && <Product products={searchedProducts} />}
      {(sortedBy === 'price-up' || sortedBy === 'price-down') && <Product products={searchedProducts.length !== 0 ? sortedByPrice : searchedProducts} />}
      <div className={style.pagination}>
        <button onClick={() => setPage(page - 1)} disabled={page === 1} hidden={page === 0}>{page === 1 ? page : page - 1}</button>
        <h3 hidden={page === 0}>{page}</h3>
        <button onClick={() => setPage(page + 1)} disabled={page === totalPages} hidden={page === 0}>{page === totalPages ? page : page + 1}</button>
        <h3 hidden={page === 0}>... {totalPages}</h3>
        <button onClick={() => setPage(0)} hidden={page === 0}>Show all</button>
      </div>
      </>
    }
    </>
  )
}

export default Products;