// your_script.js

// Frontend code
let recording = false;
let recordedActions = [];
let typingTimer;
const typingDelay = 1000; // Adjust the delay as needed
let userGivenUrl = ""; // Variable to store the user-provided URL

document.getElementById("startRecordingBtn").addEventListener("click", () => {
    startRecording();
});

document.getElementById("stopRecordingBtn").addEventListener("click", () => {
    stopRecording();
});

document.getElementById("viewJSONBtn").addEventListener("click", () => {
    viewJSON();
});
function redirectAfterRecording() {
    const redirectUrl = document.getElementById("redirectUrl").value;
    // Perform any client-side validation if needed.
    if (redirectUrl.trim() !== "") {
        // Redirect to the specified URL in the same tab
        window.location.href = redirectUrl;
        // Store the user-provided URL in a variable to be used as the target in recorded actions
        userGivenUrl = redirectUrl;
    }
}

// Function to handle scroll actions
window.addEventListener('scroll', (event) => {
    const scrollData = {
        timestamp: new Date().toISOString(),
        type: 'scroll',
        target: 'window',
        data: {
            scrollX: window.scrollX,
            scrollY: window.scrollY,
        },
    };
    recordedActions.push(scrollData);
});

function startRecording() {
    recording = true;
    recordedActions = [];
    document.getElementById("startRecordingBtn").disabled = true;
    document.getElementById("stopRecordingBtn").disabled = false;
    document.getElementById("viewJSONBtn").disabled = true;

    // Add event listeners for relevant actions (e.g., clicks, form submissions, typing, etc.)
    document.addEventListener("click", handleAction);
    document.addEventListener("submit", handleAction);
    document.addEventListener("input", handleAction);
    document.addEventListener("change", handleAction);
    document.addEventListener("mouseover", handleAction);
    document.addEventListener("mouseout", handleAction);
    // Add event listener for typing action with a delay to capture the final result
    document.addEventListener("keyup", handleTypingAction);

    // Add event listener for page navigation (e.g., clicking links)
    document.querySelectorAll("a").forEach(link => {
        link.addEventListener("click", handleAction);
    document.querySelectorAll("a").forEach(link => {
            link.addEventListener("click", handleNavigationAction);
        });
        
    });
    // Add more event listeners for other actions if needed
}

function stopRecording() {
    recording = false;
    document.getElementById("startRecordingBtn").disabled = false;
    document.getElementById("stopRecordingBtn").disabled = true;
    document.getElementById("viewJSONBtn").disabled = false;

    // Remove event listeners to stop recording
    document.removeEventListener("click", handleAction);
    document.removeEventListener("submit", handleAction);
    document.removeEventListener("input", handleAction);
    document.removeEventListener("change", handleAction);
    document.removeEventListener("mouseover", handleAction);
    document.removeEventListener("mouseout", handleAction);
    // Remove event listener for typing action
    document.removeEventListener("keyup", handleTypingAction);

    // Remove event listener for page navigation (e.g., clicking links)
    document.querySelectorAll("a").forEach(link => {
           link.removeEventListener("click", handleAction);
    document.querySelectorAll("a").forEach(link => {
            link.removeEventListener("click", handleNavigationAction);
        });
    
    });
    // Remove more event listeners for other actions if needed

    // Display recorded actions
    displayRecordedActions();
}

