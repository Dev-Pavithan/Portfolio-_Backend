const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const UserSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'Please add a first name'],
    trim: true,
    maxlength: [50, 'First name cannot be more than 50 characters']
  },
  lastName: {
    type: String,
    required: [true, 'Please add a last name'],
    trim: true,
    maxlength: [50, 'Last name cannot be more than 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email'
    ],
    lowercase: true
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
    minlength: 8,
    select: false,
    validate: {
      validator: function(v) {
        return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(v);
      },
      message: props => 'Password must contain at least 8 characters, one uppercase, one lowercase, one number and one special character'
    }
  },
  passwordHistory: [{
    password: { type: String, select: false },
    changedAt: { type: Date }
  }],
  address: {
    street: { type: String, trim: true },
    city: { type: String, trim: true },
    state: { type: String, trim: true },
    zipCode: { type: String, trim: true },
    country: { type: String, trim: true }
  },
  phoneNumber: {
    type: String,
    validate: {
      validator: function (v) {
        return /\d{10}/.test(v);
      },
      message: props => `${props.value} is not a valid phone number!`
    }
  },
  profileImage: {
    type: String,
    default: ''
  },
  locationUrl: {
    type: String,
    trim: true,
    match: [
      /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
      'Please use a valid URL with HTTP or HTTPS'
    ]
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  passwordChangedAt: Date,
  lastPasswordChange: Date,
  loginAttempts: { type: Number, default: 0 },
  accountLockedUntil: Date,
  twoFactorEnabled: { type: Boolean, default: false },
  twoFactorSecret: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Middleware to hash password before saving
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();

  try {
    // Store previous passwords in history (keep last 3)
    if (this.password) {
      if (!this.passwordHistory) this.passwordHistory = [];
      
      this.passwordHistory.unshift({
        password: this.password,
        changedAt: new Date()
      });
      
      // Keep only last 3 passwords
      if (this.passwordHistory.length > 3) {
        this.passwordHistory = this.passwordHistory.slice(0, 3);
      }
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    
    // Set password changed timestamp
    this.passwordChangedAt = Date.now();
    this.lastPasswordChange = new Date();
    
    next();
  } catch (err) {
    next(err);
  }
});

// Method to compare entered password with stored hash
UserSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Method to check if password was changed after token was issued
UserSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return JWTTimestamp < changedTimestamp;
  }
  return false;
};

// Method to create password reset token
UserSchema.methods.createPasswordResetToken = function() {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes

  return resetToken;
};

// Method to check if password was used before
UserSchema.methods.isPasswordUsedBefore = async function(newPassword) {
  for (const entry of this.passwordHistory) {
    if (await bcrypt.compare(newPassword, entry.password)) {
      return true;
    }
  }
  return false;
};

// Method to generate JWT token
UserSchema.methods.getSignedJwtToken = function() {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
};

// Method to increment login attempts
UserSchema.methods.incrementLoginAttempts = function() {
  this.loginAttempts += 1;
  if (this.loginAttempts >= 5) {
    this.accountLockedUntil = Date.now() + 30 * 60 * 1000; // Lock for 30 minutes
  }
};

// Method to reset login attempts
UserSchema.methods.resetLoginAttempts = function() {
  this.loginAttempts = 0;
  this.accountLockedUntil = undefined;
};

const User = mongoose.model('User', UserSchema);

module.exports = User;