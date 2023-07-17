let sideBar = document.getElementsByClassName("side-bar")[0];
let plans = document.getElementsByClassName("plans")[0];
let steps = document.forms[0].children;
let period = document.getElementsByClassName("period")[0];
let checkboxButton = document.getElementsByClassName("checkbox-button")[0];
let planCost = document.querySelectorAll(
	".step-content .plans li div span.cost"
);
let planBonus = document.querySelectorAll(
	".step-content .plans li div div.bonus"
);
let addOnCost = document.querySelectorAll(
	".step-content .add-ons li .addon-period span"
);
let addOns = document.getElementsByName("add-on");
let planTitle = document.querySelector(
	".step-content .summary .plan-main .plan-name .title"
);
let changePlan = document.querySelector(".step-content .summary .plan-main a");
let finalPlanCost = document.getElementById("plan-cost");
let finalAddOns = document.querySelector(".step-content .summary .plan-addons");
let selectedPeriod = document.querySelector(".step-content .total div");
let totalCost = document.getElementById("total-cost");

let inpName = document.getElementById("inp-name");
let inpEmail = document.getElementById("inp-email");
let inpPhone = document.getElementById("inp-phone");

let errMsgName = document.getElementById("name-err");
let errMsgEmail = document.getElementById("email-err");
let errMsgPhone = document.getElementById("phone-err");

let stepNumber = 0;

// --------------------------------------------------------------
// -------------------------MAIN FORM----------------------------
// --------------------------------------------------------------

// hide all steps rather than first one with its navigation button
for (let i = 2; i < steps.length; i++) {
	steps[i].classList.add("hidden");
}

// loop on all steps to add event listeners to navigation buttons
for (let i = 1; i < steps.length; i++) {
	//  Check if the navigation part contain both back and next or not
	if (
		steps[i].classList.contains("navigation") &&
		steps[i].children.length == 2
	) {
		// here first button is for back and second button is for next
		steps[i].children[0].addEventListener("click", () =>
			displayPreviousStep(i)
		);

		steps[i].children[1].addEventListener("click", () => displayNextStep(i));
	} else if (
		steps[i].classList.contains("navigation") &&
		steps[i].children.length == 1
	) {
		//  Here the navigation part contain only one button
		if (steps[i].children[0].getAttribute("class") === "btn next") {
			steps[i].children[0].addEventListener("click", () => displayNextStep(i));
		} else if (steps[i].children[0].getAttribute("class") === "btn back") {
			steps[i].children[0].addEventListener("click", () =>
				displayPreviousStep(i)
			);
		}
	}
}

// Add Event Listener to select step from side bar
for (let i = 0; i < sideBar.children.length; i++) {
	sideBar.children[i].addEventListener("click", function () {
		if (stepNumber !== 0 || validateStepOne()) {
			for (let j = 0; j < steps.length; j++) {
				steps[j].classList.add("hidden");
			}
			steps[i * 2].classList.remove("hidden");
			steps[i * 2 + 1].classList.remove("hidden");

			stepNumber = i;
			displayStepOnSideBar(stepNumber);
			if (i === 3) updateSelection();
		}
	});
}

// --------------------------------------------------------------
// -------------------------STEP ONE-----------------------------
// --------------------------------------------------------------

// Add Event Listener To Form Inputs
inpName.addEventListener("blur", validateName);
inpEmail.addEventListener("blur", validateEmail);
inpPhone.addEventListener("blur", validatePhone);

// --------------------------------------------------------------
// -------------------------STEP TWO-----------------------------
// --------------------------------------------------------------

// Add Event Listener to select a plan
for (let i = 0; i < plans.children.length; i++) {
	plans.children[i].addEventListener("click", () => {
		for (let j = 0; j < plans.children.length; j++) {
			plans.children[j].classList.remove("selected");
		}
		plans.children[i].classList.add("selected");
	});
}

