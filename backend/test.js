async function test() {
  try {
    const res = await fetch('http://localhost:5000/api/dashboards', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test Dashboard',
        widgets: [],
        layout: [],
        filters: {}
      })
    });
    const data = await res.json();
    console.log('Success:', data);
  } catch (err) {
    console.error('Error:', err);
  }
}
test();
