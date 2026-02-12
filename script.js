// Data Storage
let carsData = [
    {
        id: 1,
        name: 'Toyota Camry',
        type: 'Sedan',
        pricePerDay: 45,
        features: ['5 Seats', 'Automatic', 'Air Conditioning', 'Bluetooth'],
        status: 'available',
        image: 'images/toyota-camry.jpg'
    },
    {
        id: 2,
        name: 'Honda CR-V',
        type: 'SUV',
        pricePerDay: 65,
        features: ['7 Seats', 'Automatic', 'AWD', 'Navigation'],
        status: 'available',
        image: 'images/honda-crv.jpg'
    },
    {
        id: 3,
        name: 'Tesla Model 3',
        type: 'Electric Sedan',
        pricePerDay: 85,
        features: ['5 Seats', 'Autopilot', 'Electric', 'Premium Sound'],
        status: 'available',
        image: 'images/tesla-model3.jpg'
    },
    {
        id: 4,
        name: 'Ford Explorer',
        type: 'SUV',
        pricePerDay: 70,
        features: ['7 Seats', 'Automatic', '4WD', 'Leather Seats'],
        status: 'available',
        image: 'images/ford-explorer.jpg'
    },
    {
        id: 5,
        name: 'BMW 3 Series',
        type: 'Luxury Sedan',
        pricePerDay: 95,
        features: ['5 Seats', 'Automatic', 'Sport Mode', 'Premium Interior'],
        status: 'available',
        image: 'images/bmw-3series.jpg'
    },
    {
        id: 6,
        name: 'Chevrolet Tahoe',
        type: 'Large SUV',
        pricePerDay: 80,
        features: ['8 Seats', 'Automatic', '4WD', 'Towing Capacity'],
        status: 'available',
        image: 'images/chevrolet-tahoe.jpg'
    }
];

let reservations = JSON.parse(localStorage.getItem('reservations')) || [];
let rentals = JSON.parse(localStorage.getItem('rentals')) || [];
let returns = JSON.parse(localStorage.getItem('returns')) || [];
let bills = JSON.parse(localStorage.getItem('bills')) || [];

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    displayCars();
    populateCarSelect();
    setupFormHandlers();
    loadStoredData();
    setMinDate();
});

// Load stored data
function loadStoredData() {
    // FORCE CLEAR old localStorage data to use new image paths
    localStorage.removeItem('carsData');
    
    const storedCars = localStorage.getItem('carsData');
    if (storedCars) {
        carsData = JSON.parse(storedCars);
        displayCars();
    } else {
        saveCarsData();
    }
}

function saveCarsData() {
    localStorage.setItem('carsData', JSON.stringify(carsData));
}

function saveReservations() {
    localStorage.setItem('reservations', JSON.stringify(reservations));
}

function saveRentals() {
    localStorage.setItem('rentals', JSON.stringify(rentals));
}

function saveReturns() {
    localStorage.setItem('returns', JSON.stringify(returns));
}

function saveBills() {
    localStorage.setItem('bills', JSON.stringify(bills));
}

// Set minimum date to today
function setMinDate() {
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('pickupDate').min = today;
    document.getElementById('returnDate').min = today;
}

// Display available cars
function displayCars() {
    const carsList = document.getElementById('carsList');
    carsList.innerHTML = '';
    
    carsData.forEach(car => {
        const carCard = document.createElement('div');
        carCard.className = 'car-card';
        carCard.innerHTML = `
            <img src="${car.image}" alt="${car.name}" class="car-image">
            <div class="car-info">
                <h3>${car.name}</h3>
                <div class="car-type">${car.type}</div>
                <ul class="car-features">
                    ${car.features.map(feature => `<li>✓ ${feature}</li>`).join('')}
                </ul>
                <div class="car-price">$${car.pricePerDay}/day</div>
                <span class="car-status status-${car.status}">
                    ${car.status.charAt(0).toUpperCase() + car.status.slice(1)}
                </span>
            </div>
        `;
        carsList.appendChild(carCard);
    });
}

