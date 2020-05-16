import axios from './axios'

export function generateToken(password) {
  return axios.post('/bdbb', {
    password
  })
}
