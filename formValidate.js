export function validateFullName() {
  const fullName = document.getElementById('fullName')
  const error = fullName.nextElementSibling
  const payButton = document.querySelector('.modal__pay')

  fullName.addEventListener("input", () => {
    const isValid = fullName.value.length === 0 ||  fullName.value.length >= 3
    if (isValid) {
      fullName.classList.remove("invalid")
      fullName.classList.add("valid")
      error.textContent = "";
      error.classList.remove("active")
      payButton.disabled = false
      document.querySelector('.modal').style.height = '350px'
    } else {
      fullName.classList.add( "invalid")
      error.textContent = "Min. length 3";
      error.classList.add("error","active")
      payButton.disabled = true
      document.querySelector('.modal').style.height = '380px'
    }
  });
}

export function validateCardNumber() {
  const payButton = document.querySelector('.modal__pay')
  const error = cardNumber.nextElementSibling

  let text = cardNumber.value; 
  let pattern = /[a-zA-ZáéíöőúüűÁÉÍÖŐÚÜŰ]/g;
  if(!pattern.test(text)) {
    cardNumber.classList.remove("invalid")
    cardNumber.classList.add("valid")
    error.textContent = "";
    error.classList.remove("active")
    payButton.disabled = false
  } else {
    
    cardNumber.classList.add( "invalid")
    error.textContent = "Just number";
    error.classList.add("error","active")
    payButton.disabled = true
  }
}