// Populate car select dropdown
function populateCarSelect() {
    const carSelect = document.getElementById('carSelect');
    carSelect.innerHTML = '<option value="">-- Select a Car --</option>';
    
    carsData.filter(car => car.status === 'available').forEach(car => {
        const option = document.createElement('option');
        option.value = car.id;
        option.textContent = `${car.name} - $${car.pricePerDay}/day`;
        carSelect.appendChild(option);
    });
}

// Setup form handlers
function setupFormHandlers() {
    // Reservation form
    const reservationForm = document.getElementById('reservationForm');
    reservationForm.addEventListener('submit', handleReservation);
    
    // Rental days and car selection change
    document.getElementById('rentalDays').addEventListener('input', updateRentalSummary);
    document.getElementById('carSelect').addEventListener('change', updateRentalSummary);
    
    // Date sync
    document.getElementById('pickupDate').addEventListener('change', updateReturnDate);
    document.getElementById('rentalDays').addEventListener('input', updateReturnDate);
    
    // Card number formatting
    document.getElementById('cardNumber').addEventListener('input', formatCardNumber);
    document.getElementById('cardExpiry').addEventListener('input', formatExpiry);
    
    // Modal close
    const modal = document.getElementById('successModal');
    const closeBtn = modal.querySelector('.close');
    closeBtn.onclick = () => modal.style.display = 'none';
    window.onclick = (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    };
}

// Update rental summary
function updateRentalSummary() {
    const carId = parseInt(document.getElementById('carSelect').value);
    const days = parseInt(document.getElementById('rentalDays').value) || 0;
    const summaryDiv = document.getElementById('rentalSummary');
    
    if (carId && days > 0) {
        const car = carsData.find(c => c.id === carId);
        const subtotal = car.pricePerDay * days;
        const tax = subtotal * 0.10; // 10% tax
        const total = subtotal + tax;
        
        summaryDiv.innerHTML = `
            <h4>Rental Summary</h4>
            <div class="summary-line">
                <span>Car:</span>
                <span>${car.name}</span>
            </div>
            <div class="summary-line">
                <span>Daily Rate:</span>
                <span>$${car.pricePerDay}</span>
            </div>
            <div class="summary-line">
                <span>Number of Days:</span>
                <span>${days}</span>
            </div>
            <div class="summary-line">
                <span>Subtotal:</span>
                <span>$${subtotal.toFixed(2)}</span>
            </div>
            <div class="summary-line">
                <span>Tax (10%):</span>
                <span>$${tax.toFixed(2)}</span>
            </div>
            <div class="summary-line summary-total">
                <span>Total:</span>
                <span>$${total.toFixed(2)}</span>
            </div>
        `;
    } else {
        summaryDiv.innerHTML = '';
    }
}

// Update return date based on pickup date and rental days
function updateReturnDate() {
    const pickupDate = document.getElementById('pickupDate').value;
    const rentalDays = parseInt(document.getElementById('rentalDays').value) || 0;
    
    if (pickupDate && rentalDays > 0) {
        const pickup = new Date(pickupDate);
        pickup.setDate(pickup.getDate() + rentalDays);
        document.getElementById('returnDate').value = pickup.toISOString().split('T')[0];
    }
}

// Format card number
function formatCardNumber(e) {
    let value = e.target.value.replace(/\s/g, '');
    let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
    e.target.value = formattedValue;
}

// Format expiry date
function formatExpiry(e) {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length >= 2) {
        value = value.slice(0, 2) + '/' + value.slice(2, 4);
    }
    e.target.value = value;
}

