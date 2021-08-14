
export default {
  getData(): Promise<any> {
    // TODO: This should move to netflify function to hide the API key
    return fetch(`ux-report.netlify.app/.netlify/functions/getCruxReport`).then((resp) => {
      if (!resp.ok) throw new Error('somethign happened')
      return resp.json().then((json) => {
        return json
      })
    })

    // return instance
    //   .get(`${apiUrlBase}?key=${apiKey}`, { data: { origin: 'https://example.com/' }, withCredentials: false })
    //   .then((response) => {
    //     return response.data.items
    //   })
  },
}
