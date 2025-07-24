import axios from 'axios'

const BASE_URL = 'https://34.229.90.146:3000'

export const api = axios.create({
	baseURL: BASE_URL,
	headers: {
		'Content-Type': 'application/json',
	},
})