// Handle reservation submission
function handleReservation(e) {
    e.preventDefault();
    
    const carId = parseInt(document.getElementById('carSelect').value);
    const car = carsData.find(c => c.id === carId);
    const days = parseInt(document.getElementById('rentalDays').value);
    
    const reservation = {
        id: Date.now(),
        customerName: document.getElementById('customerName').value,
        customerEmail: document.getElementById('customerEmail').value,
        customerPhone: document.getElementById('customerPhone').value,
        licenseNumber: document.getElementById('licenseNumber').value,
        carId: carId,
        carName: car.name,
        rentalDays: days,
        pickupDate: document.getElementById('pickupDate').value,
        returnDate: document.getElementById('returnDate').value,
        pricePerDay: car.pricePerDay,
        totalCost: (car.pricePerDay * days * 1.10).toFixed(2), // Including 10% tax
        status: 'pending',
        createdAt: new Date().toISOString(),
        paymentInfo: {
            cardNumber: '**** **** **** ' + document.getElementById('cardNumber').value.slice(-4),
            cardName: document.getElementById('cardName').value
        }
    };
    
    // Update car status
    car.status = 'reserved';
    saveCarsData();
    
    // Save reservation
    reservations.push(reservation);
    saveReservations();
    
    // Show success message
    showModal(`Reservation confirmed! Your reservation ID is ${reservation.id}. Please bring your driver's license to our office on ${reservation.pickupDate} to pick up your ${car.name}.`);
    
    // Reset form
    e.target.reset();
    updateRentalSummary();
    displayCars();
    populateCarSelect();
}

// Employee Login
function employeeLogin() {
    const id = document.getElementById('employeeId').value;
    const password = document.getElementById('employeePassword').value;
    
    // Simple authentication (in production, use proper authentication)
    if (id === 'EMP001' && password === 'admin123') {
        document.getElementById('employeeLogin').style.display = 'none';
        document.getElementById('employeeDashboard').style.display = 'block';
        loadPendingReservations();
        loadActiveRentals();
        loadPendingBills();
    } else {
        alert('Invalid credentials. Try ID: EMP001, Password: admin123');
    }
}

function employeeLogout() {
    document.getElementById('employeeLogin').style.display = 'block';
    document.getElementById('employeeDashboard').style.display = 'none';
    document.getElementById('employeeId').value = '';
    document.getElementById('employeePassword').value = '';
}

// Show/Hide tabs
function showTab(tabName) {
    const tabs = document.querySelectorAll('.tab-content');
    const btns = document.querySelectorAll('.tab-btn');
    
    tabs.forEach(tab => tab.classList.remove('active'));
    btns.forEach(btn => btn.classList.remove('active'));
    
    document.getElementById(tabName + 'Tab').classList.add('active');
    event.target.classList.add('active');
    
    // Reload data when switching tabs
    if (tabName === 'pickups') loadPendingReservations();
    if (tabName === 'returns') loadActiveRentals();
    if (tabName === 'billing') loadPendingBills();
}

// Load pending reservations
function loadPendingReservations() {
    const container = document.getElementById('pendingReservations');
    const pending = reservations.filter(r => r.status === 'pending');
    
    if (pending.length === 0) {
        container.innerHTML = '<p class="hint">No pending reservations.</p>';
        return;
    }
    
    container.innerHTML = pending.map(res => `
        <div class="rental-card">
            <div class="rental-header">
                <div>
                    <h4>${res.customerName}</h4>
                    <span class="badge badge-pending">${res.status}</span>
                </div>
                <span>ID: ${res.id}</span>
            </div>
            <div class="rental-details">
                <div class="detail-item">
                    <span class="detail-label">Email:</span>
                    <div class="detail-value">${res.customerEmail}</div>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Phone:</span>
                    <div class="detail-value">${res.customerPhone}</div>
                </div>
                <div class="detail-item">
                    <span class="detail-label">License:</span>
                    <div class="detail-value">${res.licenseNumber}</div>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Car:</span>
                    <div class="detail-value">${res.carName}</div>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Pickup Date:</span>
                    <div class="detail-value">${formatDate(res.pickupDate)}</div>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Return Date:</span>
                    <div class="detail-value">${formatDate(res.returnDate)}</div>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Rental Days:</span>
                    <div class="detail-value">${res.rentalDays} days</div>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Total Cost:</span>
                    <div class="detail-value">$${res.totalCost}</div>
                </div>
            </div>
            <button onclick="processPickup(${res.id})" class="btn btn-success" style="margin-top: 1rem;">Complete Pickup</button>
        </div>
    `).join('');
}

