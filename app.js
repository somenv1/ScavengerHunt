// ========================================
// A Journey Through Us - Scavenger Hunt
// Main Application Logic
// ========================================

// Settings
const settings = {
    showMapsButton: false,  // Toggle to show/hide "Open in Maps" button
    minRadius: 10          // Minimum radius in meters
};

// Skip Codes for each location (tap location number 3 times to reveal input)
const skipCodes = {
    1: "SNOWMAN23",
    2: "GYROS4EVR",
    3: "FIRSTDATE",
    4: "GOLDEN50",
    5: "DOCKS2ND",
    6: "SUNSET4US"
};

// Location Data with Poetic Clues
const locations = [
    {
        id: 1,
        name: "The Park in Jette",
        coords: { lat: 50.8823446, lng: 4.3297479 },
        radius: 10, // meters (was 80, scaled up)
        clue: `Where frozen nights held our laughter tight,
A snowman built on Gordon's might.
Return to where the cosmos knew our name,
The park that watched our love catch flame.`,
        memory: "This is where we watched countless night skies together, and where we once built a very questionable snowman after a few too many drinks. Our story's first chapter.",
        mapsQuery: "Jules+Lorgesquare,+Jette,+Belgium"
    },
    {
        id: 2,
        name: "Mykonos Pitta Gyros",
        coords: { lat: 50.84585, lng: 4.35291 },
        radius: 10, // (was 40, now minimum 80)
        clue: `Through cobblestones near the Grand Place's glow,
Where Greek flavors made our hearts grow.
Find the street of cheese and ancient trade,
A hunger for you that never will fade.`,
        memory: "Our spot for Greek street food in the heart of Brussels. Sometimes the simplest meals become the sweetest memories.",
        mapsQuery: "Mykonos+Pitta+Gyros,+Rue+du+Marché+aux+Fromages+8,+Brussels"
    },
    {
        id: 3,
        name: "Café Léopold Royal",
        coords: { lat: 50.847691, lng: 4.363278 },
        radius: 10, // (was 40, now minimum 80)
        clue: `Near royal streets where kings once strode,
A café holds our secret code.
The first of coffees, the first of "us",
Where nervous hearts learned how to trust.`,
        memory: "Our first date. I remember every detail—the way you smiled, the way time seemed to stop. This is where 'we' began.",
        mapsQuery: "Léopold+Café+Royal,+Rue+de+Louvain+2,+Brussels"
    },
    {
        id: 4,
        name: "The Triumphal Arch",
        coords: { lat: 50.8405527, lng: 4.3929939 },
        radius: 10, // (was 60, scaled up)
        clue: `From whiskers and purrs our journey led,
To golden arches overhead.
After our second date we wandered here,
Where triumph's chariot holds us near.`,
        memory: "The magnificent Cinquantenaire Arch. A monument to triumph, just like what we've built together.",
        mapsQuery: "Cinquantenaire+Arch,+Brussels"
    },
    {
        id: 5,
        name: "Docks Bruxsel",
        coords: { lat: 50.87984, lng: 4.37348 },
        radius: 10, // (was 80, scaled up)
        clue: `By the docks where waters flow,
A second chance let our love grow.
With sushi shared and futures bright,
This place sealed our hearts that night.`,
        memory: "Our second date. The one that led to everything. I knew that evening that you were different, that this was different.",
        mapsQuery: "Docks+Bruxsel,+Boulevard+Lambermont+1,+Brussels"
    },
    {
        id: 6,
        name: "Our Sunset Spot",
        coords: { lat: 50.880531, lng: 4.383858 },
        radius: 10, // (was 50, now minimum 80)
        clue: `Follow the lion's path to the sky,
Where sun meets earth and days drift by.
The final stop where I will ask,
Will you be mine? My sweetest task.`,
        memory: "A place of sunsets and new beginnings. Every ending is just another start.",
        mapsQuery: "Leeuwoprit,+Brussels"
    }
];

// App State
let currentLocationIndex = 0;
let watchId = null;
let userCoords = null;
let skipCodeTapCount = 0;
let skipCodeTapTimer = null;

// DOM Elements
const screens = {
    welcome: document.getElementById('welcome-screen'),
    hunt: document.getElementById('hunt-screen'),
    success: document.getElementById('success-screen'),
    final: document.getElementById('final-screen')
};