// Select Yearly or Monthly values for STEP TWO and STEP THREE
checkboxButton.addEventListener("change", function () {
	checkboxButton.toggleAttribute("checked");

	period.children[0].classList.toggle("active");
	period.children[2].classList.toggle("active");

	for (let i = 0; i < planCost.length; i++) {
		planCost[i].classList.toggle("hidden");
	}
	for (let i = 0; i < planBonus.length; i++) {
		planBonus[i].classList.toggle("hidden");
	}
	for (let i = 0; i < addOnCost.length; i++) {
		addOnCost[i].classList.toggle("hidden");
	}
	if (checkboxButton.hasAttribute("checked")) {
		selectedPeriod.children[0].classList.add("hidden");
		selectedPeriod.children[1].classList.remove("hidden");
	} else {
		selectedPeriod.children[1].classList.add("hidden");
		selectedPeriod.children[0].classList.remove("hidden");
	}
});

// --------------------------------------------------------------
// ---------------------- STEP THREE ----------------------------
// --------------------------------------------------------------

for (let i = 0; i < addOns.length; i++) {
	addOns[i].addEventListener("change", function () {
		addOns[i].toggleAttribute("checked");
	});
}

// --------------------------------------------------------------
// ---------------------- STEP FOUR -----------------------------
// --------------------------------------------------------------

// Add Event Listener to Change Plan Selection
changePlan.addEventListener("click", function () {
	steps[7].classList.add("hidden");
	steps[6].classList.add("hidden");
	steps[3].classList.remove("hidden");
	steps[2].classList.remove("hidden");

	stepNumber = 1;
	displayStepOnSideBar(stepNumber);
});

document.getElementById("confirm").addEventListener("click", function (e) {
	e.preventDefault();
});

// --------------------------------------------------------------
// -------------------------FUNCTIONS----------------------------
// --------------------------------------------------------------

// call back function to display next step
function displayNextStep(stepNum) {
	if (stepNum !== 1 || validateStepOne()) {
		steps[stepNum - 1].classList.add("hidden");
		steps[stepNum].classList.add("hidden");
		steps[stepNum + 1].classList.remove("hidden");
		if (stepNum < 7) {
			steps[stepNum + 2].classList.remove("hidden");
		}
		stepNumber++;
		displayStepOnSideBar(stepNumber);

		// Update the final selection on Last step
		if (stepNum == 5) {
			updateSelection();
		}
	}
}

// call back function to display previous step
function displayPreviousStep(stepNum) {
	steps[stepNum].classList.add("hidden");
	steps[stepNum - 1].classList.add("hidden");
	steps[stepNum - 2].classList.remove("hidden");
	steps[stepNum - 3].classList.remove("hidden");

	stepNumber--;
	displayStepOnSideBar(stepNumber);

	// Clear AddOns before adding new addons
	if (stepNum == 7) {
		finalAddOns.innerHTML = "";
	}
}

// function to display selected step on sidebar
function displayStepOnSideBar(stepNum) {
	if (stepNum < sideBar.children.length) {
		for (let i = 0; i < sideBar.children.length; i++) {
			sideBar.children[i].classList.remove("active");
		}
		sideBar.children[stepNum].classList.add("active");
	}
}

// Function To Get Selected Plan
function getSelectedPlan() {
	for (let i = 0; i < plans.children.length; i++) {
		if (plans.children[i].classList.contains("selected"))
			return plans.children[i];
		else continue;
	}
}

// Function To get Selected Add-Ons
function getSelectedAddOns() {
	let selectedAddOns = [];
	for (let i = 0; i < addOns.length; i++) {
		addOns[i].hasAttribute("checked")
			? selectedAddOns.push([
					addOns[i].nextElementSibling.nextElementSibling.children[0].innerHTML,
					addOns[
						i
					].nextElementSibling.nextElementSibling.nextElementSibling.children[0].classList.contains(
						"hidden"
					)
						? addOns[i].nextElementSibling.nextElementSibling.nextElementSibling
								.children[1].innerHTML
						: addOns[i].nextElementSibling.nextElementSibling.nextElementSibling
								.children[0].innerHTML,
			  ])
			: "";
	}
	return selectedAddOns;
}

