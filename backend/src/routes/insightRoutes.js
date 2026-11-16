const express = require('express');
const router = express.Router();
const {
  SALARY_BENCHMARKS,
  LOCATION_MULTIPLIERS,
  IN_DEMAND_SKILLS_DIRECTORY,
} = require('../utils/salaryInsightsData');

// @desc    Get all salary benchmarks by role
// @route   GET /api/insights/salary-benchmarks
// @access  Public
router.get('/salary-benchmarks', (req, res) => {
  res.status(200).json({
    success: true,
    count: SALARY_BENCHMARKS.length,
    benchmarks: SALARY_BENCHMARKS,
  });
});

// @desc    Get tech hubs and location compensation multipliers
// @route   GET /api/insights/locations
// @access  Public
router.get('/locations', (req, res) => {
  res.status(200).json({
    success: true,
    count: LOCATION_MULTIPLIERS.length,
    locations: LOCATION_MULTIPLIERS,
  });
});

// @desc    Get top in-demand skills in India
// @route   GET /api/insights/skills
// @access  Public
router.get('/skills', (req, res) => {
  res.status(200).json({
    success: true,
    count: IN_DEMAND_SKILLS_DIRECTORY.length,
    skills: IN_DEMAND_SKILLS_DIRECTORY,
  });
});

// @desc    Calculate dynamic salary projection based on Role, Experience, and Location
// @route   POST /api/insights/calculate
// @access  Public
router.post('/calculate', (req, res) => {
  const { roleId, experienceLevel, location } = req.body;

  const role = SALARY_BENCHMARKS.find((r) => r.roleId === roleId) || SALARY_BENCHMARKS[0];
  const expBracket =
    role.experienceLevels[experienceLevel] ||
    role.experienceLevels['Mid-level (3-5 yrs)'];

  const locInfo =
    LOCATION_MULTIPLIERS.find(
      (l) => l.city.toLowerCase() === (location || '').toLowerCase()
    ) || LOCATION_MULTIPLIERS[0];

  const multiplier = locInfo.salaryMultiplier || 1.0;

  const adjustedMin = Math.round(expBracket.min * multiplier);
  const adjustedMedian = Math.round(expBracket.median * multiplier);
  const adjustedMax = Math.round(expBracket.max * multiplier);

  res.status(200).json({
    success: true,
    projection: {
      roleTitle: role.roleTitle,
      category: role.category,
      experienceLevel: experienceLevel || 'Mid-level (3-5 yrs)',
      location: locInfo.city,
      salaryRange: {
        minLPA: adjustedMin,
        medianLPA: adjustedMedian,
        maxLPA: adjustedMax,
        currency: 'INR (₹)',
        period: 'LPA',
      },
      cityPremium: `${Math.round((multiplier - 1) * 100)}%`,
      topSkillsRequired: role.topSkills,
      hotSkillsTrending: role.hotSkillsTrending,
      growthRate: role.growthRate,
      hiringDemand: role.hiringDemand,
    },
  });
});

module.exports = router;
