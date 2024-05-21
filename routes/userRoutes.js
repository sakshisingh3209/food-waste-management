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
router.put('/profile', jwtAuthMiddleware, async(req, res) => {
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
})

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

module.exports = router;