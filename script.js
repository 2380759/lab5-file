document.addEventListener('DOMContentLoaded', () => {
    const loadCarsBtn = document.getElementById('loadCarsBtn');
    const carList = document.getElementById('carList');
    let cars = []; // Initialize cars array

    // Function to load cars
    function loadCars() {
        fetch('/cars') // Updated URL to match backend route
            .then(response => response.json())
            .then(data => {
                cars = data;
                carList.innerHTML = '';
                data.forEach((car, index) => {
                    const carCard = document.createElement('div');
                    carCard.classList.add('car-card');
                    carCard.innerHTML = `
                        <h2>${car.make} ${car.model}</h2>
                        <p><strong>Year:</strong> ${car.year}</p>
                        <p><strong>Make:</strong> ${car.make}</p>
                        <p><strong>Model:</strong> ${car.model}</p>
                        <p><strong>Price:</strong> R${car.price}</p>
                        <button class="btn btn-remove" data-index="${index}">Remove</button>
                    `;
                    carList.appendChild(carCard);
                });
            })
            .catch(error => {
                console.error('Error fetching car data:', error);
            });
    }

    // Load cars on button click
    loadCarsBtn.addEventListener('click', loadCars);

    // Function to add a new car
    function addCar(newCar) {
        fetch('/cars', { // Updated URL to match backend route
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newCar)
        })
            .then(response => response.json())
            .then(data => {
                console.log('Success:', data);
                loadCars(); // Reload cars after adding
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }

    // Form submission event listener
    const carForm = document.getElementById('carForm');
    carForm.addEventListener('submit', event => {
        event.preventDefault();
        const make = document.getElementById('make').value;
        const model = document.getElementById('model').value;
        const year = document.getElementById('year').value;
        const price = document.getElementById('price').value;
        addCar({ make, model, year, price });
        carForm.reset();
    });

    // Function to remove a car
    function removeCar(index) {
        const carId = cars[index].id;
        fetch(`/cars/${carId}`, { // Updated URL to match backend route
            method: 'DELETE'
        })
            .then(response => response.json())
            .then(data => {
                console.log('Success:', data);
                loadCars(); // Reload cars after deletion
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }

    // Event delegation for remove buttons
    carList.addEventListener('click', event => {
        if (event.target.classList.contains('btn-remove')) {
            const index = event.target.dataset.index;
            removeCar(index);
        }
    });

    // Initial load of cars
    loadCars();
});

