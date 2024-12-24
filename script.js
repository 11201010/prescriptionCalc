let registerDate = document.getElementById("registerDate");
let interval = document.getElementById("interval");
let dispenseNum = document.getElementById("dispenseNum");
let expireDate = document.getElementById("expireDate");
let firstDate = document.getElementById("firstDate");
let defaultSecondRange = document.getElementById("defaultSecondRange");
let newSecondRange = document.getElementById("newSecondRange");
let newSecondRangeContainer = document.getElementById(
  "newSecondRangeContainer"
);
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
let newYearAnnouncement = document.getElementById("newYearAnnouncement");

// initialization
registerDate.value = "";
interval.value = 28;
dispenseNum.value = 3;
secondDate.value = "";
thirdDate.value = "";
followupDate.value = "";

function test(date0, intv, dispNum, date1, date2, date3, date4) {
  registerDate.value = date0
    .toString()
    .replace(/(\d{4})(\d{2})(\d{2})/, "$1-$2-$3");
  interval.value = intv;
  dispenseNum.value = dispNum;
  firstDate.value =
    date1 != undefined
      ? date1.toString().replace(/(\d{4})(\d{2})(\d{2})/, "$1-$2-$3")
      : "";
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
// test(20230101, 28, 3, 20230102);
// expect newSecondRange = 20230120-20230128
// test(20220103, 30, 3, undefined, 20220131);
// expect newThirdStartDate = 20220222
// test(20200522, 30, 3, undefined, 20200622);
// expect newThirdStartDate = 20200712
// test(20220101, 30, 3, undefined, 20220219);
// expect newThirdStartDate = 20220311
// test(20221020, 28, 3, undefined, 20221107, 20221126);
// expect thirdCanEarlierContainer to green
// test(20200418, 28, 3, undefined, undefined, 20200622);
// expect followupDate = 20200710 and newFollowupContainer to yellow
// test(20230103, 28, 3, undefined, 20230221, 20230311, 20230328);
// expect newFollowupContainer to red
// test(20230101, 28, 2, undefined, 20230208, undefined, 20230226);
// expect newFollowupContainer to green
// test(20230714, 28, 3, undefined, 20230821, 20230907);
// expect thirdCanEarlierContainer.style.display to flex
// =================================================================
// when (newYearStartDate = "2025-01-25", newYearEndDate = "2025-02-02")
// test(20241230, 28, 3, undefined, 20250115);
// expect "第二次預設領藥區間之迄日介於春節期間，故可提前至2025-01-15領藥。"
// test(20241201, 28, 3, undefined, 20241229, 20250115);
// expect "第三次預設領藥區間之迄日介於春節期間，故可提前至2025-01-15領藥。"
// =================================================================
// test(20231218, 28, 2);
// expect thirdCanEarlierContainer.style.display to none
// test(20231226, 28, 3, undefined, 20240115, 20240209);
// expect newfollowupContainer.style.display to none

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
  defaultSecondRange.textContent =
    startDate(registerDate, 2) + " ~ " + endDate(registerDate, 2);
  defaultThirdRange.textContent =
    startDate(registerDate, 3) + " ~ " + endDate(registerDate, 3);
  expireDate.textContent = moment(registerDate.value)
    .add(interval.value * dispenseNum.value, "d")
    .format("YYYY-MM-DD");
}

function calcNewSecondRange() {
  newSecondRange.textContent =
    startDate(firstDate, 2) <= endDate(registerDate, 2)
      ? startDate(firstDate, 2) + " ~ " + endDate(registerDate, 2)
      : startDate(firstDate, 2);
}

function setNewSecondDisplay() {
  newSecondRangeContainer.style.display =
    firstDate.value != "" && registerDate.value != "" ? "flex" : "none";
}

function setThirdDisplay() {
  let thirdClass = document.querySelectorAll(".third");
  thirdClass.forEach((container) => {
    container.style.display = dispenseNum.value < 3 ? "none" : "flex";
  });
}

function checkSecondCanEarlier() {
  secondCannotEarlierContainer.classList.add("alert-danger");
  secondCannotEarlier.textContent =
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
  newThirdRange.textContent = dateInInterval(secondDate, 2)
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
  if (newThirdRange.textContent == defaultThirdRange.textContent) {
    newThirdRangeContainer.classList.remove("alert-warning");
    newThirdRangeContainer.classList.add("alert-success");
    newThirdRange.textContent = "第三次領藥區間維持不變。";
  }
}

function checkThirdCanEarlier() {
  thirdCanEarlierContainer.style.display =
    thirdDate.value == "" ||
    (secondDate.value <= endDate(registerDate, 2) &&
      thirdDate.value >= startDate(registerDate, 3)) ||
    (secondDate.value > endDate(registerDate, 2) &&
      thirdDate.value >= startDate(secondDate, 2))
      ? "none"
      : "flex";
  thirdCanEarlierContainer.classList.add("alert-danger");
  if (thirdDate.value >= startDate(secondDate, 2))
    thirdCanEarlierContainer.classList.remove("alert-danger");
  let thirdEarliestDate =
    secondDate.value == ""
      ? startDate(registerDate, 3)
      : startDate(secondDate, 2);
  thirdCanEarlier.textContent =
    "第三次領藥日期至少須在" + thirdEarliestDate + "(含)以後。";
}

