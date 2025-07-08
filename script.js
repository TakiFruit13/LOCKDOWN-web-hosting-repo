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
        name: formData.get('name'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        age: formData.get('age'),
        package: formData.get('package'),
        goals: formData.get('goals'),
        status: 'pending',
        signupDate: new Date().toLocaleDateString()
    };

    fetch('https://script.google.com/macros/s/AKfycbyWWz_7pG4AmXltl2Ne5wbU5PG4XzlzXhYJla-ajvvX/dev', {  // <--- replace with your actual URL
        method: 'POST',
        body: JSON.stringify(client),
        headers: { 'Content-Type': 'application/json' }
    })
    .then(res => res.json())
    .then(data => {
        alert("LOCKED IN! You'll receive a welcome email within 24 hours with your first workout plan.");
        this.reset();
        updateClientList(); // fetches new data from Google Sheets
    })
    .catch(err => {
        alert("There was an error submitting your form!");
        console.error(err);
    });
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
    fetch('https://script.google.com/macros/s/AKfycbyWWz_7pG4AmXltl2Ne5wbU5PG4XzlzXhYJla-ajvvX/dev')
        .then(res => res.json())
        .then(clients => {
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
                    <!-- Add status update/remove buttons here if you wish, but you'll need to update Google Sheets via Apps Script for changes -->
                </div>
            `).join('');
        })
        .catch(err => {
            clientList.innerHTML = '<p style="color:red;">Failed to load client list.</p>';
            console.error(err);
        });
}

// Helper function to get package name
function getPackageName(packageType) {
    const packages = {
        'starter': 'Starter - $30',
        'monthly': 'Monthly - $55/month',
        'extended': 'Extended Growth - $42/month',
        'yearlong': 'Year-Long - $35/month'
    };
    return packages[packageType] || packageType;
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

function toggleAdmin() {
    const adminPanel = document.getElementById('admin-panel');
    const mainContent = document.getElementById('main-content');

    if (!adminPanel.classList.contains('active')) {
        const password = prompt("Enter admin password:");

        if (password !== "201213") {
            alert("Access denied. Incorrect password.");
            return;
        }

        // If password is correct, show the admin panel
        adminPanel.classList.add('active');
        mainContent.style.display = 'none';
        updateClientList();
    } else {
        // Hide the admin panel and return to site
        adminPanel.classList.remove('active');
        mainContent.style.display = 'block';
    }
}
