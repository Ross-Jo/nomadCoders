import express from 'express';
import routes from '../routes';
import { postRegisterView, postAddComment } from '../controllers/videoController';

const apiRouter = express.Router();

apiRouter.post(routes.register_view, postRegisterView);
apiRouter.post(routes.add_comment, postAddComment);

export default apiRouter;
