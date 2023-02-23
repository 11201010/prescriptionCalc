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
let newYearContainer = document.getElementById("newYearContainer");

// initialization
registerDate.value = "";
interval.value = 28;
dispenseNum.value = 3;
secondDate.value = "";
thirdDate.value = "";
followupDate.value = "";

// testing by setting data value
function test(date1, intv, dispNum, date2, date3, date4) {
	registerDate.value = date1
		.toString()
		.replace(/(\d{4})(\d{2})(\d{2})/, "$1-$2-$3");
	interval.value = intv;
	dispenseNum.value = dispNum;
	secondDate.value =
		date2 != undefined
			? date2.toString().replace(/(\d{4})(\d{2})(\d{2})/, "$1-$2-$3")
			: "";
	thirdDate.value =
		date3 != undefined
			? date3.toString().replace(/(\d{4})(\d{2})(\d{2})/, "$1-$2-$3")
			: "";
	followupDate.value =
		date4 != undefined
			? date4.toString().replace(/(\d{4})(\d{2})(\d{2})/, "$1-$2-$3")
			: "";
}
// test(20220103, 30, 3, 20220131);
// expect newThirdStartDate = 20220222
// test(20200522, 30, 3, 20200622);
// expect newThirdStartDate = 20200712
// test(20220101, 30, 3, 20220219);
// expect newThirdStartDate = 20220311
// test(20200418, 28, 3, undefined, 20200622);
// expect followupDate = 20200710
// test(20221020, 28, 3, 20221107, 20221126);
// expect thirdCanEarlierContainer to green
// test(20230103, 28, 3, 20230221, 20230311, 20230328);
// !expect newFollowupContainer to red when newFollowupDate > followupDate

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
	secondCannotEarlierContainer.classList.add("alert-danger");
	secondCannotEarlier.innerHTML =
		"第二次領藥日期至少須在" + startDate(registerDate, 2) + "(含)以後。";
	secondCannotEarlierContainer.style.display =
		secondDate.value >= startDate(registerDate, 2) || secondDate.value == ""
			? "none"
			: "flex";
}

function dateInInterval(date, n) {
	return (
		date.value >= startDate(registerDate, n) &&
		date.value <= endDate(registerDate, n)
	);
}

function calcNewThirdRange() {
	newThirdRange.innerHTML = dateInInterval(secondDate, 2)
		? "第三次領藥區間維持不變"
		: startDate(secondDate, 2) <= endDate(registerDate, 3)
		? startDate(secondDate, 2) + " ~ " + endDate(registerDate, 3)
		: startDate(secondDate, 2);
}

function setNewThirdDisplay() {
	newThirdRangeContainer.style.display =
		secondDate.value == "" ||
		dateInInterval(secondDate, 2) ||
		dispenseNum.value < 3
			? "none"
			: "flex";
	newThirdRangeContainer.classList.add("alert-warning");
	if (newThirdRange.innerHTML == defaultThirdRange.innerHTML) {
		newThirdRangeContainer.classList.remove("alert-warning");
		newThirdRangeContainer.classList.add("alert-success");
		newThirdRange.innerHTML = "第三次領藥區間維持不變。";
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
	let thirdEarliestDate =
		secondDate.value == ""
			? startDate(registerDate, 3)
			: startDate(secondDate, 2);
	thirdCanEarlier.innerHTML =
		"第三次領藥日期至少須在" + thirdEarliestDate + "(含)以後。";
}

let newFollowupDateAfterNext;

function checkNewFollowup() {
	if (dispenseNum.value < 3) {
		newFollowupContainer.style.display =
			secondDate.value > endDate(registerDate, 2) ? "flex" : "none";
		newFollowup.innerHTML =
			startDate(secondDate, 2) > followupDate.value
				? "預約回診日期至少須在" + startDate(secondDate, 2) + "以後。"
				: "否";
	} else {
		newFollowupContainer.style.display =
			thirdDate.value > endDate(registerDate, 3) ? "flex" : "none";
		if (thirdDate.value == "") {
			newFollowup.innerHTML =
				dateInInterval(secondDate, 2) ||
				newThirdRange.innerHTML == "第三次領藥區間維持不變"
					? "否"
					: "預約回診日期至少須在" + newFollowupDateAfterNext + "以後。";
		} else {
			newFollowup.innerHTML =
				startDate(thirdDate, 2) > followupDate.value
					? "預約回診日期至少須在" + startDate(thirdDate, 2) + "以後。"
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

const newYearStartDate = "2023-01-20";
const newYearEndDate = "2023-01-29";
const tenDaysBeforeNewYear = moment(newYearStartDate)
	.subtract(10, "d")
	.format("YYYY-MM-DD");

function endDateInNewYearHolidays(n) {
	return (
		endDate(registerDate, n) >= newYearStartDate &&
		endDate(registerDate, n) <= newYearEndDate
	);
}

function checkBeforeNewYear() {
	if (moment().format("YYYY-MM-DD") > newYearEndDate) {
		newYearContainer.style.display = "none";
		return;
	}
	if (endDateInNewYearHolidays(2)) {
		secondCannotEarlierContainer.style.display = "flex";
		secondCannotEarlier.innerHTML =
			"第二次預設領藥區間之迄日介於春節期間，故可提前至" +
			tenDaysBeforeNewYear +
			"領藥。";
		if (secondDate.value == "" || secondDate.value >= tenDaysBeforeNewYear) {
			secondCannotEarlierContainer.classList.remove("alert-danger");
		}
	}
	if (endDateInNewYearHolidays(3)) {
		thirdCanEarlierContainer.style.display = "flex";
		thirdCanEarlier.innerHTML =
			"第三次預設領藥區間之迄日介於春節期間，故可提前至" +
			tenDaysBeforeNewYear +
			"領藥。";
		if (thirdDate.value == "" || thirdDate.value >= tenDaysBeforeNewYear) {
			thirdCanEarlierContainer.classList.remove("alert-danger");
		}
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
	setNewThirdDisplay();
	checkThirdCanEarlier();
	newFollowupDateAfterNext = moment(secondDate.value)
		.add((interval.value - 10) * 2, "d")
		.format("YYYY-MM-DD");
	checkNewFollowup();
	checkBeforeNewYear();
	setExpireDisplay();
}

calcPrescriptionDate();
