import axios from 'axios'

export default axios.create({
	// baseURL: 'http://localhost:3000',
	baseURL: process.env.API_URL,
	auth: {
		username: process.env.AUTH_USER,
		password: process.env.AUTH_USER_PASSWORD
	}
})