function clearAll() {
  fetch("/clearall", {
    method: "POST", // or 'PUT'
  });
}
