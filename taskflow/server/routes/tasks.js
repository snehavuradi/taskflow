const router = require('express').Router();
const Task   = require('../models/Task');
const auth   = require('../middleware/auth');

// GET /api/tasks — get all tasks for current user
router.get('/', auth, async (req, res) => {
  try {
    const { status, priority, project } = req.query;
    const filter = { createdBy: req.user.id };

    if (status)   filter.status   = status;
    if (priority) filter.priority = priority;
    if (project)  filter.project  = project;

    const tasks = await Task.find(filter)
      .populate('assignees', 'name email avatar')
      .populate('project', 'name color')
      .sort({ createdAt: -1 });

    res.json(tasks);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// GET /api/tasks/:id — get single task
router.get('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, createdBy: req.user.id })
      .populate('assignees', 'name email avatar')
      .populate('project', 'name color');

    if (!task) return res.status(404).json({ msg: 'Task not found' });
    res.json(task);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// POST /api/tasks — create task
router.post('/', auth, async (req, res) => {
  try {
    const { title, desc, status, priority, tags, dueDate, progress, project, assignees } = req.body;

    if (!title) return res.status(400).json({ msg: 'Title is required' });

    const task = await Task.create({
      title, desc, status, priority, tags, dueDate, progress, project, assignees,
      createdBy: req.user.id,
    });

    const populated = await task.populate('assignees', 'name email avatar');
    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// PATCH /api/tasks/:id — update task
router.patch('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, createdBy: req.user.id },
      { $set: req.body },
      { new: true, runValidators: true }
    ).populate('assignees', 'name email avatar');

    if (!task) return res.status(404).json({ msg: 'Task not found' });
    res.json(task);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// DELETE /api/tasks/:id — delete task
router.delete('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, createdBy: req.user.id });
    if (!task) return res.status(404).json({ msg: 'Task not found' });
    res.json({ msg: 'Task deleted', id: req.params.id });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

module.exports = router;