const elements = {
    startBtn: document.getElementById('start-btn'),
    arrivedBtn: document.getElementById('arrived-btn'),
    nextBtn: document.getElementById('next-btn'),
    navBtn: document.getElementById('nav-btn'),
    refreshBtn: document.getElementById('refresh-btn'),
    progressFill: document.getElementById('progress-fill'),
    currentLocation: document.getElementById('current-location'),
    totalLocations: document.getElementById('total-locations'),
    locNum: document.getElementById('loc-num'),
    clueText: document.getElementById('clue-text'),
    distanceText: document.getElementById('distance-text'),
    gpsStatus: document.getElementById('gps-status'),
    locationName: document.getElementById('location-name'),
    memoryDescription: document.getElementById('memory-description'),
    envelopeNum: document.getElementById('envelope-num'),
    skipCodeContainer: document.getElementById('skip-code-container'),
    skipCodeInput: document.getElementById('skip-code-input'),
    skipCodeBtn: document.getElementById('skip-code-btn'),
    skipCodeError: document.getElementById('skip-code-error'),
    locationNumberTrigger: document.getElementById('location-number-trigger')
};

// ========================================
// Screen Management
// ========================================

function showScreen(screenName) {
    Object.values(screens).forEach(screen => {
        screen.classList.remove('active');
    });
    screens[screenName].classList.add('active');
}

// ========================================
// Skip Code Functions
// ========================================

function handleLocationNumberTap() {
    skipCodeTapCount++;

    // Reset tap count after 1 second of no taps
    clearTimeout(skipCodeTapTimer);
    skipCodeTapTimer = setTimeout(() => {
        skipCodeTapCount = 0;
    }, 1000);

    // Show skip code input after 3 taps
    if (skipCodeTapCount >= 3) {
        toggleSkipCodeInput();
        skipCodeTapCount = 0;
    }
}

function toggleSkipCodeInput() {
    const container = elements.skipCodeContainer;
    if (container.classList.contains('visible')) {
        container.classList.remove('visible');
        elements.skipCodeInput.value = '';
        elements.skipCodeError.textContent = '';
    } else {
        container.classList.add('visible');
        elements.skipCodeInput.focus();
    }
}

function validateSkipCode() {
    const inputElement = document.getElementById('skip-code-input');
    const errorElement = document.getElementById('skip-code-error');

    if (!inputElement) {
        alert('Error: Input not found!');
        return;
    }

    const enteredCode = inputElement.value.trim().toUpperCase();

    if (!enteredCode) {
        if (errorElement) errorElement.textContent = 'Please enter a code';
        return;
    }

    // Check if code matches any location
    let foundLocation = null;
    for (let i = 1; i <= 6; i++) {
        if (skipCodes[i] === enteredCode) {
            foundLocation = i;
            break;
        }
    }

    if (foundLocation !== null) {
        // Valid code - jump to that location's success screen
        if (errorElement) errorElement.textContent = '';
        inputElement.value = '';
        currentLocationIndex = foundLocation - 1;
        showSuccessScreen();
    } else {
        // Invalid code
        if (errorElement) errorElement.textContent = 'Invalid code. Try again! 💔';
        inputElement.classList.add('shake');
        setTimeout(() => {
            inputElement.classList.remove('shake');
        }, 500);
    }
}

// Make function globally accessible for onclick handlers
window.validateSkipCode = validateSkipCode;

// ========================================
// GPS Functions
// ========================================

function startGPSTracking() {
    if (!navigator.geolocation) {
        elements.gpsStatus.textContent = "GPS not supported on this device";
        elements.gpsStatus.classList.add('error');
        return;
    }

    const options = {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
    };

    watchId = navigator.geolocation.watchPosition(
        onPositionUpdate,
        onPositionError,
        options
    );

    elements.gpsStatus.textContent = "Getting your location...";
}

function stopGPSTracking() {
    if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
        watchId = null;
    }
}

function onPositionUpdate(position) {
    userCoords = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
    };

    const currentLocation = locations[currentLocationIndex];
    const distance = calculateDistance(
        userCoords.lat,
        userCoords.lng,
        currentLocation.coords.lat,
        currentLocation.coords.lng
    );

    updateDistanceDisplay(distance, currentLocation.radius);
}

function onPositionError(error) {
    let message = "Unable to get location";
    switch(error.code) {
        case error.PERMISSION_DENIED:
            message = "Please enable location access";
            break;
        case error.POSITION_UNAVAILABLE:
            message = "Location unavailable";
            break;
        case error.TIMEOUT:
            message = "Location request timed out";
            break;
    }
    elements.gpsStatus.textContent = message;
    elements.gpsStatus.classList.add('error');
}

function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c; // Distance in meters
}

