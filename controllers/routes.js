const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Thought = require('../models/Thought')

// GET all users
router.get('/', async (req, res) => {
    try {
        const users = await User.find().populate('thoughts').populate('friends');
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET a single user by its _id
router.get('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id).populate('thoughts').populate('friends');
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST a new user
router.post('/', async (req, res) => {
    const user = new User({
        username: req.body.username,
        email: req.body.email
    });

    try {
        const newUser = await user.save();
        res.status(201).json(newUser);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// PUT to update a user by its _id
router.put('/:id', async (req, res) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedUser) return res.status(404).json({ message: 'User not found' });
        res.status(200).json(updatedUser);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// DELETE to remove user by its _id
router.delete('/:id', async (req, res) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id);
        if (!deletedUser) return res.status(404).json({ message: 'User not found' });
        res.status(204).send();
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST to add a new friend to a user's friend list
router.post('/:userId/friends/:friendId', async (req, res) => {
    try {
        // Add friendId to the user's friends array
        const user = await User.findByIdAndUpdate(
            req.params.userId,
            { $addToSet: { friends: req.params.friendId } }, // Use $addToSet to avoid duplicates
            { new: true }
        );

        if (!user) return res.status(404).json({ message: 'User not found' });
        res.status(200).json(user);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// DELETE to remove a friend from a user's friend list
router.delete('/:userId/friends/:friendId', async (req, res) => {
    try {
        // Remove friendId from the user's friends array
        const user = await User.findByIdAndUpdate(
            req.params.userId,
            { $pull: { friends: req.params.friendId } }, // Use $pull to remove the friend
            { new: true }
        );

        if (!user) return res.status(404).json({ message: 'User not found' });
        res.status(200).json(user);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

//THOUGHTS ROUTES BELOW

// GET to get all thoughts
router.get('/thoughts', async (req, res) => {
    try {
        const thoughts = await Thought.find();
        res.status(200).json(thoughts);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET to get a single thought by its _id
router.get('/thoughts/:id', async (req, res) => {
    try {
        const thought = await Thought.findById(req.params.id);
        if (!thought) return res.status(404).json({ message: 'Thought not found' });
        res.status(200).json(thought);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST to create a new thought
router.post('/thoughts', async (req, res) => {
    const thought = new Thought({
        thoughtText: req.body.thoughtText,
        username: req.body.username,
        userId: req.body.userId
    });

    try {
        const newThought = await thought.save();

        // Push the created thought's _id to the associated user's thoughts array
        await User.findByIdAndUpdate(req.body.userId, { $push: { thoughts: newThought._id } });

        res.status(201).json(newThought);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// PUT to update a thought by its _id
router.put('/thoughts/:id', async (req, res) => {
    try {
        const updatedThought = await Thought.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedThought) return res.status(404).json({ message: 'Thought not found' });
        res.status(200).json(updatedThought);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// DELETE to remove a thought by its _id
router.delete('/thoughts/:id', async (req, res) => {
    try {
        const deletedThought = await Thought.findByIdAndDelete(req.params.id);
        if (!deletedThought) return res.status(404).json({ message: 'Thought not found' });
        res.status(204).send();
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST to create a reaction stored in a single thought's reactions array field
router.post('/thoughts/:thoughtId/reactions', async (req, res) => {
    const reaction = {
        reactionBody: req.body.reactionBody,
        username: req.body.username
    };

    try {
        const thought = await Thought.findByIdAndUpdate(
            req.params.thoughtId,
            { $push: { reactions: reaction } },
            { new: true }
        );

        if (!thought) return res.status(404).json({ message: 'Thought not found' });
        res.status(201).json(thought);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// DELETE to pull and remove a reaction by the reaction's reactionId value
router.delete('/thoughts/:thoughtId/reactions/:reactionId', async (req, res) => {
    try {
        const thought = await Thought.findByIdAndUpdate(
            req.params.thoughtId,
            { $pull: { reactions: { reactionId: req.params.reactionId } } },
            { new: true }
        );

        if (!thought) return res.status(404).json({ message: 'Thought not found' });
        res.status(200).json(thought);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;
