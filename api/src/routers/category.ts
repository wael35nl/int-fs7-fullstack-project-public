import { Router } from 'express';

import validateCategory from '../validators/category';
import runValidation from '../validators/index';
import { requireAuth, isAdmin } from '../middlewares/auth';
import { createCategory, getAllCategories, updateCategory, deleteCategory } from '../controllers/category';

const categoryRouter = Router();

categoryRouter.post('/', requireAuth(), isAdmin, validateCategory, runValidation, createCategory);
categoryRouter.get('/', getAllCategories);
categoryRouter.put('/:id', requireAuth(), isAdmin, validateCategory, runValidation, updateCategory);
categoryRouter.delete('/:id', requireAuth(), isAdmin, deleteCategory);

export default categoryRouter;