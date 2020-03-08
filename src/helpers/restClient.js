const API_URL = 'http://localhost:4000'
const transport = fetch;

const request = (transport, url, method = "GET", body = null) => {
  let options = {
    method: "",
    headers: {}
  };
  options.method = method;
  if (method !== 'GET') {
    if (body) {
      options.body = JSON.stringify(body);
      options.headers["Content-Type"] = "application/json";
    }
  }
  return transport(API_URL + url, options).then(
    async res => {
      if (res.status >= 200 && res.status <= 300) {
        return res.json();
      } else {
        const data = await res.json()
        throw new Error(data.message)
      }
    },
    rej => {
      throw rej;
    }
  )
};

class RestInterfaceClass {
  constructor(httpClient) {
    this.client = httpClient;
  }
  getLists() {
    return this.client(transport, '/lists')
  }
  getItems() {
    return this.client(transport, '/items')
  }
  addList(body) {
    return this.client(transport, '/lists', 'POST', body)
  }
  delList(listId) {
    return this.client(transport, `/lists/${listId}`, 'DELETE')
  }
  addItem(body) {
    return this.client(transport, '/items', 'POST', body)
  }
  delItem(itemId) {
    return this.client(transport, `/items/${itemId}`, 'DELETE')
  }
  editItem(itemId, body) {
    return this.client(transport, `/items/${itemId}`, 'PATCH', body)
  }
}

const apiClient = new RestInterfaceClass(request)

export default apiClient;