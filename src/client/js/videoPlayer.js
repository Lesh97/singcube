const video = document.querySelector("video");
const playBtn = document.getElementById("play");
const playBtnIcon = playBtn.querySelector("i");
const muteBtn = document.getElementById("mute");
const muteBtnIcon = muteBtn.querySelector("i");
const volumeRange = document.getElementById("volume");
const currentTime = document.getElementById("currentTime");
const totalTime = document.getElementById("totalTime");
const timeline = document.getElementById("timeline");
const fullScreenBtn = document.getElementById("fullScreen");
const fullScreenIcon = fullScreenBtn.querySelector("i");
const videoContainer = document.getElementById("videoContainer");
const videoControls = document.getElementById("videoControls");

const defaultVolume = 0.5;
let inputVolume = defaultVolume;
let changeVolume = defaultVolume;
video.volume = defaultVolume;
let controlsTimeout = null;
let controlsMovementTimeout = null;

const handlePlayClick = (event) => {
  //비디오 멈추기
  if (video.paused) {
    video.play();
  } else {
    video.pause();
  }
  playBtnIcon.classList = video.paused ? "fas fa-play" : "fas fa-pause";
};

const handleMute = (event) => {
  video.muted = video.muted ? false : true;
  muteBtnIcon.classList = video.muted
    ? "fas fa-volume-mute"
    : "fas fa-volume-up";
  volumeRange.value = video.muted
    ? "0"
    : inputVolume < changeVolume
    ? changeVolume
    : inputVolume;
  video.volume = volumeRange.value;
};

const handleInputVolumeChange = (event) => {
  const {
    target: { value },
  } = event;
  if (video.muted) {
    video.muted = false;
    muteBtn.innerText = "Mute";
  }

  // 직접 소리를 컨트롤할 때 음소거 버튼 변경
  if (Number(value) === 0) {
    video.muted = true;
    muteBtn.innerText = "Unmute";
  }
  inputVolume = value;
  video.volume = value;
};

const handleChangeVolumeRange = (event) => {
  const {
    target: { value },
  } = event;
  if (Number(value) === 0) {
    muteBtn.innerText = "Unmute";
    video.muted = true;
  } else {
    changeVolume = value;
  }
};
console.log("a");
const formatTime = (seconds) =>
  new Date(seconds * 1000).toISOString().substring(14, 19);
console.log("b");
const handleLoadedMetadata = () => {
  console.log(video.duration);
  console.log(Math.floor(video.duration));
  //totalTime.innerText = formatTime(Math.floor(video.duration));
  totalTime.innerText = video.duration;
  console.log(formatTime(Math.floor(video.duration)));
  timeline.max = Math.floor(video.duration);
  console.log(totalTime);
};
console.log("c");
const handleTimeUpdate = () => {
  currentTime.innerText = formatTime(Math.floor(video.currentTime));
  timeline.value = Math.floor(video.currentTime);
  console.log(currentTime);
};

const handleTimelineChange = (event) => {
  const {
    target: { value },
  } = event;
  video.currentTime = value;
};

const handleFullScreen = () => {
  const fullScreen = document.fullscreenElement;
  if (fullScreen) {
    document.exitFullscreen();
    fullScreenIcon.classList = "fas fa-expand";
  } else {
    videoContainer.requestFullscreen();
    fullScreenIcon.classList = "fas fa-compress";
  }
};

const hideControls = () => {
  videoControls.classList.remove("showing");
};

const handleMouseMove = () => {
  if (controlsTimeout) {
    clearTimeout(controlsTimeout);
    controlsTimeout = null;
  }
  if (controlsMovementTimeout) {
    clearTimeout(controlsMovementTimeout);
    controlsMovementTimeout = null;
  }
  videoControls.classList.add("showing");
  controlsMovementTimeout = setTimeout(hideControls, 3000);
};

const handleMouseLeave = () => {
  controlsTimeout = setTimeout(hideControls, 3000);
};

const handleKeydown = (event) => {
  if (event.key === "space" || event.keyCode === 32) {
    handlePlayClick();
  }
};

const handleKeyup = (event) => {
  if (event.key === "M" || event.keyCode === 77) {
    handleMute();
  }
  if (event.key === "F" || event.keyCode === 70) {
    handleFullScreen();
  }
};

const handleEnded = () => {
  const { id } = videoContainer.dataset;
  fetch(`/api/videos/${id}/view`, { method: "POST" });
};

playBtn.addEventListener("click", handlePlayClick);
muteBtn.addEventListener("click", handleMute);
volumeRange.addEventListener("input", handleInputVolumeChange);
volumeRange.addEventListener("change", handleChangeVolumeRange);
video.addEventListener("loadedmetadata", handleLoadedMetadata);
video.addEventListener("timeupdate", handleTimeUpdate);
video.addEventListener("ended", handleEnded);
videoContainer.addEventListener("mousemove", handleMouseMove);
videoContainer.addEventListener("mouseleave", handleMouseLeave);
document.addEventListener("keydown", handleKeydown);
document.addEventListener("keyup", handleKeyup);
timeline.addEventListener("input", handleTimelineChange);
fullScreenBtn.addEventListener("click", handleFullScreen);
