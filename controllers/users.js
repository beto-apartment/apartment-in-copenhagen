// const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const bcrypt = require('bcrypt')
const User = require('../models/user')

// get all the users
usersRouter.get('/', async (request, response) => {
    // check superuser
    const superuser = await User.findById(request.user.id)

    if (!superuser) {
        return response.status(401).json({ error: 'token missing or invalid' })
    }

    if (!(superuser.username === 'jan')) {
        return response.status(401).json({ error: 'access denied' })
    }

    const users = await User
        .find({})
        .populate('hours', { month: 1, days: 1, monthHours: 1, date: 1 })
    response.json(users)
})

// get one user
usersRouter.get('/:id', async (request, response) => {
    // check superuser ? or just check normal user
    const superuser = await User.findById(request.user.id)

    if (!superuser) {
        return response.status(401).json({ error: 'token missing or invalid' })
    }

    if (!(superuser.username === 'jan')) {
        return response.status(401).json({ error: 'access denied' })
    }
    
    const user = await User
        .findById(request.params.id)
        .populate('hours', { month: 1, days: 1, monthHours: 1, date: 1 })
    if (user) {
        response.json(user)
    } else {
        response.status(404).end()
    }

})

usersRouter.delete('/:id', async (request, response) => {
    // check superuser
    const user = await User.findById(request.user.id)

    if (!user) {
        return response.status(401).json({ error: 'token missing or invalid' })
    }

    if (!(user.username === 'jan')) {
        return response.status(401).json({ error: 'acces denied' })
    }
    
    await User.findByIdAndRemove(request.params.id)
    response.status(204).end()
})

// Update the isActive status of a user
usersRouter.put('/updateIsActive/:id', async (request, response) => {
    // Check superuser
    const superuser = await User.findById(request.user.id)

    if (!superuser) {
        return response.status(401).json({ error: 'token missing or invalid' })
    }

    if (!(superuser.username === 'jan')) {
        return response.status(401).json({ error: 'access denied' })
    }

    const { id } = request.params
    const { isActive } = request.body

    if (typeof isActive !== 'boolean') {
        return response.status(400).json({ error: 'Invalid isActive value' })
    }

    try {
        const user = await User.findById(id)
        if (!user) {
            return response.status(404).json({ error: 'User not found' })
        }

        user.isActive = isActive
        const updatedUser = await user.save()
        response.json(updatedUser)
    } catch (error) {
        response.status(400).json({ error: error.message })
    }
})

// const isValidPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/

function validateEmail(email) {
  // Define a regular expression for validating an email
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

usersRouter.put('/changeUsername/:id', async (request, response) => {
    try {
        const { newUsername } = request.body

        const existingUser = await User.findOne({ username: newUsername })

        if (existingUser) {
            return response.status(400).json({ error: 'username must be unique' })
        }

        const user = await User.findById(request.params.id)

        if (user) {
            user.username = newUsername
            await user.save()
            response.status(200).json({ message: 'Name updated successfully' })
        } else {
            return response.status(404).json({ error: 'User not found' })
        }
    } catch (error) {
        console.error('Error changing name:', error)
        response.status(500).json({ error: 'Internal server error' })
    }
})

usersRouter.put('/changeEmail/:id', async (request, response) => {
    try {
        const { userEmail, newEmail } = request.body
        const user = await User.findById(request.params.id)
    
        if (user) {
            if (user.userEmail === newEmail) {
              return response.status(400).json({ error: 'The new email cannot be the same as the current email' });
            }

            if (validateEmail(newEmail)) {
                user.userEmail = newEmail
                await user.save()
                response.status(200).json({ message: 'Email updated successfully' })
            } else {
                return response.status(400).json({ error: 'Invalid new email format' })
            }
        } else {
            return response.status(404).json({ error: 'User not found' })
        }
    } catch (error) {
        console.error('Error changing email:', error)
        response.status(500).json({ error: 'Internal server error' })
    }
})

usersRouter.put('/changePassword/:id', async (request, response) => {
    try {
        const { userEmail, newPassword } = request.body
        const user = await User.findById(request.params.id)

        if (user) {
            if (user.userEmail !== userEmail) {
              return response.status(400).json({ error: 'The email provided does not match the current email associated with the account' });
            }
            
            const saltRounds = 10
            const passwordHash = await bcrypt.hash(newPassword, saltRounds)
            user.passwordHash = passwordHash
            const updatedUser = await user.save()
            // response.json(updatedUser)
            response.status(200).json({ message: 'Email updated successfully', updatedUser: updatedUser })
            
        } else {
            return response.status(404).json({ error: 'User not found' })
        }
    } catch (error) {
        return response.status(500).json({ error: 'Something went wrong' })
    }
})

usersRouter.post('/resetpassword', async (request, response) => {
    try {
        const { newPassword } = request.body
        const user = await User.findById(request.user._id)

        if (user) {            
            const saltRounds = 10
            const passwordHash = await bcrypt.hash(newPassword, saltRounds)
            user.passwordHash = passwordHash
            const updatedUser = await user.save()
            // response.json(updatedUser)
            response.status(200).json({ message: 'Password updated successfully', updatedUser: updatedUser })
            
        } else {
            return response.status(404).json({ error: 'User not found' })
        }
    } catch (error) {
        return response.status(500).json({ error: 'Something went wrong' })
    }
})

module.exports = usersRouter