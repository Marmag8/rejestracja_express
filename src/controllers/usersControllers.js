const userService = require('../services/userService');

async function index(req, res) {
    const users = await userService.getAllUsers();
    res.render('users/list', {Title: "Użytkownicy", users });
}

async function show(req, res) {
    const slug = req.params.slug;
    const user = await userService.getUserBySlug(slug);
    if (!user) return res.status(404).render('users/error', { Title: '404 Nie znaleziono użytkownika', errors: null });

    res.render('users/show', { Title: user.title, user });
}

async function create(req, res) {
    const { username, age, password } = req.body;
    let errors = [];
    const regex = /^(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

    if (!username || username.trim().length < 3) errors.push('Nazwa użytkownika musi mieć co najmniej 3 znaki.');
    if (!age || age < 18) errors.push('Zarejestrować mogą się tylko użytkownicy pełnoletni.');
    if (!password || !regex.test(password)) errors.push('Hasło musi mieć co najmniej 8 znaków, oraz zawierać co najmniej jedną cyfrę i jeden znak specjalny.');

    if (errors.length > 0) {
        return res.status(400).render('users/error', {
            Title: '400 Błąd tworzenia artykułu',
            errors,
            values: req.body
        });
    } else {
        const user = await userService.createUser(username, age, password);
        res.status(300).redirect(`/users/${user.slug}`);
    }
}

async function newForm(req, res) {
    res.render('users/new', { 
        Title: 'Utwórz konto',
        errors: null,
        values: {}
    });
}

module.exports = { index, show, create, newForm };