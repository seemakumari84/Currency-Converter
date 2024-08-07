document.addEventListener("DOMContentLoaded", function () {
  let selects = document.querySelectorAll("select");
  let inputs = document.querySelectorAll("input");
  let loadingTxt = document.querySelector(".loading-txt");
  let fromFlag = document.getElementById("from-flag");
  let toFlag = document.getElementById("to-flag");

  const listUrl = `https://api.frankfurter.app/currencies`;

  fetch(listUrl)
      .then((data) => data.json())
      .then((data) => {
          let entries = Object.entries(data);

          for (let i = 0; i < entries.length; i++) {
              let selected1 = entries[i][0] === "USD" ? "selected" : "";
              let selected2 = entries[i][0] === "INR" ? "selected" : "";

              selects[0].innerHTML += `<option value="${entries[i][0]}" ${selected1}>${entries[i][0]}</option>`;
              selects[1].innerHTML += `<option value="${entries[i][0]}" ${selected2}>${entries[i][0]}</option>`;
          }

          updateFlags();
          getRates(selects[0].value, selects[1].value);
      });

  function getRates(from, to) {
      let inputVal = inputs[0].value;
      let baseUrl = `https://api.frankfurter.app/latest?amount=${inputVal}&from=${from}&to=${to}`;

      loadingTxt.style.visibility = "visible";

      fetch(baseUrl)
          .then((data) => data.json())
          .then((val) => {
              inputs[1].value = Object.values(val.rates)[0];
              loadingTxt.style.visibility = "hidden";
          });
  }

  function getrateonChange() {
      if (inputs[0].value > 0) {
          getRates(selects[0].value, selects[1].value);
      } else {
          inputs[1].value = 0;
      }
  }

  function updateFlags() {
      let fromCurrency = selects[0].value;
      let toCurrency = selects[1].value;

      fromFlag.src = `https://flagsapi.com/${fromCurrency.substring(0, 2)}/flat/64.png`;
      toFlag.src = `https://flagsapi.com/${toCurrency.substring(0, 2)}/flat/64.png`;
  }

  inputs[0].addEventListener("keyup", () => {
      getrateonChange();
  });

  for (let i = 0; i < selects.length; i++) {
      selects[i].addEventListener("change", () => {
          updateFlags();
          getrateonChange();
      });
  }

  document.querySelector(".icon").addEventListener("click", (e) => {
      e.preventDefault();
      let tempVal = selects[0].value;
      selects[0].value = selects[1].value;
      selects[1].value = tempVal;
      updateFlags();
      getRates(selects[0].value, selects[1].value);
  });
});
