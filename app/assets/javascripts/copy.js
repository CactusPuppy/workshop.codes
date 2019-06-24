document.addEventListener("turbolinks:load", function() {
  const elements = document.querySelectorAll("[data-action='copy-to-clipboard']")

  elements.forEach((element) => element.removeEventListener("click", copyToClipboard))
  elements.forEach((element) => element.addEventListener("click", copyToClipboard))
})

function copyToClipboard(event, optionalContent = undefined) {
  event.preventDefault()

  const element = this.length == undefined ? this : event.srcElement

  const target = element.dataset.target
  const targetElement = document.querySelector(`[data-copy="${ target }"]`)

  if (!targetElement) return

  const input = document.createElement("textarea")
  input.value = optionalContent || targetElement.textContent
  document.body.appendChild(input)

  input.select()
  document.execCommand("copy")
  document.body.removeChild(input)

  notificationElement = document.createElement("div")
  notificationElement.classList.add("copy__notification")
  notificationElement.innerHTML = "Copied"

  let copyParent = targetElement.closest(".copy")
  if (!copyParent) copyParent = element
  copyParent.append(notificationElement)

  setTimeout(() => { copyParent.querySelector(".copy__notification").remove() }, 1000)
}
