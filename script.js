const ADMIN_PASSWORD = "201213";
let clients = [];

document.addEventListener('DOMContentLoaded', () => {
  if (localStorage.getItem('isAdmin') === 'true') {
    document.getElementById('adminBtn').classList.remove('hidden');
  }
  updateClientList();
});

function toggleAdmin() {
  if (localStorage.getItem('isAdmin') === 'true') {
    showAdminPanel();
    return;
  }

  const password = prompt("Enter admin password:");
  if (password === ADMIN_PASSWORD) {
    localStorage.setItem('isAdmin', 'true');
    document.getElementById('adminBtn').classList.remove('hidden');
    showAdminPanel();
  } else {
    alert("Access denied.");
  }
}

function showAdminPanel() {
  document.getElementById('admin-panel').classList.remove('hidden');
  document.getElementById('main-content').style.display = 'none';
  updateClientList();
}

function logoutAdmin() {
  localStorage.removeItem('isAdmin');
  document.getElementById('admin-panel').classList.add('hidden');
  document.getElementById('main-content').style.display = 'block';
}

function toggleMobileMenu() {
  document.getElementById('navLinks').classList.toggle('active');
}

function selectPackage(packageType) {
  document.getElementById('package').value = packageType;
  document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
}

document.getElementById('signupForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const formData = new FormData(this);
  const client = {
    id: Date.now(),
    name: formData.get('name'),
    email: formData.get('email'),
    phone: formData.get('phone'),
    age: formData.get('age'),
    package: formData.get('package'),
    goals: formData.get('goals'),
    status: 'pending',
    signupDate: new Date().toLocaleDateString()
  };
  clients.push(client);
  alert("LOCKED IN! Welcome email coming within 24 hours.");
  this.reset();
  updateClientList();
});

function updateClientList() {
  const clientList = document.getElementById('client-list');
  if (!clientList) return;

  if (clients.length === 0) {
    clientList.innerHTML = '<p>No clients yet. Start promoting your LOCKDOWN services!</p>';
    return;
  }

  clientList.innerHTML = clients.map(client => `
    <div class="client-card">
      <h4>${client.name}</h4>
      <p><strong>Email:</strong> ${client.email}</p>
      <p><strong>Phone:</strong> ${client.phone}</p>
      <p><strong>Package:</strong> ${getPackageName(client.package)}</p>
      <button onclick="updateClientStatus(${client.id}, 'active')">Activate</button>
      <button onclick="removeClient(${client.id})">Remove</button>
    </div>
  `).join('');
}

function getPackageName(type) {
  const map = {
    starter: 'Starter - $30',
    monthly: 'Monthly - $55/month',
    extended: 'Extended Growth - $42/month',
    yearlong: 'Year-Long - $35/month'
  };
  return map[type] || type;
}

function updateClientStatus(id, status) {
  const client = clients.find(c => c.id === id);
  if (client) {
    client.status = status;
    updateClientList();
  }
}

function removeClient(id) {
  if (confirm("Remove this client?")) {
    clients = clients.filter(c => c.id !== id);
    updateClientList();
  }
}
