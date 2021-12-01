import { Router } from 'express';

const router = Router();

router.use((req, res, next) => next());

router.get('/', (req, res) => {
	console.log('Hi!');

	res.json({
		docs: 'https://processversion.herokuapp.com/docs',
		endpoints: `https://processversion.herokuapp.com/endpoints`,
	});
});

router.use('/docs', (req, res) => {
	console.log('hi!');

	return res.status(200).json({ test: true });
});

router.use('/guilds/', (req, res) => {});

export default Router;
