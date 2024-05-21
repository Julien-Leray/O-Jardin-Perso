import express from 'express';
import Controller from "../controllers/tutorials.controller.js";

const router = express.Router();

router.route('/').get(Controller.getTutorials);
router.route('/:id').get(Controller.getTutorialById);
router.route('/').post(Controller.createTutorial);
router.route('/:id').patch(Controller.updateTutorial);
router.route('/:id').delete(Controller.deleteTutorial);

export default router;
