// Lifecycle method that runs after the component output has been rendered to the DOM
componentDidMount() {
  this.fetchValues(); // Fetching the calculated Fibonacci values
  this.fetchIndexes(); // Fetching the seen indexes
}

// Method to fetch the calculated Fibonacci values
async fetchValues() {
  const values = await axios.get('/api/values/current'); // Making a GET request to the server
  this.setState({ values: values.data }); // Updating the state with the fetched values
}

// Method to fetch the seen indexes
async fetchIndexes() {
  const seenIndexes = await axios.get('/api/values/all'); // Making a GET request to the server
  this.setState({
    seenIndexes: seenIndexes.data, // Updating the state with the fetched indexes
  });
}

// Method to handle form submission
handleSubmit = async (event) => {
  event.preventDefault(); // Preventing the default form submission behavior

  await axios.post('/api/values', { // Making a POST request to the server
    index: this.state.index, // Sending the current index
  });
};