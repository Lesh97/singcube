import "../scss/styles.scss";
import regeneratorRuntime from "regenerator-runtime";

alert("실행");

const createCircle = () => {
  const bgWhole = document.querySelector(".bghomepage");
  const circle = document.createElement("span");
  const circleNames = ["circle-green", "circle-pink", "circle-blue"];
  const circleName = circleNames[getRandomIntInclusive(0, 2)];
  function getRandomIntInclusive(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  circle.classList.add(circleName);

  circle.style.borderRadius = 100 + "px";

  circle.style.zIndex = -1;

  const size = Math.random() * 50;
  circle.style.width = 20 + size + "px";
  circle.style.height = 20 + size + "px";
  const { innerWidth, innerHeight } = window;
  circle.style.left = Math.random() * (innerWidth - 100) + "px";
  circle.style.top = Math.random() * (innerHeight - 100) + "px";
  bgWhole.appendChild(circle);
  setTimeout(() => {
    circle.remove();
  }, 5000);
};

setInterval(createCircle, 500);
