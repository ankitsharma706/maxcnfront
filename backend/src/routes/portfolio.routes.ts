import { Router } from 'express';
import { createNewPortfolio, addItemToPortfolio, fetchPortfolioAnalysis, listUserPortfolios } from '../controllers/portfolio.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

router.use(authenticate);

router.get('/', listUserPortfolios);
router.post('/', createNewPortfolio);
router.get('/:id', fetchPortfolioAnalysis);
router.post('/:id/items', addItemToPortfolio);

export default router;
