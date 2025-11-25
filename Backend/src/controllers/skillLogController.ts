import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import Skill from '../models/Skill';
import SkillLog from '../models/SkillLog';

export const createSkillLog = async (req: AuthRequest, res: Response) => {
  try {
    const { skillId } = req.params;
    const { note, hours, evidenceUrl } = req.body;
    if (!req.user?.id) return res.status(401).json({ success: false, message: 'Unauthorized' });
    if (!note) return res.status(400).json({ success: false, message: 'Note required' });

    const skill = await Skill.findOne({ _id: skillId, user: req.user.id });
    if (!skill) return res.status(404).json({ success: false, message: 'Skill not found' });

    const log = await SkillLog.create({ user: req.user.id, skill: skillId, note, hours, evidenceUrl });

    skill.last_activity = new Date();
    await skill.save();

    res.status(201).json({ success: true, message: 'Log created', data: log });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const getSkillLogs = async (req: AuthRequest, res: Response) => {
  try {
    const { skillId } = req.params;
    if (!req.user?.id) return res.status(401).json({ success: false, message: 'Unauthorized' });

    const skill = await Skill.findOne({ _id: skillId, user: req.user.id });
    if (!skill) return res.status(404).json({ success: false, message: 'Skill not found' });

    const logs = await SkillLog.find({ skill: skillId, user: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: logs });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const deleteSkillLog = async (req: AuthRequest, res: Response) => {
  try {
    const { skillId, logId } = req.params;
    if (!req.user?.id) return res.status(401).json({ success: false, message: 'Unauthorized' });

    const skill = await Skill.findOne({ _id: skillId, user: req.user.id });
    if (!skill) return res.status(404).json({ success: false, message: 'Skill not found' });

    const log = await SkillLog.findOneAndDelete({ _id: logId, skill: skillId, user: req.user.id });
    if (!log) return res.status(404).json({ success: false, message: 'Log not found' });

    res.status(200).json({ success: true, message: 'Log deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
