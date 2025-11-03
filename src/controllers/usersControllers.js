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
    const { username, age, password, mail } = req.body;
    let errors = [];

    if (!username || username.trim().length < 3) errors.push('Nazwa użytkownika musi mieć co najmniej 3 znaki.');
    if (!age || age < 18) errors.push('Zarejestrować mogą się tylko użytkownicy pełnoletni.');
    if (!password || !/^.{8,}$/.test(password)) errors.push('Hasło musi mieć co najmniej 8 znaków.');
    if (!/[0-9]+/g.test(password)) errors.push('Hasło musi zawierać co najmniej jedną cyfrę.');
    if (!/[^A-Za-z0-9]+/g.test(password)) errors.push('Hasło musi zawierać co najmniej jeden znak specjalny.');
    if (!mail) errors.push('Adres e-mail jest wymagany.');

    if (errors.length > 0) {
        return res.status(400).render('users/error', {
            Title: '400 Błąd tworzenia konta',
            errors,
            values: req.body
        });
    } else {
        const user = await userService.createUser(username, age, userService.hash(password), mail);
        res.status(300).redirect(`/users/${user.slug}`);
    }
}

async function login(req, res) {
    const { username, password } = req.body;
    const slug = userService.slugify(username);
    const user = await userService.getUserBySlug(slug);
    const pass = user ? user.password : null;
    const errors = [];

    if (!user) errors.push('Nie znaleziono użytkownika o podanej nazwie.');
    else if (pass !== userService.hash(password)) errors.push('Podano nieprawidłowe hasło.');

    if (errors.length > 0) {
        return res.status(400).render('users/error', {
            Title: '400 Błąd logowania',
            errors,
            values: req.body
        });
    } else {
        res.status(300).redirect(`/users/${slug}`);
    }
}

async function loginForm(req, res) {
    res.render('users/login', { 
        Title: 'Logowanie' ,
        values: {}
    });
}

async function newForm(req, res) {
    res.render('users/new', { 
        Title: 'Utwórz konto',
        errors: null,
        values: {}
    });
}

module.exports = { index, show, create, newForm, loginForm, login };