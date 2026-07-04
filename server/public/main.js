const statusEl = document.getElementById("status");
const subscribeBtn = document.getElementById("subscribeBtn");
const sendBtn = document.getElementById("sendBtn");

function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = atob(base64);
  return Uint8Array.from([...rawData].map(char => char.charCodeAt(0)));
}

subscribeBtn.onclick = async () => {
  if (!("serviceWorker" in navigator)) {
    statusEl.textContent = "Service Worker не поддерживается";
    return;
  }

  if (!("PushManager" in window)) {
    statusEl.textContent = "Push API не поддерживается";
    return;
  }

  const permission = await Notification.requestPermission();

  if (permission !== "granted") {
    statusEl.textContent = "Уведомления не разрешены";
    return;
  }

  const registration = await navigator.serviceWorker.register("/service-worker.js");

  const keyResponse = await fetch("/public-key");
  const { publicKey } = await keyResponse.json();

  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(publicKey)
  });

  const response = await fetch("/subscribe", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(subscription)
  });

  const data = await response.json();

  statusEl.textContent = `Уведомления включены. Подписок: ${data.count}`;
};

sendBtn.onclick = async () => {
  const message = document.getElementById("messageInput").value;

  const response = await fetch("/send", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ message })
  });

  const data = await response.json();

  statusEl.textContent = `Отправлено: ${data.sent}`;
};