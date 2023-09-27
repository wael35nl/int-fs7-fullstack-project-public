import { SetStateAction, createContext, useContext } from "react";

import { CategoriesType } from "App";

type GlobalCategoriesLength = {
  categories: CategoriesType
  setCategories: React.Dispatch<React.SetStateAction<CategoriesType>>
  categoriesLength: number
  setCategoriesLength: React.Dispatch<React.SetStateAction<number>>
}

export const CategoriesContext = createContext<GlobalCategoriesLength>({
  categories: [],
  setCategories: function (value: SetStateAction<CategoriesType>): void {
    throw new Error("Function not implemented.");
  },
  categoriesLength: 0,
  setCategoriesLength: function (value: SetStateAction<number>): void {
    throw new Error("Function not implemented.");
  }
});

export const useCategoriesContext = () => useContext(CategoriesContext);