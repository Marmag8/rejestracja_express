const {readArticles, writeArticles} = require('../models/storage');

function slugify(title) {
    return title
        .toString()
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]+/g, '')
        .replace(/\s+/g, '')
        .replace(/-+/g, '');
}

async function getAllArticles() { return await readArticles(); }

async function getArticleBySlug(slug) {
    const articles = await readArticles();
    return articles.find(article => article.slug === slug);
}

async function createArticle(title, content, author) {
    const articles = await readArticles();
    const slug = slugify(title);

    let uniqueSlug = slug;
    let suffix = 1;
    while (articles.find(article => article.slug === uniqueSlug)) {
        uniqueSlug = `${slug}-${suffix++}`;
    }

    const newArticle = { 
        id: Date.now().toString(),
        title,
        content, 
        author : author || 'Unknown', 
        slug: uniqueSlug, 
        createdAt: new Date().toISOString() 
    };

    articles.unshift(newArticle);
    await writeArticles(articles);
    return newArticle;
}

module.exports = { getAllArticles, getArticleBySlug, createArticle };