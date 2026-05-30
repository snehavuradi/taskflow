const router  = require('express').Router();
const Project = require('../models/Project');
const auth    = require('../middleware/auth');

// GET /api/projects
router.get('/', auth, async (req, res) => {
  try {
    const projects = await Project.find({ createdBy: req.user.id })
      .populate('members', 'name avatar')
      .sort({ createdAt: -1 });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// POST /api/projects
router.post('/', auth, async (req, res) => {
  try {
    const { name, description, color } = req.body;
    if (!name) return res.status(400).json({ msg: 'Project name is required' });

    const project = await Project.create({
      name, description, color,
      createdBy: req.user.id,
      members: [req.user.id],
    });
    res.status(201).json(project);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// PATCH /api/projects/:id
router.patch('/:id', auth, async (req, res) => {
  try {
    const project = await Project.findOneAndUpdate(
      { _id: req.params.id, createdBy: req.user.id },
      { $set: req.body },
      { new: true }
    );
    if (!project) return res.status(404).json({ msg: 'Project not found' });
    res.json(project);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// DELETE /api/projects/:id
router.delete('/:id', auth, async (req, res) => {
  try {
    await Project.findOneAndDelete({ _id: req.params.id, createdBy: req.user.id });
    res.json({ msg: 'Project deleted' });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

module.exports = router;
