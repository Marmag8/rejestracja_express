const {readUsers, writeUsers} = require('../models/storage');
const crypto = require('crypto');

const algorithm = 'aes-256-cbc';
key = Buffer.alloc(32);
iv = Buffer.alloc(16);

function slugify(username) {
    return username
        .toString()
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]+/g, '')
        .replace(/\s+/g, '')
        .replace(/-+/g, '');
}

function hash(password) {
    const encrypter = crypto.createCipheriv(algorithm, key, iv);
    let hashed = encrypter.update(password, 'utf8', 'hex');
    hashed += encrypter.final('hex');
    return hashed;
}

function unhash(hashedPassword) {
    const decrypter = crypto.createDecipheriv(algorithm, key, iv);
    let password = decrypter.update(hashedPassword, 'hex', 'utf8');
    password += decrypter.final('utf8');
    return password;
}

async function getAllUsers() { return await readUsers(); }

async function getUserBySlug(slug) {
    const users = await readUsers();
    return users.find(user => user.slug === slug);
}

async function createUser(username, age, password, mail) {
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
        mail,
        password, 
        slug: uniqueSlug,
        createdAt: new Date().toISOString()
    };

    users.unshift(newUser);
    await writeUsers(users);
    return newUser;
}

module.exports = { getAllUsers, getUserBySlug, createUser, slugify, hash, unhash };