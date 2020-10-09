import Router from 'express';
import controller from '../controllers';

const router = Router();
const { getSpreadsheetData } = controller;

router.get('/', async (req, res, next) => {
  try {
    const { url, name } = req.query;
    const data = await getSpreadsheetData(String(url), String(name));
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
