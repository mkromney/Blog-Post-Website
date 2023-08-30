// Handles the routes for the comments model. //
const router = require('express').Router();
const { Comment } = require('../../models');
const withAuth = require('../../utils/auth');

// Creates new comments. //
router.comment('/', withAuth, async (req, res) => {
  try {
    const newComment = await Comment.create({
      // spread operator: ... //
      ...req.body,
      user_id: req.session.user_id,
    });

    res.status(200).json(newComment);
  } catch (err) {
    res.status(400).json(err);
  }
});

// Handles routing for editing a comment. Works in Insomnia, haven't figured out how to make it a dynamic feature. //
router.put('/:id', withAuth, async (req, res) => {
  try {
    const editComment = await Comment.update(req.body, {
      where: { id: req.params.id },
    });
    if ([editComment] === 0) {
      res.status(404).end();
    } else {
      res.status(200).json({ message: 'Updated comment' });
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/:id', withAuth, async (req, res) => {
  res.render('comment/');
  try {
    const viewComment = await Comment.update(req.body, {
      where: { id: req.params.id },
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

// Route that handles comment deletion. //
router.delete('/:id', withAuth, async (req, res) => {
  try {
    const commentData = await Comment.destroy({
      where: {
        id: req.params.id,
        user_id: req.session.user_id,
      },
    });
    if (!commentData) {
      res.status(404).json({ message: 'No comment found with this id!' });
      return;
    }
    res.status(200).json(commentData);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
