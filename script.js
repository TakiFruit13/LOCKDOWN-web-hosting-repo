// In-memory storage for clients
let clients = [];
let selectedPackage = null;
let selectedPrice = null;

// Quote rotation
let currentQuote = 0;
const quotes = document.querySelectorAll('.quote-item');

function rotateQuotes() {
    if (quotes.length > 0) {
        quotes[currentQuote].classList.remove('active');
        currentQuote = (currentQuote + 1) % quotes.length;
        quotes[currentQuote].classList.add('active');
    }
}

// Start quote rotation
setInterval(rotateQuotes, 4000);

// Package selection
function selectPackage(packageType, price) {
    selectedPackage = packageType;
    selectedPrice = price;
    document.getElementById('package').value = packageType;
    document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
}

// Form submission
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
    
    document.getElementById('signupForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const formData = new FormData(this);
    const client = {
        name: formData.get('name'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        age: formData.get('age'),
        package: formData.get('package'),
        goals: formData.get('goals'),
        status: 'pending',
        signupDate: new Date().toLocaleDateString()
    };

    // THIS is what saves to Firebase:
    db.ref('clients').push(client)
      .then(() => {
          alert('LOCKED IN! You\'ll receive a welcome email within 24 hours with your first workout plan.');
          this.reset();
          updateClientList(); // refreshes your admin panel
      })
      .catch(error => {
          alert('Error saving data: ' + error.message);
      });
});
    
    // Show success message
    alert('LOCKED IN! You\'ll receive a welcome email within 24 hours with your first workout plan.');
    
    // Reset form
    this.reset();
    
    // Update admin panel
    updateClientList();
});

// Admin panel toggle
function toggleAdmin() {
    const adminPanel = document.getElementById('admin-panel');
    const mainContent = document.getElementById('main-content');
    
    if (adminPanel.classList.contains('active')) {
        adminPanel.classList.remove('active');
        mainContent.style.display = 'block';
    } else {
        adminPanel.classList.add('active');
        mainContent.style.display = 'none';
        updateClientList();
    }
}

// Mobile menu toggle
function toggleMobileMenu() {
    const navLinks = document.getElementById('navLinks');
    navLinks.classList.toggle('active');
}

// Update client list in admin panel
function updateClientList() {
    const clientList = document.getElementById('client-list');
    db.ref('clients').once('value', snapshot => {
        const clients = [];
        snapshot.forEach(child => {
            const client = child.val();
            client.id = child.key;
            clients.push(client);
        });

        if (clients.length === 0) {
            clientList.innerHTML = '<p style="text-align: center; color: #bdc3c7;">No clients yet. Start promoting your LOCKDOWN services!</p>';
            return;
        }

        clientList.innerHTML = clients.map(client => `
            <div class="client-card">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                    <h4>${client.name}</h4>
                    <span class="status-badge status-${client.status}">${client.status}</span>
                </div>
                <p><strong>Email:</strong> ${client.email}</p>
                <p><strong>Phone:</strong> ${client.phone}</p>
                <p><strong>Age:</strong> ${client.age}</p>
                <p><strong>Package:</strong> ${getPackageName(client.package)}</p>
                <p><strong>Goals:</strong> ${client.goals}</p>
                <p><strong>Signed Up:</strong> ${client.signupDate}</p>
            </div>
        `).join('');
    });
}
// Update client status
function updateClientStatus(clientId, status) {
    const client = clients.find(c => c.id === clientId);
    if (client) {
        client.status = status;
        updateClientList();
    }
}

// Remove client
function removeClient(clientId) {
    if (confirm('Are you sure you want to remove this client?')) {
        clients = clients.filter(c => c.id !== clientId);
        updateClientList();
    }
}

// Smooth scrolling for navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// Initialize empty clients array
clients = [];

// Auto-update client list on page load
document.addEventListener('DOMContentLoaded', function() {
    updateClientList();
});
