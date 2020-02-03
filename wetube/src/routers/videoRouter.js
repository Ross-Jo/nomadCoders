import express from 'express';
import routes from '../routes';
import {
  getUpload, postUpload, videoDetail, getEditVideo, postEditVideo, deleteVideo,
} from '../controllers/videoController';
import { uploadVideo, onlyPrivate } from '../middlewares';

const videoRouter = express.Router();

// Upload
videoRouter.get(routes.upload, onlyPrivate, getUpload);
videoRouter.post(routes.upload, onlyPrivate, uploadVideo, postUpload);

// Video Detail
videoRouter.get(routes.video_detail(), videoDetail);

// Edit Video
videoRouter.get(routes.edit_video(), onlyPrivate, getEditVideo);
videoRouter.post(routes.edit_video(), onlyPrivate, postEditVideo);

// Delete Video
videoRouter.get(routes.delete_video(), onlyPrivate, deleteVideo);

export default videoRouter;
