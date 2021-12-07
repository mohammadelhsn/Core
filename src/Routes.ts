import { Router } from 'express';
import StateManager from './Utils/StateManager';

const router = Router();

router.use((req, res, next) => {
	next();
});

const WIP = (req, res) => {
	return res.status(200).json({ data: 'This API is still WIP' });
};

router.get('/', (req, res) => {
	return res.status(200).json({ text: "Welcome to Core's API!" });
});

// Get the guild

router.get('/guilds/:id', WIP);
router.post('/guilds/:id', WIP);
router.delete('/guilds/:id', WIP);

// Prefix

router.get('/guilds/:id/prefix', WIP);
router.patch('/guilds/:id/prefix', WIP);

// Welcome

router.get('/guilds/:id/welcome', WIP);

/** GET ROLES */

router.get('/guilds/:id/roles', WIP);

router.get('/guilds/:id/roles/adminrole', WIP);
router.get('/guilds/:id/roles/muterole', WIP);
router.get('/guilds/:id/roles/modrole', WIP);
router.get('/guilds/:id/roles/warningrole', WIP);

/** UPDATE ROLES */

router.patch('/guilds/:id/roles/adminrole', WIP);
router.patch('/guilds/:id/roles/muterole', WIP);
router.patch('/guilds/:id/roles/modrole', WIP);
router.patch('/guilds/:id/roles/warningrole', WIP);

/** DELETE ROLES */

router.delete('/guilds/:id/roles/adminrole', WIP);
router.delete('/guilds/:id/roles/warningrole', WIP);
router.delete('/guilds/:id/roles/modrole', WIP);
router.delete('/guilds/:id/roles/warningrole', WIP);

// Channels

router.get('/guilds/:id/channels', WIP);
router.get('/guilds/:id/channels/modlog', WIP);
router.get('/guilds/:id/channels/appeals', WIP);
router.get('/guilds/:id/channels/reports', WIP);
router.get('/guilds/:id/channels/actionlog', WIP);
router.get('/guilds/:id/channels/suggestions', WIP);
router.get('/guilds/:id/channels/publicmodlog', WIP);

router.patch('/guilds/:id/channels/modlog', WIP);
router.patch('/guilds/:id/channels/appeals', WIP);
router.patch('/guilds/:id/channels/reports', WIP);
router.patch('/guilds/:id/channels/actionlog', WIP);
router.patch('/guilds/:id/channels/suggestions', WIP);
router.patch('/guilds/:id/channels/publicmodlog', WIP);

router.delete('/guilds/:id/channels/modlog', WIP);
router.delete('/guilds/:id/channels/appeals', WIP);
router.delete('/guilds/:id/channels/reports', WIP);
router.delete('/guilds/:id/channels/actionlog', WIP);
router.delete('/guilds/:id/channels/suggestions', WIP);
router.delete('/guilds/:id/channels/publicmodlog', WIP);

// Events

router.get('/guilds/:id/events', WIP);

export default router;