// Process car pickup at office
function processPickup(reservationId) {
    const reservation = reservations.find(r => r.id === reservationId);
    if (!reservation) return;
    
    // Create rental record
    const rental = {
        ...reservation,
        rentalId: Date.now(),
        status: 'active',
        pickedUpAt: new Date().toISOString(),
        pickedUpBy: 'EMP001'
    };
    
    rentals.push(rental);
    saveRentals();
    
    // Update reservation status
    reservation.status = 'completed';
    saveReservations();
    
    // Update car status
    const car = carsData.find(c => c.id === reservation.carId);
    car.status = 'rented';
    saveCarsData();
    
    showModal(`Pickup processed successfully! ${reservation.customerName} has picked up ${reservation.carName}.`);
    loadPendingReservations();
    displayCars();
}

// Load active rentals for returns
function loadActiveRentals() {
    const container = document.getElementById('activeRentals');
    const active = rentals.filter(r => r.status === 'active');
    
    if (active.length === 0) {
        container.innerHTML = '<p class="hint">No active rentals.</p>';
        return;
    }
    
    container.innerHTML = active.map(rental => `
        <div class="rental-card">
            <div class="rental-header">
                <div>
                    <h4>${rental.customerName} - ${rental.carName}</h4>
                    <span class="badge badge-active">Active</span>
                </div>
                <span>Rental ID: ${rental.rentalId}</span>
            </div>
            <div class="rental-details">
                <div class="detail-item">
                    <span class="detail-label">Picked Up:</span>
                    <div class="detail-value">${formatDateTime(rental.pickedUpAt)}</div>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Expected Return:</span>
                    <div class="detail-value">${formatDate(rental.returnDate)}</div>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Rental Days:</span>
                    <div class="detail-value">${rental.rentalDays} days</div>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Base Cost:</span>
                    <div class="detail-value">$${rental.totalCost}</div>
                </div>
            </div>
            <button onclick="showReturnForm(${rental.rentalId})" class="btn btn-primary" style="margin-top: 1rem;">Process Return</button>
            <div id="returnForm${rental.rentalId}" style="display: none;" class="inspection-form">
                <h4>Vehicle Inspection</h4>
                <div class="checkbox-group">
                    <label>
                        <input type="checkbox" id="scratch${rental.rentalId}">
                        Scratches or dents ($100)
                    </label>
                    <label>
                        <input type="checkbox" id="interior${rental.rentalId}">
                        Interior damage ($150)
                    </label>
                    <label>
                        <input type="checkbox" id="mechanical${rental.rentalId}">
                        Mechanical issues ($200)
                    </label>
                    <label>
                        <input type="checkbox" id="missing${rental.rentalId}">
                        Missing items ($50)
                    </label>
                </div>
                <div class="form-group">
                    <label>Additional Notes:</label>
                    <textarea id="notes${rental.rentalId}" rows="3"></textarea>
                </div>
                <button onclick="completeReturn(${rental.rentalId})" class="btn btn-success">Complete Inspection</button>
            </div>
        </div>
    `).join('');
}

// Show return form
function showReturnForm(rentalId) {
    const form = document.getElementById(`returnForm${rentalId}`);
    form.style.display = form.style.display === 'none' ? 'block' : 'none';
}

