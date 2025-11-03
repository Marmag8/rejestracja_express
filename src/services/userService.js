const {readUsers, writeUsers} = require('../models/storage');

function slugify(username) {
    return username
        .toString()
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]+/g, '')
        .replace(/\s+/g, '')
        .replace(/-+/g, '');
}

async function getAllUsers() { return await readUsers(); }

async function getUserBySlug(slug) {
    const users = await readUsers();
    return users.find(user => user.slug === slug);
}

async function createUser(username, age, password) {
    const users = await readUsers();
    const slug = slugify(username);

    let uniqueSlug = slug;
    let suffix = 1;
    while (users.find(user => user.slug === uniqueSlug)) {
        uniqueSlug = `${slug}-${suffix++}`;
    }

    const newUser = { 
        id: Date.now().toString(),
        username,
        age, 
        password, 
        slug: uniqueSlug, 
        createdAt: new Date().toISOString() 
    };

    users.unshift(newUser);
    await writeUsers(users);
    return newUser;
}

module.exports = { getAllUsers, getUserBySlug, createUser };