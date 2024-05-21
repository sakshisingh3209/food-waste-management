const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true

    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['admin', 'contributor', 'viewer'],
        default: 'viewer'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

userSchema.pre('save', async function(next) {
    const person = this;
    //hash password only if it is modifies
    if (!person.isModified('password')) return next;
    try {
        const salt = await bcrypt.genSalt(10);

        //hash password
        const hashedPassword = await bcrypt.hash(person.password, salt);

        //override the plain password
        person.password = hashedPassword;
        next();

    } catch (err) {
        return next(err);
    }

});


//function to compare password
userSchema.methods.comparePassword = async function(userPassword) {
    try {

        //use bcrypt to compare the password
        const isMatch = await bcrypt.compare(userPassword, this.password);
        return isMatch;
    } catch (err) {
        throw err;
    }
}
const User = mongoose.model('User', userSchema);
module.exports = User;