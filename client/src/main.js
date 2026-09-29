async function fetchMessage() {
  try {
    const response = await fetch('/api/hello');
    const data = await response.json();
    document.getElementById('message').textContent = data.message;
  } catch (error) {
    document.getElementById('message').textContent = 'Error fetching data';
  }
}
fetchMessage();
