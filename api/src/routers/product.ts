import { Router } from 'express';

import {validateProduct} from '../validators/product';
import runValidation from '../validators/index';
import { requireAuth, isAdmin } from '../middlewares/auth';
import { createProduct, getAllProducts, updateProduct, deleteProduct } from '../controllers/product';
import { uploadProductImage } from '../middlewares/upload';

const productRouter = Router();

productRouter.post('/create', requireAuth(), isAdmin, uploadProductImage.single('image'), validateProduct, runValidation, createProduct);
productRouter.post('/', getAllProducts);
productRouter.put('/:id', requireAuth(), isAdmin, uploadProductImage.single('image'), updateProduct);
productRouter.delete('/:id', requireAuth(), isAdmin, deleteProduct);

export default productRouter;