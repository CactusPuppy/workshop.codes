import FetchRails from "./fetch-rails"

export function bind() {
  getUnreadNotificationsCount()

  const element = document.querySelector("[data-action~='get-notifications']")

  if (!element) return

  element.removeAndAddEventListener("click", getNotifications)
}

function getNotifications(event) {
  const iconElement = this.querySelector(".notifications__icon")
  iconElement.classList.add("notifications__icon--animating")
  setTimeout(() => { iconElement.classList.remove("notifications__icon--animating") }, 1000)
  
  if (this.dataset.loaded == "true") return
  this.dataset.loaded = "true"

  new FetchRails("/unread-notifications").get()
  .then(data => {
    showNotificationAlert(0)
    buildNotifications(data)
  })
}

function getUnreadNotificationsCount() {
  new FetchRails("/unread-notifications-count").get()
  .then(data => {
    const parsedData = parseInt(data)

    if (parsedData) showNotificationAlert(parsedData)
  })
}

function showNotificationAlert(count) {
  const countElement = document.querySelector("[data-role='notifications-count']")
  countElement.classList.toggle("notifications__bubble--active", count > 0)
  if (count > 0) countElement.innerText = count
}

function buildNotifications(data) {
  const notificationsElement = document.querySelector("[data-notifications]")
  notificationsElement.innerHTML = ""

  if (data.length > 1) {
    notificationsElement.innerHTML = data
  } else {
    const element = document.createElement("div")
    const classList = ["notifications__item", "text-italic", "text-base"]
    element.classList.add(...classList)
    element.innerHTML = "You have no new notifications"

    notificationsElement.insertAdjacentElement("beforeEnd", element)
  }
}
