import Router from 'express';
import spreadsheetController from '../controllers';

const router = Router();
const { getSpreadsheetData, parseSpreadsheetData } = spreadsheetController;

router.post('/', async (req, res, next) => {
  try {
    const { exclude, link } = req.body;
    const spreadsheetData = await getSpreadsheetData(link, exclude);
    const data = parseSpreadsheetData(spreadsheetData);
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
