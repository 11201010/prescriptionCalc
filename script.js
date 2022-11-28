let registerDate = document.getElementById("registerDate");
let interval = document.getElementById("interval");
let dispenseNum = document.getElementById("dispenseNum");
let expireDate = document.getElementById("expireDate");
let defaultFirstRange = document.getElementById("defaultFirstRange");
let defaultSecondRange = document.getElementById("defaultSecondRange");
let secondDate = document.getElementById("secondDate");
let secondCannotEarly = document.getElementById("secondCannotEarly");
let secondCannotEarlyContainer = document.getElementById(
	"secondCannotEarlyContainer"
);
let defaultThirdRange = document.getElementById("defaultThirdRange");
let newThirdRange = document.getElementById("newThirdRange");
let newThirdRangeContainer = document.getElementById("newThirdRangeContainer");
let thirdDate = document.getElementById("thirdDate");
let thirdCanEarly = document.getElementById("thirdCanEarly");
let thirdCanEarlyContainer = document.getElementById("thirdCanEarlyContainer");
let revisitDate = document.getElementById("revisitDate");
let newRevisit = document.getElementById("newRevisit");
let newRevisitContainer = document.getElementById("newRevisitContainer");
let expiredContainer = document.getElementById("expiredContainer");

// initialization
registerDate.value = "";
secondDate.value = "";
thirdDate.value = "";
revisitDate.value = "";

// testing by setting date.defaultValue
// 20220101, 30, 20220131
// 20221020, 28, 20221107, 20221126
// 20200522, 30, 20200622
// 20200418, 28, ?, 20200622
// 20220101, 30, 20220219
// registerDate.defaultValue = "2022-01-01";
// secondDate.defaultValue = "2022-01-31";
// revisitDate.defaultValue = "2022-04-01";

function startDate(date, num) {
	if (num == 1) {
		return moment(date.value).format("YYYY-MM-DD");
	} else {
		return moment(date.value)
			.add(interval.value * (num - 1) - 10, "d")
			.format("YYYY-MM-DD");
	}
}
function endDate(date, num) {
	if (num == 1) {
		return moment(date.value)
			.add(10 - 1, "d")
			.format("YYYY-MM-DD");
	} else {
		return moment(date.value)
			.add(interval.value * (num - 1) - 1, "d")
			.format("YYYY-MM-DD");
	}
}

function prescription() {
	// toggle thirdClass element's display according to dispenseNum.value
	let thirdClass = document.querySelectorAll(".third");
	thirdClass.forEach((container) => {
		container.style.display = dispenseNum.value < 3 ? "none" : "flex";
	});
	// set default range
	defaultFirstRange.innerHTML =
		startDate(registerDate, 1) + " ~ " + endDate(registerDate, 1);
	defaultSecondRange.innerHTML =
		startDate(registerDate, 2) + " ~ " + endDate(registerDate, 2);
	defaultThirdRange.innerHTML =
		startDate(registerDate, 3) + " ~ " + endDate(registerDate, 3);
	// set expireDate
	expireDate.innerHTML = moment(registerDate.value)
		.add(interval.value * dispenseNum.value, "d")
		.format("YYYY-MM-DD");
	// check secondCannotEarly
	secondCannotEarly.innerHTML =
		"第二次領藥日期至少須在" + startDate(registerDate, 2) + "(含)以後";
	secondCannotEarlyContainer.style.display =
		secondDate.value >= startDate(registerDate, 2) || secondDate.value == ""
			? "none"
			: "flex";
	// check if newThirdRange is needed
	let secondDateInInterval =
		secondDate.value >= startDate(registerDate, 2) &&
		secondDate.value <= endDate(registerDate, 2);
	newThirdRange.innerHTML = secondDateInInterval
		? "第三次領藥區間維持不變"
		: startDate(secondDate, 2) <= endDate(registerDate, 3)
		? startDate(secondDate, 2) + " ~ " + endDate(registerDate, 3)
		: startDate(secondDate, 2);
	newThirdRangeContainer.style.display =
		secondDate.value == "" || secondDateInInterval || dispenseNum.value < 3
			? "none"
			: "flex";
	// newThirdRangeContainer initialization
	newThirdRangeContainer.classList.add("alert-warning");
	if (newThirdRange.innerHTML == defaultThirdRange.innerHTML) {
		newThirdRangeContainer.classList.remove("alert-warning");
		newThirdRangeContainer.classList.add("alert-success");
		newThirdRange.innerHTML = "第三次領藥區間維持不變";
	}
	thirdCanEarlyContainer.style.display =
		thirdDate.value >= startDate(registerDate, 3) || thirdDate.value == ""
			? "none"
			: "flex";
	// thirdCanEarlyContainer initialization
	thirdCanEarlyContainer.classList.add("alert-danger");
	if (thirdDate.value >= startDate(secondDate, 2))
		thirdCanEarlyContainer.classList.remove("alert-danger");
	thirdCanEarly.innerHTML =
		"第三次領藥日期至少須在" + startDate(secondDate, 2) + "(含)以後";
	// check newRevisit
	let newRevisitDateAfterNext = moment(secondDate.value)
		.add((interval.value - 10) * 2, "d")
		.format("YYYY-MM-DD");
	if (dispenseNum.value < 3) {
		newRevisitContainer.style.display =
			secondDate.value > endDate(registerDate, 2) ? "flex" : "none";
		newRevisit.innerHTML =
			startDate(secondDate, 2) > revisitDate.value
				? "預約回診日期至少須在" + startDate(secondDate, 2) + "以後"
				: "否";
	} else {
		newRevisitContainer.style.display =
			thirdDate.value > endDate(registerDate, 3) ? "flex" : "none";
		if (thirdDate.value == "") {
			newRevisit.innerHTML =
				secondDateInInterval ||
				newThirdRange.innerHTML == "第三次領藥區間維持不變"
					? "否"
					: "預約回診日期至少須在" + newRevisitDateAfterNext + "以後";
		} else {
			newRevisit.innerHTML =
				startDate(thirdDate, 2) > revisitDate.value
					? "預約回診日期至少須在" + startDate(thirdDate, 2) + "以後"
					: "否";
		}
	}
	newRevisitContainer.classList.add("alert-warning");
	if (newRevisitDateAfterNext <= revisitDate.value && thirdDate.value == "")
		newRevisit.innerHTML = "否";
	if (newRevisit.innerHTML == "否") {
		newRevisitContainer.classList.remove("alert-warning");
		newRevisitContainer.classList.add("alert-success");
	}
	// check expire
	expiredContainer.style.display = "none";
	if (
		secondDate.value > expireDate.innerHTML ||
		thirdDate.value > expireDate.innerHTML
	) {
		newThirdRangeContainer.style.display = "none";
		newRevisitContainer.style.display = "none";
		expiredContainer.style.display = "flex";
	}
}
prescription();
