import { Response } from 'express';
import Skill from '../models/Skill';
import SkillLog from '../models/SkillLog';
import { AuthRequest } from '../middleware/auth';

export const createSkill = async (req: AuthRequest, res: Response) => {
  try {
    const { title, category, level, current_progress, goal_progress, notes, last_activity } = req.body;
    
    // Pastikan userId ada di token
    if (!req.user?.id) return res.status(401).json({ success: false, message: 'Unauthorized' });

    // Validasi data sebelum menyimpan
    if (!title || !category || !level) {
      return res.status(400).json({ success: false, message: 'Title, category, and level are required' });
    }

    // Membuat skill baru
    const skill = await Skill.create({
      user: req.user.id, // Ambil userId dari token
      title, 
      category, 
      level, 
      current_progress, 
      goal_progress, 
      notes, 
      last_activity
    });

    res.status(201).json({ success: true, message: 'Skill created', data: skill });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const getSkills = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user?.id) return res.status(401).json({ success: false, message: 'Unauthorized' });
    
    // Ambil semua skill milik user
    const skills = await Skill.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: skills });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const getSkillById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    if (!req.user?.id) return res.status(401).json({ success: false, message: 'Unauthorized' });

    const skill = await Skill.findOne({ _id: id, user: req.user.id });
    if (!skill) return res.status(404).json({ success: false, message: 'Skill not found' });

    res.status(200).json({ success: true, data: skill });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const updateSkill = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    if (!req.user?.id) return res.status(401).json({ success: false, message: 'Unauthorized' });

    // Update skill berdasarkan user id
    const skill = await Skill.findOneAndUpdate({ _id: id, user: req.user.id }, req.body, { new: true });
    if (!skill) return res.status(404).json({ success: false, message: 'Skill not found' });

    res.status(200).json({ success: true, message: 'Skill updated', data: skill });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const deleteSkill = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    if (!req.user?.id) return res.status(401).json({ success: false, message: 'Unauthorized' });

    // Hapus skill berdasarkan user id
    const skill = await Skill.findOneAndDelete({ _id: id, user: req.user.id });
    if (!skill) return res.status(404).json({ success: false, message: 'Skill not found' });

    await SkillLog.deleteMany({ skill: id, user: req.user.id });

    res.status(200).json({ success: true, message: 'Skill deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const getSkillSummary = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    if (!req.user?.id) return res.status(401).json({ success: false, message: 'Unauthorized' });

    const skill = await Skill.findOne({ _id: id, user: req.user.id });
    if (!skill) return res.status(404).json({ success: false, message: 'Skill not found' });

    const logs = await SkillLog.find({ skill: id, user: req.user.id }).sort({ createdAt: -1 });
    const totalLogs = logs.length;
    const totalHours = logs.reduce((sum, log) => sum + (log.hours || 0), 0);
    const lastActivity = logs[0]?.createdAt ?? null;

    res.status(200).json({ success: true, data: { skill, summary: { totalLogs, totalHours, lastActivity } } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const updateSkillProgress = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { current_progress, goal_progress } = req.body;
    if (!req.user?.id) return res.status(401).json({ success: false, message: 'Unauthorized' });

    const update: any = {};
    if (typeof current_progress !== 'undefined') update.current_progress = current_progress;
    if (typeof goal_progress !== 'undefined') update.goal_progress = goal_progress;
    // update last_activity when progress is reported
    if (Object.keys(update).length === 0) return res.status(400).json({ success: false, message: 'No progress fields provided' });
    update.last_activity = new Date();

    const skill = await Skill.findOneAndUpdate({ _id: id, user: req.user.id }, { $set: update }, { new: true });
    if (!skill) return res.status(404).json({ success: false, message: 'Skill not found' });

    res.status(200).json({ success: true, message: 'Progress updated', data: skill });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const patchSkill = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { title, category, level, current_progress, goal_progress, notes, last_activity } = req.body;
    if (!req.user?.id) return res.status(401).json({ success: false, message: 'Unauthorized' });

    const update: any = {};
    if (typeof title !== 'undefined') update.title = title;
    if (typeof category !== 'undefined') update.category = category;
    if (typeof level !== 'undefined') update.level = level;
    if (typeof current_progress !== 'undefined') update.current_progress = current_progress;
    if (typeof goal_progress !== 'undefined') update.goal_progress = goal_progress;
    if (typeof notes !== 'undefined') update.notes = notes;
    if (typeof last_activity !== 'undefined') update.last_activity = last_activity;

    if (Object.keys(update).length === 0) return res.status(400).json({ success: false, message: 'No fields provided to update' });

    // If progress updated, update last_activity
    if (typeof update.current_progress !== 'undefined' || typeof update.goal_progress !== 'undefined') {
      update.last_activity = new Date();
    }

    const skill = await Skill.findOneAndUpdate({ _id: id, user: req.user.id }, { $set: update }, { new: true });
    if (!skill) return res.status(404).json({ success: false, message: 'Skill not found' });

    res.status(200).json({ success: true, message: 'Skill patched', data: skill });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
