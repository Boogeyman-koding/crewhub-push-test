self.addEventListener("push", event => {
  const data = event.data ? event.data.json() : {};

  event.waitUntil(
    self.registration.showNotification(data.title || "CrewHub", {
      body: data.body || "Новое уведомление",
      icon: "/icon.png"
    })
  );
});