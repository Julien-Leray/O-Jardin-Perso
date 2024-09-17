import Controller from "../controllers/contact.controller.js";
import router from './products.router.js';


router.route('/').post(Controller);

export default router;