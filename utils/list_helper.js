const _ = require('lodash')

const dummy = (blogs) => {
    return Number(blogs + 1)
}

const totalLikes = (blogs) => {
    return blogs.length === 0
        ? 0
        : blogs.reduce((sum, blog) => sum + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
    if (blogs.length === 0) return {}
    return blogs.reduce((last_blog, current_blog) =>
        current_blog.likes > last_blog.likes ? current_blog : last_blog
    )
}

const mostBlogs = (blogs) => {
    if (blogs.length === 0) return {}
    // get object with authors as keys and blogs as values
    const groupedBlogs = _.groupBy(blogs, 'author')
    // get object with authors as keys and values as number of blogs
    const blogsByAuthors = _.mapValues(groupedBlogs, 'length')
    // get object with author with most blogs as key and number of blogs as value
    const mostBlog = Object.entries(blogsByAuthors).reduce((prev, curr) =>
        prev[1] > curr[1] ? prev : curr
    )
    return { author: mostBlog[0], blogs: mostBlog[1] }
}

const mostLikes = (blogs) => {
    if (blogs.length === 0) return {}
    // get object with authors as keys and blogs as values
    const groupedBlogs = _.groupBy(blogs, 'author')
    // get object with authors as keys and values as number of likes
    const blogsByLikes = _.mapValues(groupedBlogs, totalLikes)
    const mostLike = Object.entries(blogsByLikes).reduce((prev, curr) =>
        prev[1] > curr[1] ? prev : curr
    )
    return { author: mostLike[0], likes: mostLike[1] }
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes,
}
