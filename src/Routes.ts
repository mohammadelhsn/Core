import { Router } from 'express';

const router = Router();

router.use((req, res, next) => {
	console.log('Hi!');
	next();
});

router.get('/', (req, res) => {
	console.log('Hi!');

	return res.status(200).json({
		docs: 'https://processversion.herokuapp.com/docs',
		endpoints: `https://processversion.herokuapp.com/endpoints`,
	});
});

router.get('/docs', (req, res) => {
	console.log('hi!');

	return res.status(200).json({ test: true });
});

router.get('/guilds/', (req, res) => {
	return res.status(200).json({ testing: true });
});

export default router;
