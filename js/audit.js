import { formatXP } from "./formatXp.js";

export function renderAudit(user) {
  const successfulAudits = user.success.aggregate.count;
  const failedAudits = user.failed.aggregate.count;
  const totalAudit = successfulAudits + failedAudits;

  if (totalAudit === 0) return;

  const successPercent = (successfulAudits / totalAudit) * 100;
  const failedPercent = (failedAudits / totalAudit) * 100;

  const radius = 90;
  const circumference = 2 * Math.PI * radius;

  const successCircle = document.getElementById("success");
  const failedCircle = document.getElementById("failed");

  const successDash = (successPercent / 100) * circumference;
  const failedDash = (failedPercent / 100) * circumference;

  successCircle.setAttribute(
    "stroke-dasharray",
    `${successDash} ${circumference - successDash}`
  );

  failedCircle.setAttribute(
    "stroke-dasharray",
    `${failedDash} ${circumference - failedDash}`
  );

  failedCircle.setAttribute("stroke-dashoffset", `-${successDash}`);

  document.getElementById("auditText").textContent =
    `Ratio : ${user.auditRatio.toFixed(2)}`;

  document.getElementById("fail").textContent =
    `Failed: ${failedPercent.toFixed(2)}%`;

  document.getElementById("valided").textContent =
    `Succeeded: ${successPercent.toFixed(2)}%`;

  document.getElementById("totalDown").textContent =
    `totalDown: ${formatXP(user.totalDown)}`;

  document.getElementById("totalUp").textContent =
    `totalUp: ${formatXP(user.totalUp)}`;
}