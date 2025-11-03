const articleService = require('../services/articleService');

async function index(req, res) {
    const articles = await articleService.getAllArticles();
    res.render('articles/list', {Title: "Artykuły", articles });
}

async function show(req, res) {
    const slug = req.params.slug;
    const article = await articleService.getArticleBySlug(slug);
    if (!article) return res.status(404).render('articles/error', { Title: '404 Nie znaleziono artykułu', errors: null });

    res.render('articles/show', { Title: article.title, article });
}

async function create(req, res) {
    const { title, content, author } = req.body;
    let errors = [];

    if (!title || title.trim().length < 3) errors.push('Tytuł musi mieć co najmniej 3 znaki.');
    if (!content || content.trim().length < 10) errors.push('Treść musi mieć co najmniej 10 znaków.');

    if (errors.length > 0) {
        return res.status(400).render('articles/error', {
            Title: '400 Błąd tworzenia artykułu',
            errors,
            values: req.body
        });
    } else {
        const article = await articleService.createArticle(title, content, author);
        res.status(300).redirect(`/articles/${article.slug}`);
    }
}

async function newForm(req, res) {
    res.render('articles/new', { 
        Title: 'Nowy artykuł',
        errors: null,
        values: {}
    });
}

module.exports = { index, show, create, newForm };