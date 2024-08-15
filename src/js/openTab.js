function openTab(event, tabName) {
	// Get all the tab content elements
	const tabContent = document.getElementsByClassName("tab-content");

	// Hide all the tab content elements
	for (let i = 0; i < tabContent.length; i++) {
		tabContent[i].classList.add("hidden");
	}

	// Remove the 'hidden' class from the current tab
	const currentTab = document.getElementById(tabName);
	currentTab.classList.remove("hidden");
}