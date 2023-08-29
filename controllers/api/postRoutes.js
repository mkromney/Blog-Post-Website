const router = require('express').Router();
const { Post } = require('../../models');
const withAuth = require('../../utils/auth');

router.post('/', withAuth, async (req, res) => {
  try {
    const newPost = await Post.create({
      // spread operator ...
      ...req.body,
      user_id: req.session.user_id,
    });

    res.status(200).json(newPost);
  } catch (err) {
    res.status(400).json(err);
  }
});


router.put('/:id', withAuth, async (req, res) => {
  try {
    const editPost = await Post.update(
      req.body,
      {where: {id: req.params.id}}
    )
    if ([editPost] === 0) {
      res.status(404).end()
    }
      else { res.status(200).json({message: "Updated Post"})
      };
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/:id', withAuth, async (req, res) => {
  res.render('post/:id')
  try {
    const viewPost = await Post.update(
      req.body,
      {where: {id: req.params.id}}
    )
  } catch (err) {
    res.status(500).json(err);
  }
});



router.delete('/:id', withAuth, async (req, res) => {
  try {
    const postData = await Post.destroy({
      where: {
        id: req.params.id,
        user_id: req.session.user_id,
      },
    });

    if (!postData) {
      res.status(404).json({ message: 'No post found with this id!' });
      return;
    }

    res.status(200).json(postData);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
