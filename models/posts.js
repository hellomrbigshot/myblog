const Post = require('../lib/mongo').Post
const marked = require('marked')


// 将 post 的 content 从 markdown 转成 html
Post.plugin('contentToHtml', {
	afterFind (posts) {
		return posts.map(post => {
			post.content = marked(post.content)
			return post
		})
	},
	afterFindOne (post) {
		if (post) {
			post.content = marked(post.content)
		}
		return post
	}
})
module.exports = {
	// 创建一篇文章
	create (post) {
		return Post.create(post).exec()
	},
	getPostById (postId) {
		return Post
			.findOne({ _id: postId })
			.populate({ path: 'author', model: 'User' })
			.addCreatedAt()
			.contentToHtml()
			.exec()
	},

	// 按照创建时间降序获取所有用户文章或者某个特定用户的所有文章
	getPosts (author) {
		const query = {}
		if (author) {
			query.author = author
		}
		return Post
			.find(query)
			.populate({ path: 'author', model: 'User'})
			.sort({ _id: -1})
			.addCreatedAt()
			.contentToHtml()
			.exec()
	},

	// 通过文章 id 给 pv 加 1
	incPv (postId) {
		return Post
			.update({ _id: postId }, { $inc: { pv: 1 } })
			.exec()
	},

	// 通过文章 id 获取一篇原生文章(编辑文章)
	getRowPostById (postId) {
		return Post
			.findOne({ _id: postId })
			.populate({ path: 'author', model: 'User' })
			.exec()
	},

	// 通过文章 id 更新一篇文章
	updatePostById (postId, data) {
		return Post.update({ _id: postId }, { $set: data }).exec()
	},

	// 通过文章 id 删除一篇文章
	delPostById (postId) {
		return Post.remove({ _id: postId }).exec()
	}
}