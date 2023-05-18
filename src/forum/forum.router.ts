import express from "express"
import {
	createMessage,
	deleteMessage,
	getMessages,
	getMessagesAmount,
	updateMessage,
} from "./forum.service"
import { authGuard } from "../auth/auth.guard"
import fileUpload from "express-fileupload"

const forumRouter = express.Router()

/**
 * Author of the post
 * @typedef {object} Author
 * @property {string} uuid - UUID of the author
 * @property {string} login - Login of the author
 */

/**
 * Message (post)
 * @typedef {object} Post
 * @property {string} uniqueMessageId - Unique id of the post (message)
 * @property {string} text - Text content of the post
 * @property {string} mediaURL - URL for accessing media content (if present)
 * @property {integer} createdAt - Created at timestamp
 * @property {Author} author - Author of the post
 */

/**
 * Create message (post) request body
 * @typedef {object} CreatePostBody
 * @property {string} text - Text content of the new post (optional)
 * @property {string} media - Media content (WIP) (optional)
 * @property {string} authorId - Unique id of the post author
 */

/**
 * Edit message (post) request body
 * @typedef {object} EditPostBody
 * @property {string} text - Text content of the new post
 * @property {string} authorId - Unique id of the post author
 * @property {string} postId - Unique id of the post to edit
 */

/**
 * Messages amount
 * @typedef {object} Amount
 * @property {string} messagesAmount - Total amount of  messages(posts)
 */

/**
 * GET /forum/
 * @tags Forum
 * @summary Get posts(messages) for a page
 * @param {number} page.query.required - Page number (zero-indexed)
 * @return {array<Post>} 200 - Success response, should return at most 20 items - application/json
 * @example response - 200 - Example success response
 * [{
 *       "uniqueMessageId": "bb061d57-551d-4289-b36e-c315040b0d4e",
 *       "text": "Fake post 10",
 *       "mediaURL": null,
 *       "createdAt": 1684348104151,
 *       "author": {
 *           "uuid": "f83f27d4-9468-4344-ae61-797e5de4baab",
 *           "login": "FakeUser3"
 *       }
 *      },
 *      {
 *       "uniqueMessageId": "1lkn1d57-521d-1213-we6e-c31504ewvvwed4e",
 *       "text": "Fake post 11",
 *       "mediaURL": null,
 *       "createdAt": 1684348104123,
 *       "author": {
 *           "uuid": "f83f27d4-9468-4344-ae61-797e5de4baab",
 *           "login": "FakeUser3"
 *       }
 *      }]
 */
forumRouter.get("/", getMessages)

/**
 * GET /forum/amount
 * @tags Forum
 * @summary Get total amount of posts
 * @return {Amount} 200 - Success response - application/json
 * @example response - 200 - Example success response
 * {
 *   "messagesAmount": 102
 * }
 */
forumRouter.get("/amount", getMessagesAmount)

/**
 * POST /forum/
 * @tags Forum
 * @summary Create new post (message)
 * @param {CreatePostBody} request.body.required - Data for the new post
 * @return {Post} 200 - Returns created post
 * @return 400 - Bad request response
 * @return 403 - Unauthorized response
 * @example request - Example request payload
 * {
 *   "text": "User1",
 *   "authorId": "f83f27d4-9468-4344-ae61-797e5de4baab"
 * }
 * @example response - 200 - Example success response
 * {
 *       "uniqueMessageId": "bb061d57-551d-4289-b36e-c315040b0d4e",
 *       "text": "Fake post 10",
 *       "mediaURL": null,
 *       "createdAt": 1684348104151,
 *       "author": {
 *           "uuid": "f83f27d4-9468-4344-ae61-797e5de4baab",
 *           "login": "FakeUser3"
 *       }
 * }
 * @example response - 400 - Bad request response if  post body is invalid
 * {
 *      "message": "Post body is invalid"
 * }
 * @example response - 403 - Unauthorized response if user id from auth header and author id do not match 
 * {
 *      "message": "You are not the author"
 * }
*/
forumRouter.post("/", [authGuard, createMessage])

/**
 * PATCH /forum/
 * @tags Forum
 * @summary Edit existing post (message)
 * @param {EditPostBody} request.body.required - Data to update existing post
 * @return {Post} 200 - Returns edited post
 * @return 400 - Bad request error
 * @return 403 - Unauthorized error
 * @example request - Example request payload
 * {
 *   "text": "User1",
 *   "authorId": "f83f27d4-9468-4344-ae61-797e5de4baab"
 * }
 * @example response - 200 - Example success response
 * {
 *       "uniqueMessageId": "bb061d57-551d-4289-b36e-c315040b0d4e",
 *       "text": "Fake post 10",
 *       "mediaURL": null,
 *       "createdAt": 1684348104151,
 *       "author": {
 *           "uuid": "f83f27d4-9468-4344-ae61-797e5de4baab",
 *           "login": "FakeUser3"
 *       }
 * }
 * @example response - 400 - Bad request response if body is invalid
 * {
 *      "message": "Post body is invalid"
 * }
 * @example response - 403 - Unauthorized response if user tries to delete other user's post
 * {
 *      "message": "You are not the author"
 * }
 */
forumRouter.patch("/", [authGuard, updateMessage])

/**
 * DELETE /forum/
 * @tags Forum
 * @summary Delete existing post (message)
 * @param {string} postid.query.required - Unique id of the post to delete
 * @return {Post} 200 - Returns deleted post
 * @return 400 - Bad request response
 * @return 403 - Unauthorized response
 * @example response - 200 - Example success response
 * {
 *       "uniqueMessageId": "bb061d57-551d-4289-b36e-c315040b0d4e",
 *       "text": "Fake post 10",
 *       "mediaURL": null,
 *       "createdAt": 1684348104151,
 *       "author": {
 *           "uuid": "f83f27d4-9468-4344-ae61-797e5de4baab",
 *           "login": "FakeUser3"
 *       }
 * }
 * @example response - 400 - Bad request response if  post id is invalid
 * {
 *      "message": "Invalid post id"
 * }
 * @example response - 400 - Bad request response if  post with this id does not exists
 * {
 *      "message": "Post does not exists"
 * }
 * @example response - 403 - Unauthorized response if user tries to delete other user's post
 * {
 *      "message": "You are not the author"
 * }
 */
forumRouter.delete("/", [authGuard, deleteMessage])

export default forumRouter
