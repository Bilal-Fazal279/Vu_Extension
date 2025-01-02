// Function to inject a script tag into the webpage
function injectScript() {
    const scriptContent = 'sec = 100;'; // The JavaScript code you want to inject

    // Create a new script element
    const script = document.createElement('script');
    script.textContent = scriptContent; // Set the content of the script

    // Append the script to the document
    (document.head || document.documentElement).appendChild(script);
}

// Get the active tab
chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    var tabId = tabs[0].id; // Get the ID of the active tab

    // Execute the injectScript function in the context of the active tab
    chrome.scripting.executeScript({
        target: { tabId: tabId },
        function: injectScript // Call the function to inject the script
    }, () => {
        console.log("Script injected successfully.");
    });
});