import axios from 'axios'

export default axios.create({
	// baseURL: 'http://localhost:3000',
	baseURL: process.env.BB_MANAGER_API_URL,
	auth: {
		username: process.env.BB_MANAGER_AUTH_USER,
		password: process.env.BB_MANAGER_AUTH_USER_PASSWORD
	}
})