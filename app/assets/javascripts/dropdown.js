let dropdownOpen = false

document.addEventListener("DOMContentLoaded", function() {
  const elements = document.querySelectorAll("[data-action='toggle-dropdown']")
  const dropdowns = document.querySelectorAll("[data-dropdown]")

  elements.forEach((element) => element.addEventListener("click", toggleDropdown))
  dropdowns.forEach((dropdown) => dropdown.addEventListener("click", stopPropagation))

  document.body.addEventListener("click", clickBody)
})

function clickBody(event) {
  if (!dropdownOpen) return

  const activeDropdown = document.querySelector("[data-dropdown-content].active")
  if (activeDropdown) activeDropdown.classList.remove("active")

  dropdownOpen = false
}

function toggleDropdown(event) {
  event.preventDefault()

  const parent = this.closest("[data-dropdown]")
  const target = parent.querySelector("[data-dropdown-content]")

  const activeDropdown = document.querySelector("[data-dropdown-content].active")
  if (activeDropdown && activeDropdown != target) activeDropdown.classList.remove("active")

  target.classList.toggle("active")
  dropdownOpen = !dropdownOpen
}

function stopPropagation(event) {
  event.stopPropagation()
}