// Complete vehicle return
function completeReturn(rentalId) {
    const rental = rentals.find(r => r.rentalId === rentalId);
    if (!rental) return;
    
    // Calculate damages
    let damagesCost = 0;
    const damages = [];
    
    if (document.getElementById(`scratch${rentalId}`).checked) {
        damagesCost += 100;
        damages.push('Scratches/Dents: $100');
    }
    if (document.getElementById(`interior${rentalId}`).checked) {
        damagesCost += 150;
        damages.push('Interior Damage: $150');
    }
    if (document.getElementById(`mechanical${rentalId}`).checked) {
        damagesCost += 200;
        damages.push('Mechanical Issues: $200');
    }
    if (document.getElementById(`missing${rentalId}`).checked) {
        damagesCost += 50;
        damages.push('Missing Items: $50');
    }
    
    const notes = document.getElementById(`notes${rentalId}`).value;
    
    // Calculate late fees if applicable
    const expectedReturn = new Date(rental.returnDate);
    const actualReturn = new Date();
    const daysLate = Math.max(0, Math.ceil((actualReturn - expectedReturn) / (1000 * 60 * 60 * 24)));
    const lateFee = daysLate * rental.pricePerDay;
    
    // Create return record
    const returnRecord = {
        ...rental,
        returnId: Date.now(),
        status: 'returned',
        returnedAt: actualReturn.toISOString(),
        inspectedBy: 'EMP001',
        damages: damages,
        damagesCost: damagesCost,
        daysLate: daysLate,
        lateFee: lateFee,
        inspectionNotes: notes
    };
    
    returns.push(returnRecord);
    saveReturns();
    
    // Create bill
    const totalBill = parseFloat(rental.totalCost) + damagesCost + lateFee;
    const bill = {
        ...returnRecord,
        billId: Date.now(),
        finalAmount: totalBill.toFixed(2),
        paid: false
    };
    
    bills.push(bill);
    saveBills();
    
    // Update rental status
    rental.status = 'returned';
    saveRentals();
    
    // Update car status
    const car = carsData.find(c => c.id === rental.carId);
    car.status = 'available';
    saveCarsData();
    
    showModal(`Vehicle returned and inspected. ${damages.length > 0 ? 'Damages found. ' : ''}Total bill: $${totalBill.toFixed(2)}`);
    loadActiveRentals();
    loadPendingBills();
    displayCars();
    populateCarSelect();
}

// Load pending bills
function loadPendingBills() {
    const container = document.getElementById('pendingBills');
    const unpaid = bills.filter(b => !b.paid);
    
    if (unpaid.length === 0) {
        container.innerHTML = '<p class="hint">No pending bills.</p>';
        return;
    }
    
    container.innerHTML = unpaid.map(bill => `
        <div class="rental-card">
            <div class="rental-header">
                <div>
                    <h4>${bill.customerName}</h4>
                    <span class="badge badge-warning">Unpaid</span>
                </div>
                <span>Bill ID: ${bill.billId}</span>
            </div>
            <div class="rental-details">
                <div class="detail-item">
                    <span class="detail-label">Car:</span>
                    <div class="detail-value">${bill.carName}</div>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Returned:</span>
                    <div class="detail-value">${formatDateTime(bill.returnedAt)}</div>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Base Cost:</span>
                    <div class="detail-value">$${bill.totalCost}</div>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Damages:</span>
                    <div class="detail-value">$${bill.damagesCost.toFixed(2)}</div>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Late Fee (${bill.daysLate} days):</span>
                    <div class="detail-value">$${bill.lateFee.toFixed(2)}</div>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Final Amount:</span>
                    <div class="detail-value"><strong>$${bill.finalAmount}</strong></div>
                </div>
            </div>
            ${bill.damages.length > 0 ? `
                <div class="alert alert-warning" style="margin-top: 1rem;">
                    <strong>Damages Found:</strong>
                    <ul style="margin: 0.5rem 0; padding-left: 1.5rem;">
                        ${bill.damages.map(d => `<li>${d}</li>`).join('')}
                    </ul>
                </div>
            ` : ''}
            ${bill.daysLate > 0 ? `
                <div class="alert alert-info" style="margin-top: 1rem;">
                    <strong>Late Return:</strong> Vehicle was returned ${bill.daysLate} day(s) late. Late fee: $${bill.lateFee.toFixed(2)}
                </div>
            ` : ''}
            <button onclick="processFinalPayment(${bill.billId})" class="btn btn-success" style="margin-top: 1rem;">Process Payment</button>
        </div>
    `).join('');
}

