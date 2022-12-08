let registerDate = document.getElementById("registerDate");
let interval = document.getElementById("interval");
let dispenseNum = document.getElementById("dispenseNum");
let expireDate = document.getElementById("expireDate");
let defaultFirstRange = document.getElementById("defaultFirstRange");
let defaultSecondRange = document.getElementById("defaultSecondRange");
let secondDate = document.getElementById("secondDate");
let secondCannotEarlier = document.getElementById("secondCannotEarlier");
let secondCannotEarlierContainer = document.getElementById(
	"secondCannotEarlierContainer"
);
let defaultThirdRange = document.getElementById("defaultThirdRange");
let newThirdRange = document.getElementById("newThirdRange");
let newThirdRangeContainer = document.getElementById("newThirdRangeContainer");
let thirdDate = document.getElementById("thirdDate");
let thirdCanEarlier = document.getElementById("thirdCanEarlier");
let thirdCanEarlierContainer = document.getElementById(
	"thirdCanEarlierContainer"
);
let followupDate = document.getElementById("followupDate");
let newFollowup = document.getElementById("newFollowup");
let newFollowupContainer = document.getElementById("newFollowupContainer");
let expiredContainer = document.getElementById("expiredContainer");

// initialization
registerDate.value = "";
interval.value = 28;
dispenseNum.value = 3;
secondDate.value = "";
thirdDate.value = "";
followupDate.value = "";

// testing by setting date.defaultValue
// 20220101, 30, 20220131
// 20221020, 28, 20221107, 20221126
// 20200522, 30, 20200622
// 20200418, 28, ?, 20200622
// 20220101, 30, 20220219
// registerDate.defaultValue = "2022-01-01";
// secondDate.defaultValue = "2022-01-31";
// followupDate.defaultValue = "2022-04-01";

function startDate(date, num) {
	return num == 1
		? moment(date.value).format("YYYY-MM-DD")
		: moment(date.value)
				.add(interval.value * (num - 1) - 10, "d")
				.format("YYYY-MM-DD");
}

function endDate(date, num) {
	return num == 1
		? moment(date.value)
				.add(10 - 1, "d")
				.format("YYYY-MM-DD")
		: moment(date.value)
				.add(interval.value * (num - 1) - 1, "d")
				.format("YYYY-MM-DD");
}

function calcDefaults() {
	defaultFirstRange.innerHTML =
		startDate(registerDate, 1) + " ~ " + endDate(registerDate, 1);
	defaultSecondRange.innerHTML =
		startDate(registerDate, 2) + " ~ " + endDate(registerDate, 2);
	defaultThirdRange.innerHTML =
		startDate(registerDate, 3) + " ~ " + endDate(registerDate, 3);
	expireDate.innerHTML = moment(registerDate.value)
		.add(interval.value * dispenseNum.value, "d")
		.format("YYYY-MM-DD");
}

function setThirdDisplay() {
	let thirdClass = document.querySelectorAll(".third");
	thirdClass.forEach((container) => {
		container.style.display = dispenseNum.value < 3 ? "none" : "flex";
	});
}

function checkSecondCanEarlier() {
	secondCannotEarlier.innerHTML =
		"第二次領藥日期至少須在" + startDate(registerDate, 2) + "(含)以後";
	secondCannotEarlierContainer.style.display =
		secondDate.value >= startDate(registerDate, 2) || secondDate.value == ""
			? "none"
			: "flex";
}

let secondDateInInterval;

function calcNewThirdRange() {
	newThirdRange.innerHTML = secondDateInInterval
		? "第三次領藥區間維持不變"
		: startDate(secondDate, 2) <= endDate(registerDate, 3)
		? startDate(secondDate, 2) + " ~ " + endDate(registerDate, 3)
		: startDate(secondDate, 2);
}

function setNewThirdDisplay() {
	console.log(secondDateInInterval);
	newThirdRangeContainer.style.display =
		secondDate.value == "" || secondDateInInterval || dispenseNum.value < 3
			? "none"
			: "flex";
	newThirdRangeContainer.classList.add("alert-warning");
	if (newThirdRange.innerHTML == defaultThirdRange.innerHTML) {
		newThirdRangeContainer.classList.remove("alert-warning");
		newThirdRangeContainer.classList.add("alert-success");
		newThirdRange.innerHTML = "第三次領藥區間維持不變";
	}
}

function checkThirdCanEarlier() {
	thirdCanEarlierContainer.style.display =
		thirdDate.value >= startDate(registerDate, 3) || thirdDate.value == ""
			? "none"
			: "flex";
	thirdCanEarlierContainer.classList.add("alert-danger");
	if (thirdDate.value >= startDate(secondDate, 2))
		thirdCanEarlierContainer.classList.remove("alert-danger");
	thirdCanEarlier.innerHTML =
		"第三次領藥日期至少須在" + startDate(secondDate, 2) + "(含)以後";
}

let newFollowupDateAfterNext;

function checkNewFollowup() {
	if (dispenseNum.value < 3) {
		newFollowupContainer.style.display =
			secondDate.value > endDate(registerDate, 2) ? "flex" : "none";
		newFollowup.innerHTML =
			startDate(secondDate, 2) > followupDate.value
				? "預約回診日期至少須在" + startDate(secondDate, 2) + "以後"
				: "否";
	} else {
		newFollowupContainer.style.display =
			thirdDate.value > endDate(registerDate, 3) ? "flex" : "none";
		if (thirdDate.value == "") {
			newFollowup.innerHTML =
				secondDateInInterval ||
				newThirdRange.innerHTML == "第三次領藥區間維持不變"
					? "否"
					: "預約回診日期至少須在" + newFollowupDateAfterNext + "以後";
		} else {
			newFollowup.innerHTML =
				startDate(thirdDate, 2) > followupDate.value
					? "預約回診日期至少須在" + startDate(thirdDate, 2) + "以後"
					: "否";
		}
	}
	newFollowupContainer.classList.add("alert-warning");
	if (newFollowupDateAfterNext <= followupDate.value && thirdDate.value == "")
		newFollowup.innerHTML = "否";
	if (newFollowup.innerHTML == "否") {
		newFollowupContainer.classList.remove("alert-warning");
		newFollowupContainer.classList.add("alert-success");
	}
}

function setExpireDisplay() {
	expiredContainer.style.display = "none";
	if (
		secondDate.value > expireDate.innerHTML ||
		thirdDate.value > expireDate.innerHTML
	) {
		newThirdRangeContainer.style.display = "none";
		newFollowupContainer.style.display = "none";
		expiredContainer.style.display = "flex";
	}
}

function calcPrescriptionDate() {
	calcDefaults();
	setThirdDisplay();
	checkSecondCanEarlier();
	calcNewThirdRange();
	secondDateInInterval =
		secondDate.value >= startDate(registerDate, 2) &&
		secondDate.value <= endDate(registerDate, 2);
	setNewThirdDisplay();
	checkThirdCanEarlier();
	newFollowupDateAfterNext = moment(secondDate.value)
		.add((interval.value - 10) * 2, "d")
		.format("YYYY-MM-DD");
	checkNewFollowup();
	setExpireDisplay();
}

calcPrescriptionDate();
