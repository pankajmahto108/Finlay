import express from 'express';
import multer from 'multer';
import { handleAudioUpload, handleImageUpload } from '../controllers/uploadController.js';

const router = express.Router();

// Store files in memory so we can pipe the buffer directly to Groq without disk cleanup overhead
const upload = multer({ storage: multer.memoryStorage() });

router.post('/audio', upload.single('audio'), handleAudioUpload);
router.post('/image', upload.single('image'), handleImageUpload);

export default router;
