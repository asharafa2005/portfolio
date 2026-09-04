// Time zone configurations
const timeZones = {
    ny: { name: 'America/New_York', elementTime: 'ny-time', elementDate: 'ny-date' },
    london: { name: 'Europe/London', elementTime: 'london-time', elementDate: 'london-date' },
    dubai: { name: 'Asia/Dubai', elementTime: 'dubai-time', elementDate: 'dubai-date' },
    india: { name: 'Asia/Kolkata', elementTime: 'india-time', elementDate: 'india-date' },
    singapore: { name: 'Asia/Singapore', elementTime: 'singapore-time', elementDate: 'singapore-date' },
    tokyo: { name: 'Asia/Tokyo', elementTime: 'tokyo-time', elementDate: 'tokyo-date' },
    sydney: { name: 'Australia/Sydney', elementTime: 'sydney-time', elementDate: 'sydney-date' },
    la: { name: 'America/Los_Angeles', elementTime: 'la-time', elementDate: 'la-date' },
    sp: { name: 'America/Sao_Paulo', elementTime: 'sp-time', elementDate: 'sp-date' }
};

// Format time with leading zeros
function formatTime(hours, minutes, seconds) {
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

// Format date
function formatDate(date) {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

// Update time for a specific timezone
function updateTimeForZone(zone, zoneName, timeElementId, dateElementId) {
    try {
        // Get current time in the specified timezone
        const formatter = new Intl.DateTimeFormat('en-US', {
            timeZone: zoneName,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        });

        const dateFormatter = new Intl.DateTimeFormat('en-US', {
            timeZone: zoneName,
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        // Get time parts
        const timeParts = formatter.formatToParts(new Date());
        let hours = '', minutes = '', seconds = '';

        timeParts.forEach(part => {
            if (part.type === 'hour') hours = part.value;
            if (part.type === 'minute') minutes = part.value;
            if (part.type === 'second') seconds = part.value;
        });

        // Update DOM
        const timeElement = document.getElementById(timeElementId);
        const dateElement = document.getElementById(dateElementId);

        if (timeElement) {
            timeElement.textContent = formatTime(parseInt(hours), parseInt(minutes), parseInt(seconds));
        }

        if (dateElement) {
            dateElement.textContent = dateFormatter.format(new Date());
        }
    } catch (error) {
        console.error(`Error updating time for ${zone}:`, error);
    }
}

// Update local time with timezone info
function updateLocalTime() {
    try {
        const now = new Date();
        const hours = now.getHours();
        const minutes = now.getMinutes();
        const seconds = now.getSeconds();

        const timeElement = document.getElementById('local-time');
        const dateElement = document.getElementById('local-date');
        const tzElement = document.getElementById('local-timezone');

        if (timeElement) {
            timeElement.textContent = formatTime(hours, minutes, seconds);
        }

        if (dateElement) {
            dateElement.textContent = formatDate(now);
        }

        if (tzElement) {
            const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
            tzElement.textContent = `Timezone: ${tz}`;
        }
    } catch (error) {
        console.error('Error updating local time:', error);
    }
}

// Main update function
function updateAllClocks() {
    // Update all timezone clocks
    Object.entries(timeZones).forEach(([zone, config]) => {
        updateTimeForZone(zone, config.name, config.elementTime, config.elementDate);
    });

    // Update local time
    updateLocalTime();
}

// Initialize clocks on page load
document.addEventListener('DOMContentLoaded', function() {
    // Initial update
    updateAllClocks();

    // Update every second
    setInterval(updateAllClocks, 1000);

    console.log('Global Timezone Clock initialized successfully!');
});

// Handle visibility change for efficiency
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        // Page is hidden, can reduce update frequency if needed
    } else {
        // Page is visible, ensure clocks are updated
        updateAllClocks();
    }
});
