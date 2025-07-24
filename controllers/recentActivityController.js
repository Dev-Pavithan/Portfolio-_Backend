// controllers/recentActivityController.js
const Blog = require('../models/Blog');
const Project = require('../models/Project');
const Skill = require('../models/Skill');
const WorkExperience = require('../models/WorkExperience');
const Certificate = require('../models/Certificate');
const Education = require('../models/Education');
const asyncHandler = require('../middlewares/async');

exports.getRecentActivity = asyncHandler(async (req, res) => {
  // Fetch the 1 most recent entry from each collection
  const [latestBlog, latestProject, latestSkill, latestWork, latestEducation, latestCertificate] =
    await Promise.all([
      Blog.findOne().sort({ createdAt: -1 }),
      Project.findOne().sort({ createdAt: -1 }),
      Skill.findOne().sort({ createdAt: -1 }),
      WorkExperience.findOne().sort({ createdAt: -1 }),
      Education.findOne().sort({ createdAt: -1 }),
      Certificate.findOne().sort({ createdAt: -1 }),
    ]);

  const activities = [];

  if (latestBlog) activities.push({
    type: 'blog',
    message: `New blog post published: "${latestBlog.title}"`,
    date: latestBlog.createdAt
  });

  if (latestProject) activities.push({
    type: 'project',
    message: `Project updated: "${latestProject.title}"`,
    date: latestProject.createdAt
  });

  if (latestSkill) activities.push({
    type: 'skill',
    message: `Skills section updated with new categories`,
    date: latestSkill.createdAt
  });

  if (latestWork) activities.push({
    type: 'work',
    message: `Work experience updated: "${latestWork.company}"`,
    date: latestWork.createdAt
  });

  if (latestEducation) activities.push({
    type: 'education',
    message: `Education updated: "${latestEducation.school}"`,
    date: latestEducation.createdAt
  });

  if (latestCertificate) activities.push({
    type: 'certificate',
    message: `Certificate added: "${latestCertificate.title}"`,
    date: latestCertificate.createdAt
  });

  res.status(200).json({
    success: true,
    data: activities.sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5)
  });
});
