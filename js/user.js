import { formatXP } from "./formatXp.js";

export function displayUserInfo(data) {
  const user = data.data.user[0];
  console.log(user);
  
  document.getElementById("welcomeText").textContent =
    "Welcome " + user.login;

  const cohort = user.cohort[0].cohorts[0].labelName
   document.getElementById("cohort").textContent = cohort.replace("_18_June_25", "");

  const totalXPBytes = data.data.totalXP.aggregate.sum?.amount || 0;
  document.getElementById("totalXP").textContent =
    formatXP(totalXPBytes);

  const currentLevel = data.data.lvl.aggregate.max?.amount || 0;
  document.getElementById("currentLevel").textContent =
    currentLevel;

  return user;
}