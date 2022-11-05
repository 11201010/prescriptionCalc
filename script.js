let startDate = document.getElementById("startDate");
let interval = document.getElementById("interval");
let dispenseNum = document.getElementById("dispenseNum");
let currentDate = document.getElementById("currentDate");
let revisitDate = document.getElementById("revisitDate");
let firstRange = document.getElementById("firstRange");
let secondRange = document.getElementById("secondRange");
let thirdContainer = document.getElementById("thirdContainer");
let thirdRange = document.getElementById("thirdRange");
let expireDate = document.getElementById("expireDate");
let modifiedRange = document.getElementById("modifiedRange");
let modifiedRevisit = document.getElementById("modifiedRevisit");
let modifiedRevisitContainer = document.getElementById(
	"modifiedRevisitContainer"
);

startDate.value = "";
currentDate.valueAsDate = new Date();
revisitDate.value = "";

function prescription() {
	firstRange.innerHTML =
		moment(startDate.value).format("YYYY-MM-DD") +
		" ~ " +
		moment(startDate.value)
			.add(10 - 1, "d")
			.format("YYYY-MM-DD");
	secondRange.innerHTML =
		moment(startDate.value)
			.add(interval.value - 10, "d")
			.format("YYYY-MM-DD") +
		" ~ " +
		moment(startDate.value)
			.add(interval.value - 1, "d")
			.format("YYYY-MM-DD");
	thirdContainer.style.display = dispenseNum.value == 2 ? "none" : "flex";
	thirdRange.innerHTML =
		moment(startDate.value)
			.add(interval.value * 2 - 10, "d")
			.format("YYYY-MM-DD") +
		" ~ " +
		moment(startDate.value)
			.add(interval.value * 2 - 1, "d")
			.format("YYYY-MM-DD");
	expireDate.innerHTML = moment(startDate.value)
		.add(interval.value * dispenseNum.value, "d")
		.format("YYYY-MM-DD");
	if (
		currentDate.valueAsDate >
		moment(startDate.value).add(interval.value * dispenseNum.value, "d")
	) {
		modifiedRange.innerHTML = "不可領藥";
	} else {
		let modifiedEnd = moment.min(
			// expireDate
			moment(startDate.value).add(interval.value * dispenseNum.value, "d"),
			// modifiedDate + interval
			moment(currentDate.value).add(interval.value, "d")
		);
		let suggestStart = moment.max(
			// thirdStart
			moment(startDate.value).add(interval.value * 2 - 10, "d"),
			// modifiedDate + interval - 10
			moment(currentDate.value).add(interval.value - 10, "d")
		);
		let suggestEnd;
		// if currentDate > thirdEnd
		if (
			currentDate.valueAsDate >
			moment(startDate.value).add(interval.value * 2 - 1, "d")
		) {
			suggestEnd = modifiedEnd;
		} else {
			suggestEnd = moment.min(
				modifiedEnd,
				moment(startDate.value).add(interval.value * 2 - 1, "d")
			);
		}
		modifiedRevisitContainer.style.display =
			revisitDate.value == "" ? "none" : "flex";
		modifiedRange.innerHTML =
			suggestStart.format("YYYY-MM-DD") +
			" ~ " +
			suggestEnd.format("YYYY-MM-DD");
		modifiedRevisit.innerHTML =
			revisitDate.value < suggestStart.format("YYYY-MM-DD")
				? "預約回診日期至少須在" + suggestStart.format("YYYY-MM-DD") + "以後"
				: "否";
	}
}
prescription();
