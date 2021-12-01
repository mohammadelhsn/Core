import { Router } from 'express';

const router = Router();

router.use((req, res, next) => next());

router.use('docs', (req, res) => {
	return res.json({ test: 'working!' });
});

router.use('/guilds/', (req, res) => {});

export default Router;