// Process final payment
function processFinalPayment(billId) {
    const bill = bills.find(b => b.billId === billId);
    if (!bill) return;
    
    // Mark as paid
    bill.paid = true;
    bill.paidAt = new Date().toISOString();
    bill.processedBy = 'EMP001';
    saveBills();
    
    showModal(`Payment of $${bill.finalAmount} processed successfully for ${bill.customerName}. Transaction completed.`);
    loadPendingBills();
}

// Customer check rental status
function checkRentalStatus() {
    const email = document.getElementById('customerEmailCheck').value;
    const container = document.getElementById('customerStatusDisplay');
    
    if (!email) {
        container.innerHTML = '<div class="alert alert-danger">Please enter your email address.</div>';
        return;
    }
    
    // Find all records for this customer
    const customerReservations = reservations.filter(r => r.customerEmail === email);
    const customerRentals = rentals.filter(r => r.customerEmail === email);
    const customerBills = bills.filter(b => b.customerEmail === email);
    
    if (customerReservations.length === 0 && customerRentals.length === 0 && customerBills.length === 0) {
        container.innerHTML = '<div class="alert alert-info">No records found for this email address.</div>';
        return;
    }
    
    let html = '<div style="margin-top: 1rem;">';
    
    // Show pending reservations
    const pending = customerReservations.filter(r => r.status === 'pending');
    if (pending.length > 0) {
        html += '<h4>Upcoming Reservations</h4>';
        pending.forEach(res => {
            html += `
                <div class="alert alert-info">
                    <strong>Reservation #${res.id}</strong><br>
                    Car: ${res.carName}<br>
                    Pickup: ${formatDate(res.pickupDate)}<br>
                    Status: Confirmed - Please bring your license to our office
                </div>
            `;
        });
    }
    
    // Show active rentals
    const active = customerRentals.filter(r => r.status === 'active');
    if (active.length > 0) {
        html += '<h4>Active Rentals</h4>';
        active.forEach(rental => {
            html += `
                <div class="alert alert-success">
                    <strong>Rental #${rental.rentalId}</strong><br>
                    Car: ${rental.carName}<br>
                    Expected Return: ${formatDate(rental.returnDate)}<br>
                    Status: Active - Enjoy your ride!
                </div>
            `;
        });
    }
    
    // Show unpaid bills
    const unpaid = customerBills.filter(b => !b.paid);
    if (unpaid.length > 0) {
        html += '<h4>Pending Payment</h4>';
        unpaid.forEach(bill => {
            html += `
                <div class="alert alert-warning">
                    <strong>Bill #${bill.billId}</strong><br>
                    Car: ${bill.carName}<br>
                    Amount Due: $${bill.finalAmount}<br>
                    ${bill.damages.length > 0 ? 'Damages: ' + bill.damages.join(', ') + '<br>' : ''}
                    Status: Please visit our office to complete payment
                </div>
            `;
        });
    }
    
    html += '</div>';
    container.innerHTML = html;
}

// Utility functions
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

function formatDateTime(dateString) {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function showModal(message) {
    const modal = document.getElementById('successModal');
    const messageEl = document.getElementById('successMessage');
    messageEl.textContent = message;
    modal.style.display = 'block';
}

// Smooth scrolling for navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});