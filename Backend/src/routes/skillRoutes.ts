import { Router } from 'express';
import auth from '../middleware/auth';
import Skill from '../models/Skill';
import { AuthRequest } from '../middleware/auth';
import { body, param } from 'express-validator';
import validate from '../middleware/validate';
import { createSkill, getSkills, getSkillById, updateSkill, deleteSkill, getSkillSummary, updateSkillProgress, patchSkill } from '../controllers/skillController';
import { createSkillLog, getSkillLogs, deleteSkillLog } from '../controllers/skillLogController';
import multer from 'multer';
import path from 'path';

const router = Router();
const upload = multer({
  dest: path.join(__dirname, '..', '..', 'uploads'),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowed = ['image/png', 'image/jpeg', 'application/pdf'];
    cb(null, allowed.includes(file.mimetype));
  }
});

// Semua route skill & logs protected
router.use(auth);

// CRUD skill
router.post(
  '/',
  [
    body('title').notEmpty().withMessage('title required'),
    body('category').notEmpty().withMessage('category required'),
    body('level').isIn(['beginner', 'intermediate', 'advanced']).withMessage('invalid level'),
    body('current_progress').isNumeric().withMessage('current_progress must be a number').optional(),
    body('goal_progress').isNumeric().withMessage('goal_progress must be a number').optional()
  ],
  validate,
  createSkill
);
router.get('/', getSkills);
router.get('/:id', getSkillById);
router.put(
  '/:id',
  [
    param('id').notEmpty().withMessage('id required'),
    body('title').optional().isString(),
    body('category').optional().isString(),
    body('level').optional().isIn(['beginner', 'intermediate', 'advanced']),
    body('current_progress').optional().isNumeric(),
    body('goal_progress').optional().isNumeric()
  ],
  validate,
  updateSkill
);

// Partial update (PATCH) - allows updating individual fields including progress
router.patch(
  '/:id',
  [
    param('id').notEmpty().withMessage('id required'),
    body('title').optional().isString(),
    body('category').optional().isString(),
    body('level').optional().isIn(['beginner', 'intermediate', 'advanced']),
    body('current_progress').optional().isInt({ min: 0, max: 100 }),
    body('goal_progress').optional().isInt({ min: 0, max: 100 }),
    body('notes').optional().isString()
  ],
  validate,
  patchSkill
);
router.delete('/:id', deleteSkill);

// Ringkasan skill
router.get('/:id/summary', getSkillSummary);

// Update progress only (current_progress / goal_progress)
router.patch(
  '/:id/progress',
  [
    param('id').notEmpty().withMessage('id required'),
    body('current_progress').optional().isInt({ min: 0, max: 100 }).withMessage('current_progress must be 0-100'),
    body('goal_progress').optional().isInt({ min: 0, max: 100 }).withMessage('goal_progress must be 0-100')
  ],
  validate,
  updateSkillProgress
);

// Upload file per skill
router.post('/:id/upload', upload.single('file'), async (req: AuthRequest, res) => {
  try {
    if (!req.user?.id) return res.status(401).json({ success: false, message: 'Unauthorized' });
    if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded' });

    const skill = await Skill.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { fileUrl: `/uploads/${req.file.filename}` },
      { new: true }
    );

    if (!skill) return res.status(404).json({ success: false, message: 'Skill not found' });

    res.status(200).json({ success: true, message: 'File uploaded', data: skill });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Logs per skill
router.post(
  '/:skillId/logs',
  [
    param('skillId').notEmpty().withMessage('skillId required'),
    body('note').notEmpty().withMessage('note required'),
    body('hours').optional().isNumeric().withMessage('hours must be number')
  ],
  validate,
  createSkillLog
);
router.get('/:skillId/logs', getSkillLogs);
router.delete('/:skillId/logs/:logId', deleteSkillLog);

export default router;
