import { useState, useCallback, useEffect } from 'react';
import {toast} from 'react-toastify';

import { useAppSelector } from 'redux/hooks';
import { refreshTokenRequest } from 'services/userServices';
import { getAllCategoriesRequest } from 'services/categoryServices';
import { CategoriesContext } from 'context/CategoriesContext';
import Index from "routes";

export type CategoriesType = {
  _id: string,
  name: string
}[]

const App = () => {
  const {isLoggedIn} = useAppSelector(state => state.userR);
  const [categories, setCategories] = useState<CategoriesType>([]);
  const [categoriesLength, setCategoriesLength] = useState(categories.length);

  // get refresh token throughout the whole app
  const handleRefresh = useCallback(async () => {
    try {
      if (isLoggedIn) {
        await refreshTokenRequest();
      }
    } catch (error: any) {
      toast.error(error.response.data.message);
    }
  }, [isLoggedIn]);

  useEffect(() => {
    const interval = setInterval(() => {
      handleRefresh();
    }, 1000 * 60 * 5);
    return () => clearInterval(interval);
  }, [handleRefresh]);

  // get categories throughout the whole app
  const fetchAllCategories = async () => {
      try {
        const response = await getAllCategoriesRequest();
        setCategories(response.payload.categories);
      } catch (error: any) {
        toast.error(error.response.data.message);
      }
  }
  useEffect(() => {
      fetchAllCategories();
  }, [categoriesLength]);

  return (
    <CategoriesContext.Provider value={{categories, setCategories, categoriesLength, setCategoriesLength}}>
      <Index />
    </CategoriesContext.Provider>
  )
}
export default App;