function updateDistanceDisplay(distance, radius) {
    const distanceElement = elements.distanceText;

    if (distance <= radius) {
        distanceElement.textContent = "You're here! ♥";
        distanceElement.className = "distance-text very-close";
        elements.arrivedBtn.disabled = false;
        elements.gpsStatus.textContent = "Tap 'I'm Here!' to continue";
        elements.gpsStatus.classList.remove('error');
    } else if (distance <= radius * 2) {
        distanceElement.textContent = `Almost there! ${Math.round(distance)}m away`;
        distanceElement.className = "distance-text close";
        elements.arrivedBtn.disabled = true;
        elements.gpsStatus.textContent = "Get a little closer...";
        elements.gpsStatus.classList.remove('error');
    } else if (distance <= 1000) {
        distanceElement.textContent = `${Math.round(distance)}m away`;
        distanceElement.className = "distance-text";
        elements.arrivedBtn.disabled = true;
        elements.gpsStatus.textContent = "Keep going!";
        elements.gpsStatus.classList.remove('error');
    } else {
        distanceElement.textContent = `${(distance / 1000).toFixed(1)}km away`;
        distanceElement.className = "distance-text";
        elements.arrivedBtn.disabled = true;
        elements.gpsStatus.textContent = "Use the map to navigate";
        elements.gpsStatus.classList.remove('error');
    }
}

// ========================================
// Location Functions
// ========================================

function loadLocation(index) {
    const location = locations[index];

    // Update progress
    const progress = ((index + 1) / locations.length) * 100;
    elements.progressFill.style.width = `${progress}%`;
    elements.currentLocation.textContent = index + 1;
    elements.totalLocations.textContent = locations.length;
    elements.locNum.textContent = index + 1;

    // Update clue
    elements.clueText.textContent = location.clue;

    // Reset distance display
    elements.distanceText.textContent = "Calculating...";
    elements.distanceText.className = "distance-text";
    elements.arrivedBtn.disabled = true;

    // Hide skip code input
    if (elements.skipCodeContainer) {
        elements.skipCodeContainer.classList.remove('visible');
        elements.skipCodeInput.value = '';
        elements.skipCodeError.textContent = '';
    }

    // Show/hide maps button based on settings
    if (elements.navBtn) {
        elements.navBtn.style.display = settings.showMapsButton ? 'flex' : 'none';
    }

    // Start tracking
    startGPSTracking();
}

function showSuccessScreen() {
    stopGPSTracking();

    const location = locations[currentLocationIndex];
    elements.locationName.textContent = location.name;
    elements.memoryDescription.textContent = location.memory;
    elements.envelopeNum.textContent = currentLocationIndex + 1;

    showScreen('success');
}

function goToNextLocation() {
    currentLocationIndex++;

    if (currentLocationIndex >= locations.length) {
        showScreen('final');
    } else {
        showScreen('hunt');
        loadLocation(currentLocationIndex);
    }
}

function openMaps() {
    const location = locations[currentLocationIndex];
    const url = `https://www.google.com/maps/search/?api=1&query=${location.mapsQuery}`;
    window.open(url, '_blank');
}

function refreshGPS() {
    // Stop current tracking
    stopGPSTracking();

    // Reset display
    elements.distanceText.textContent = "Refreshing...";
    elements.distanceText.className = "distance-text";
    elements.gpsStatus.textContent = "Getting fresh location...";
    elements.gpsStatus.classList.remove('error');

    // Add a small spinning animation feedback
    if (elements.refreshBtn) {
        elements.refreshBtn.classList.add('spinning');
        setTimeout(() => {
            elements.refreshBtn.classList.remove('spinning');
        }, 1000);
    }

    // Restart tracking
    startGPSTracking();
}

// ========================================
// Event Listeners
// ========================================

elements.startBtn.addEventListener('click', () => {
    showScreen('hunt');
    loadLocation(0);
});

elements.arrivedBtn.addEventListener('click', () => {
    showSuccessScreen();
});

elements.nextBtn.addEventListener('click', () => {
    goToNextLocation();
});

if (elements.navBtn) {
    elements.navBtn.addEventListener('click', () => {
        openMaps();
    });
}

if (elements.refreshBtn) {
    elements.refreshBtn.addEventListener('click', () => {
        refreshGPS();
    });
}

// Skip code event listeners - using direct DOM selection
document.addEventListener('DOMContentLoaded', function() {
    const skipCodeBtn = document.getElementById('skip-code-btn');
    const skipCodeInput = document.getElementById('skip-code-input');

    if (skipCodeBtn) {
        skipCodeBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Skip button clicked');
            validateSkipCode();
        });
    }

    if (skipCodeInput) {
        skipCodeInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                console.log('Enter pressed');
                validateSkipCode();
            }
        });
    }
});

// ========================================
// Initialize App
// ========================================

function init() {
    // Check for saved progress (optional feature)
    const savedProgress = localStorage.getItem('scavengerHuntProgress');
    if (savedProgress) {
        const progress = parseInt(savedProgress);
        if (progress > 0 && progress < locations.length) {
            // Could offer to resume, but for now start fresh
        }
    }

    showScreen('welcome');
}

// Start the app
init();

// Save progress when leaving (optional)
window.addEventListener('beforeunload', () => {
    localStorage.setItem('scavengerHuntProgress', currentLocationIndex.toString());
});