// Function to handle various actions
function handleAction(event) {
    const actionType = event.type;
    const targetElement = event.target.id; // Adjust this based on how you want to identify the element (e.g., using classes, data attributes, etc.)

    const recordedAction = {
        timestamp: new Date().toISOString(),
        type: actionType,
        target: targetElement,
    };

    if (actionType === "submit") {
        event.preventDefault();
        const formData = new FormData(event.target);
        recordedAction.data = {};
        formData.forEach((value, key) => {
            recordedAction.data[key] = value;
        });
    } if (actionType === "click" && event.target.tagName === "A") {
        recordedAction.type = "navigation";
        recordedAction.data = event.target.href;
    }if (actionType === "scroll") {
        // Already handled by the window.addEventListener('scroll') function
        return;
    }

    recordedActions.push(recordedAction);
}
function handleTypingAction(event) {
    // If there is an existing typing timer, clear it
    if (typingTimer) {
        clearTimeout(typingTimer);
    }

    // Create a new typing timer to record the final result after typingDelay milliseconds
    typingTimer = setTimeout(() => {
        const actionType = "typing";
        const targetElement = event.target.id; // Adjust this based on how you want to identify the element (e.g., using classes, data attributes, etc.)
        const typedText = event.target.value;

        // Record the typing action with the timestamp and the final result
        const recordedAction = {
            timestamp: new Date().toISOString(),
            type: actionType,
            target: targetElement,
            data: typedText,
        };

        // Push the recorded typing action to the array
        recordedActions.push(recordedAction);
    }, typingDelay);
}
function handleNavigationAction(event) {
    const actionType = "navigation";
    const targetElement = "window";
    const navigationUrl = event.target.href;

    const recordedAction = {
        timestamp: new Date().toISOString(),
        type: actionType,
        target: userGivenUrl, // Use the user-provided URL as the target
        data: navigationUrl,
    };

    recordedActions.push(recordedAction);
}


function displayRecordedActions() {
    const recordedActionsDiv = document.getElementById("recordedActions");
    recordedActionsDiv.innerHTML = JSON.stringify(recordedActions, null, 2);
}


function viewJSON() {
    // Display the JSON data in a separate modal or dialog for the user to view
    const jsonString = JSON.stringify(recordedActions, null, 2);
    alert(jsonString); // For simplicity, just use an alert to display the JSON data
}

// Puppeteer code
// ... Paste the Puppeteer code here ...
// your_script.js

// Frontend code
// ... The previous frontend code ...

// Function to send recorded actions to the server

function sendRecordedActionsToServer(actions) {
    fetch('/record_actions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(actions),
    })
    .then(() => {
        console.log('Actions recorded and sent successfully.');
    })
    .catch((error) => {
        console.error('Error sending recorded actions:', error);
    });
}

// Puppeteer code
async function runPuppeteerAndRecordActions() {
    const puppeteer = require('puppeteer');

    const browser = await puppeteer.launch({
        // headless: false, slowMo: 100, // Uncomment to visualize the test
    });

    const page = await browser.newPage();

    // Load the website you want to record actions on (retrieve the URL from the frontend)
    const url = 'https://example.com'; // Replace with the URL provided by the user
    await page.goto(url);

    // Function to add a scroll action to the recorded actions
    const recordScrollAction = async (distance) => {
        await page.evaluate((scrollDistance) => {
            window.scrollBy(0, scrollDistance);
        }, distance);
        await page.waitForTimeout(500); // Optional delay to wait after each scroll
    };

    // Array to store the recorded actions

    const recordedActions = [];
    // Record actions here
    // Example: Click a button
    await page.waitForSelector('button');
    await page.click('button');
    recordedActions.push({ timestamp: new Date().toISOString(), type: 'click', target: 'button', data: 'Button clicked' });

    // Example: Input text
    await page.waitForSelector('input');
    await page.type('input', 'Hello, World!');
    recordedActions.push({ timestamp: new Date().toISOString(), type: 'input', target: 'input', data: 'Hello, World!' });

    // Example: Scroll down
    await recordScrollAction(300); // Adjust the scroll distance as needed
    recordedActions.push({ timestamp: new Date().toISOString(), type: 'scroll', direction: 'down', distance: 300 });

    // Example: Scroll up
    await recordScrollAction(-200); // Adjust the scroll distance as needed
    recordedActions.push({ timestamp: new Date().toISOString(), type: 'scroll', direction: 'up', distance: -200 });

    // Close the browser after recording actions
    await browser.close();

    // Send the recorded actions to the server
    sendRecordedActionsToServer(recordedActions);
}

// Call the function to run Puppeteer and record actions
document.getElementById("startPuppeteerBtn").addEventListener("click", () => {
    runPuppeteerAndRecordActions();
});
