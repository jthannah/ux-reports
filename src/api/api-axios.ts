import axios from 'axios'

const instance = axios.create()

// Uncomment the below section and customize to include an authorization header in each request to the API, if needed.
// Will run for every Axios request made using this instance
instance.interceptors.request.use((config) => {
  config.headers['Access-Control-Allow-Origin'] = '*'
  config.headers['Content-Type'] = 'application/json'
  return config
})

// Will run for every Axios response from this instance
instance.interceptors.response.use(
  (response) => response,
  (err) => {
    // Request timed out or any other error type occurred
    return Promise.reject(new Error(err))
  }
)

export default instance
