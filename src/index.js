import { Timeline } from "./plugins/timeline";
import "./index.css";

const popup = document.getElementById("timeline-wrapper");
const points = document.getElementsByClassName("point");
let timeline;

const seqCount = {
  "INT3D-72": 165,
  "INT3D-73": 217,
  "INT3D-74": 167,
  "INT3D-75": 70,
}

const showVideo = (id) => {
  popup.classList.add("opened");

  timeline = new Timeline({
    containerId: "timeline",
    namePattern: id,
    fileExtension: "jpg",
    framesCount: seqCount[id],
    framesFolder: `/static/${id}`,
    fps: 15
  });

  timeline.init();
};

const closePopUp = () => {
  if (popup.classList.contains("opened")) {
    popup.classList.remove("opened");
    timeline.destroy();
  }
}

for (let point of points) {
  point.addEventListener("click", () => {
    showVideo(point.getAttribute("data-point"))
  });
}

document.getElementById("closeButton").addEventListener("click", () => {
  closePopUp();
});
