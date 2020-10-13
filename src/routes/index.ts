import Router from 'express';
import controller from '../controllers';

const router = Router();
const { getSpreadsheetData } = controller;

router.get('/', async (req, res, next) => {
  try {
    const url = req.query.url as string;
    const name = req.query.url as string;
    const data = await getSpreadsheetData(url, name);
    res
      .status(200)
      .json({
        sucess: true,
        data,
      });
  } catch (err) {
    next(err);
  }
});

export default router;