// Validation function
function validateStepOne() {
	return validateName() & validateEmail() & validatePhone();
}
// Validate NAME
function validateName() {
	let check = true;
	if (inpName.value === "") {
		inpName.style.borderColor = `var(--Strawberry-red)`;
		errMsgName.innerText = "This field is required";
	} else if (inpName.value === "") {
		inpName.style.borderColor = `var(--Strawberry-red)`;
		// errMsgName.classList.remove("hidden");
		check = false;
	} else {
		inpName.style.borderColor = `var(--Light-Grey)`;
		// errMsgName.classList.add("hidden");
		errMsgName.innerText = "";
	}

	return check;
}

// Validate EMAIL
function validateEmail() {
	let check = true;

	if (inpEmail.value === "") {
		inpEmail.style.borderColor = `var(--Strawberry-red)`;
		errMsgEmail.innerText = "This field is required";
		// errMsgEmail.classList.remove("hidden");
		check = false;
	} else if (!inpEmail.value.toString().match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
		inpEmail.style.borderColor = `var(--Strawberry-red)`;
		// errMsgEmail.classList.remove("hidden");
		errMsgEmail.innerText = "Invalid Email Format";
		check = false;
	} else {
		inpEmail.style.borderColor = `var(--Light-Grey)`;
		// errMsgEmail.classList.add("hidden");
		errMsgEmail.innerText = "";
	}

	return check;
}

// Validate PHONE
function validatePhone() {
	let check = true;

	if (inpPhone.value === "") {
		inpPhone.style.borderColor = `var(--Strawberry-red)`;
		errMsgPhone.innerText = "This field is required";
		// errMsgPhone.classList.remove("hidden");
		check = false;
	} else if (!inpPhone.value.toString().match(/^\+1 \d{3} \d{3} \d{3}$/)) {
		inpPhone.style.borderColor = `var(--Strawberry-red)`;
		// errMsgPhone.classList.remove("hidden");
		errMsgPhone.innerText = "Invalid Phone Format";
		check = false;
	} else {
		inpPhone.style.borderColor = `var(--Light-Grey)`;
		// errMsgPhone.classList.add("hidden");
		errMsgPhone.innerText = "";
	}

	return check;
}

// Function To Display Selection in Last Step
function updateSelection() {
	finalAddOns.innerHTML = "";
	let subCosts = [];
	planTitle.innerHTML = getSelectedPlan().children[1].children[0].innerHTML;
	finalPlanCost.innerHTML =
		!getSelectedPlan().children[1].children[1].classList.contains("hidden")
			? getSelectedPlan().children[1].children[1].innerHTML
			: getSelectedPlan().children[1].children[2].innerHTML;

	subCosts.push(+finalPlanCost.innerText.split("$")[1].split("/")[0]);
	if (getSelectedAddOns().length > 0) {
		for (let i = 0; i < getSelectedAddOns().length; i++) {
			let selectedAddOn = document.createElement("li");
			let selectedAddOnName = document.createElement("span");
			let selectedAddOnCost = document.createElement("span");

			selectedAddOnName.innerHTML = getSelectedAddOns()[i][0];
			selectedAddOnCost.innerHTML = getSelectedAddOns()[i][1];

			selectedAddOnName.classList.add("addon-name");
			selectedAddOnCost.classList.add("addon-cost");
			selectedAddOn.innerHTML = "";

			selectedAddOn.appendChild(selectedAddOnName);
			selectedAddOn.appendChild(selectedAddOnCost);

			finalAddOns.appendChild(selectedAddOn);
			subCosts.push(+selectedAddOnCost.innerText.split("$")[1].split("/")[0]);
		}
	}
	let cost = subCosts.reduce((c, e) => {
		return e + c;
	});

	totalCost.innerText = `+$${cost}/${finalPlanCost.innerText.split("/")[1]}`;
}