function checkNewFollowup() {
  let newFollowupDate =
    dispenseNum.value < 3 ? startDate(secondDate, 2) : startDate(thirdDate, 2);
  let newFollowupDateAfterNext = moment(secondDate.value)
    .add((interval.value - 10) * 2, "d")
    .format("YYYY-MM-DD");
  if (dispenseNum.value < 3) {
    newFollowupContainer.style.display =
      secondDate.value > endDate(registerDate, 2) ? "flex" : "none";
    newFollowup.textContent =
      startDate(secondDate, 2) > followupDate.value
        ? "預約回診日期至少須在" + startDate(secondDate, 2) + "以後。"
        : "否";
  } else {
    newFollowupContainer.style.display =
      thirdDate.value > endDate(registerDate, 3) ? "flex" : "none";
    if (thirdDate.value == "") {
      newFollowup.textContent =
        dateInInterval(secondDate, 2) ||
        newThirdRange.textContent == "第三次領藥區間維持不變"
          ? "否"
          : "預約回診日期至少須在" + newFollowupDateAfterNext + "以後。";
    } else {
      newFollowup.textContent =
        startDate(thirdDate, 2) > followupDate.value
          ? "預約回診日期至少須在" + startDate(thirdDate, 2) + "以後。"
          : "否";
    }
  }
  newFollowupContainer.classList.add("alert-warning");
  if (newFollowupDate > followupDate.value && followupDate.value != "") {
    newFollowupContainer.classList.remove("alert-warning");
    newFollowupContainer.classList.add("alert-danger");
  } else {
    newFollowupContainer.classList.remove("alert-danger");
  }
  if (newFollowupDateAfterNext <= followupDate.value && thirdDate.value == "")
    newFollowup.textContent = "否";
  if (newFollowup.textContent == "否") {
    newFollowupContainer.classList.remove("alert-warning");
    newFollowupContainer.classList.add("alert-success");
  }
}

const newYearStartDate = "2025-01-25";
const newYearEndDate = "2025-02-02";
const tenDaysBeforeNewYear = moment(newYearStartDate)
  .subtract(10, "d")
  .format("YYYY-MM-DD");

newYearAnnouncement.textContent =
  newYearStartDate.replace(/(\d+)\-(\d+)\-(\d+)/, "$1") +
  "年春節假期：" +
  newYearStartDate.replace(/(\d+)\-(\d+)\-(\d+)/, "$1年$2月$3日") +
  "起至" +
  newYearEndDate.replace(/(\d+)\-(\d+)\-(\d+)/, "$1年$2月$3日") +
  "止，共" +
  moment(newYearEndDate).add(1, "d").diff(moment(newYearStartDate), "d") +
  "天。" +
  "考量民眾回診需要及避免用藥中斷，對於原本預定於春節假期期間回診之民眾，或連續處方箋之迄日介於春節期間者，可提前自春節前10天，即" +
  tenDaysBeforeNewYear.replace(/(\d+)\-(\d+)\-(\d+)/, "$1年$2月$3日") +
  "(含)起回診或預領下個月(次)用藥。";

function endDateInNewYearHolidays(date, n) {
  return (
    endDate(date, n) >= newYearStartDate && endDate(date, n) <= newYearEndDate
  );
}

function checkBeforeNewYear() {
  if (moment().format("YYYY-MM-DD") > newYearEndDate) {
    newYearContainer.style.display = "none";
    return;
  }
  if (endDateInNewYearHolidays(registerDate, 2)) {
    secondCannotEarlierContainer.style.display = "flex";
    secondCannotEarlier.textContent =
      "第二次預設領藥區間之迄日介於春節期間，故可提前至" +
      tenDaysBeforeNewYear +
      "領藥。";
    if (secondDate.value == "" || secondDate.value >= tenDaysBeforeNewYear) {
      secondCannotEarlierContainer.classList.remove("alert-danger");
    }
  }
  if (endDateInNewYearHolidays(registerDate, 3) && dispenseNum.value > 2) {
    thirdCanEarlierContainer.style.display = "flex";
    thirdCanEarlier.textContent =
      "第三次預設領藥區間之迄日介於春節期間，故可提前至" +
      tenDaysBeforeNewYear +
      "領藥。";
    if (thirdDate.value == "" || thirdDate.value >= tenDaysBeforeNewYear) {
      thirdCanEarlierContainer.classList.remove("alert-danger");
    }
  }
  if (
    (endDateInNewYearHolidays(secondDate, 2) && dispenseNum.value < 3) ||
    endDateInNewYearHolidays(thirdDate, 2)
  ) {
    newFollowupContainer.style.display = "flex";
    newFollowup.textContent =
      "吃完藥的日期介於春節期間，故可提前至" + tenDaysBeforeNewYear + "領藥。";
  }
}

function setExpireDisplay() {
  expiredContainer.style.display = "none";
  if (
    secondDate.value > expireDate.textContent ||
    thirdDate.value > expireDate.textContent
  ) {
    newThirdRangeContainer.style.display = "none";
    newFollowupContainer.style.display = "none";
    expiredContainer.style.display = "flex";
  }
}

function calcPrescriptionDate() {
  calcDefaults();
  calcNewSecondRange();
  setNewSecondDisplay();
  setThirdDisplay();
  checkSecondCanEarlier();
  calcNewThirdRange();
  setNewThirdDisplay();
  checkThirdCanEarlier();
  checkNewFollowup();
  checkBeforeNewYear();
  setExpireDisplay();
}

calcPrescriptionDate();
