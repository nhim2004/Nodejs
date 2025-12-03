import express from 'express';

// VNPay routes removed. Keep an inert router that returns 410 for any old endpoint.
const router = express.Router();

router.all('*', (req, res) => res.status(410).json({ message: 'VNPay integration removed' }));

export default router;
