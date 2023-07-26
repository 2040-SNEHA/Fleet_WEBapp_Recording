let recording = false;
let recordedActions = [];

let typingTimer; // Timer identifier for delaying typing recording
const typingDelay = 1000; // Delay in milliseconds before recording typing

document.getElementById("startRecordingBtn").addEventListener("click", () => {
    startRecording();
});

document.getElementById("stopRecordingBtn").addEventListener("click", () => {
    stopRecording();
});

document.getElementById("viewJSONBtn").addEventListener("click", () => {
    viewJSON();
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
    });
    // Remove more event listeners for other actions if needed

    // Display recorded actions
    displayRecordedActions();
}

function handleAction(event) {
    // Extract relevant information from the event object based on the action type
    const actionType = event.type;
    const targetElement = event.target.id; // Adjust this based on how you want to identify the element (e.g., using classes, data attributes, etc.)

    // Record the action with the timestamp
    const recordedAction = {
        timestamp: new Date().toISOString(),
        type: actionType,
        target: targetElement,
    };

    // If it's a form submission, you may want to capture the form data
    if (actionType === "submit") {
        event.preventDefault(); // Prevent the default form submission behavior
        const formData = new FormData(event.target);
        recordedAction.data = {};
        formData.forEach((value, key) => {
            recordedAction.data[key] = value;
        });
    }

    // If it's a page navigation action, record the target URL
    if (actionType === "click" && event.target.tagName === "A") {
        recordedAction.type = "navigation";
        recordedAction.data = event.target.href;
    }

    // If it's a mouseover or mouseout action, record the target element's ID
    if (actionType === "mouseover" || actionType === "mouseout") {
        recordedAction.data = event.target.id;
    }

    // Push the recorded action to the array
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

function displayRecordedActions() {
    const recordedActionsDiv = document.getElementById("recordedActions");
    recordedActionsDiv.innerHTML = JSON.stringify(recordedActions, null, 2);
}

function viewJSON() {
    // Display the JSON data in a separate modal or dialog for the user to view
    const jsonString = JSON.stringify(recordedActions, null, 2);
    alert(jsonString); // For simplicity, just use an alert to display the JSON data
}
