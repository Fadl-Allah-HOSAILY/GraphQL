export function formatXP(bytes) {
  if (bytes >= 1000000) {
    return (bytes / 1000000).toFixed(1) + " MB";
  } else {
    return (bytes / 1000).toFixed(1) + " KB";
  }
}