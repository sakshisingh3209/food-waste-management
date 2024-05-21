const express = require('express');
const router = express.Router();
const User = require('./../modules/user');
const { jwtAuthMiddleware, generateToken } = require('./../jwt');


//GET ROUTER TO FETCH ALL USERS

router.get('/', async(req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        console.log('Error in fetching users', err);
        res.status(500).json({ message: 'Server error' });
    }
});

//post method to create a new user

router.post('/', async(req, res) => {
    const { username, email, password, role } = req.body;
    try {
        const newUser = new User({
            username,
            email,
            password,
            role: role || 'viewer'
        });
        await newUser.save();
        res.status(201).json(newUser);
    } catch (err) {
        console.log('Error in creating new User: ', err);
        res.status(500).json({ message: 'Server Error' });
    }
});

//route to update the user
router.put('/id', jwtAuthMiddleware, async(req, res) => {
    const userId = req.user.id;
    const { username, email, currentPassword, newPassword } = req.body;

    try {

        if (!username && !email && !currentPassword && !newPassword) {
            return res.status(400).json({ message: 'At least one field is require to update' });
        }
        const user = await User.findById(userId);
        if (!user && (currentPassword && !(await user.comparePassword(currentPassword)))) {
            return res.status(401).json({ error: 'Invalid current Password' });
        }

        //Update the users information
        if (username) user.username = username;
        if (email) user.email = email;
        if (newPassword) {
            // const salt = await bcrypt.genSalt(10);
            // const hashPassword = await bcrypt.hash(newPassword, salt);
            // user.password = hashedPassword;
            user.password = newPassword;
        }
        await user.save()

        res.status(200).json({ message: 'Profile updated' });
    } catch (err) {
        console.log('Error updating user role: ', err);
        res.status(500).json({ message: 'Server error' });
    }
});

//route to delete the user
router.delete('/:id', async(req, res) => {
    const userId = req.params.id;
    try {
        const deletedUser = await User.findByIdAndDelete(userId);
        if (!deletedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({ message: 'User deleted Successfully' });
    } catch (err) {
        console.log('Error deleting user', err);
        res.status(500).json({ message: 'Server error' });
    }
});


//route for signup

router.post('/signup', async(req, res) => {
    const { username, email, password } = req.body;
    try {
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ error: 'Username is already taken' });
        }
        const newUser = new User({ username, email, password });
        await newUser.save();
        const token = generateToken({ id: newUser._id });
        res.status(201).json({ token });
    } catch (err) {
        console.error('Error signing up', err);
        res.status(500).json({ message: 'Server error' });
    }
});


//route for login

router.post('/login', async(req, res) => {
    const { username, password } = req.body;
    try {
        if (!username || !password) {
            return res.status(400).json({ error: "username and password are required" });
        }
        const user = await User.findOne({ username: username });
        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ error: "Invalid username or password" });
        }
        //generate token
        const payload = {
            id: user._id,
        }
        const token = generateToken(payload);
        res.json({ token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


//router for delete

router.post('/delete-account', async(req, res) => {
    const { username, email } = req.body;
    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({ error: 'User not found' });
        }
        //check password
        const isPassword = await user.comparePassword(password);
        if (!isPassword) {
            return res.status(401).json({ error: 'Invalid Credentials' });
        }
        // delete the user account
        await user.remove();
        res.json('Account deleted successfully');
    } catch (err) {
        console.error('Error deleting account: ', err);
        res.status(500).json({ error: 'Server error' });
    }
})
module.exports = router;