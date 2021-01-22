import "./timeline.css";

const LAYOUT = `
    <div class="loadingStatus">Loading...</div>
    <div class="progressBar"></div>
    <canvas class="view"></canvas>
    <div class="controlsWrapper">
      <button class="playButton">Play</button>
      <input class="rangeControl" type="range" value="0" min="0">
    </div>
`;

export default class Timeline {
  currentFrame = 0;
  isPlaying = false;
  data = [];
  interval;

  constructor(
    {
      containerId,
      namePattern,
      fileExtension,
      framesCount,
      framesFolder,
      fps
    }) {
    this.containerId = containerId;
    this.namePattern = namePattern;
    this.fileExtension = fileExtension;
    this.framesCount = framesCount;
    this.framesFolder = framesFolder;
    this.fps = fps;
  }

  init() {
    const container = document.getElementById(this.containerId);
    container.classList.add("timelineWrapper");
    container.innerHTML = LAYOUT;
    this.loadingStatus = container.getElementsByClassName("loadingStatus")[0];
    this.progressBar = container.getElementsByClassName("progressBar")[0];
    this.playButton = container.getElementsByClassName("playButton")[0];
    this.rangeControl = container.getElementsByClassName("rangeControl")[0];
    this.rangeControl.max = String(this.framesCount - 1);
    this.view = container.getElementsByClassName("view")[0];
    this.ctx = this.view.getContext('2d');

    this.generateFrameData();
    this.cacheImages();
    this.setFrame(1);

    this.rangeControl.addEventListener("change", () => {
      this.setFrame(+this.rangeControl.value);
    });

    this.rangeControl.addEventListener("input", () => {
      this.pause();
      this.setFrame(+this.rangeControl.value);
    });

    this.playButton.addEventListener("click", () => {
      if (this.isPlaying) {
        this.pause();
      } else {
        this.play();
      }
    });
  };

  setLoadingProgress(percentage) {
    this.progressBar.style.width = percentage + "%";
    this.loadingStatus.innerText = `Please wait, loading... ${Math.ceil(100 - percentage)}%`;

    if (!percentage) {
      this.progressBar.remove();
      this.loadingStatus.remove();
      this.play();
    }
  }

  generateFrameData() {
    for (let i = 0; i < this.framesCount; i++) {
      this.data
      .push(`.${this.framesFolder}/${this.namePattern}.${("000" + i)
      .slice(-4)}.${this.fileExtension}`);
    }
  }

  cacheImages() {
    const list = [];
    for (let i = 0; i < this.data.length; i++) {
      fetch(this.data[i]).then((response) => {
        caches.open("widget-cache").then((cache) => {
          list.push(i);
          this.setLoadingProgress(100 - (list.length / this.data.length * 100));
        });
      });
    }
  }

  setFrame(frame) {
    this.currentFrame = frame;
    this.rangeControl.value = frame;
    let image = new Image();
    image.src = `.${this.framesFolder}/${this.namePattern}.${("000" + frame)
    .slice(-4)}.${this.fileExtension}`
    image.onload = () => {
      this.view.height = image.naturalHeight;
      this.view.width = image.naturalWidth;
      this.ctx.drawImage(image, 0, 0);
    }
  }

  play() {
    this.isPlaying = true;
    this.playButton.innerText = "Pause";
    this.interval = setInterval(() => {
      if (this.currentFrame < this.framesCount - 1) {
        this.currentFrame += 1;
        this.setFrame(this.currentFrame);
      } else {
        this.currentFrame = 0;
        this.pause();
      }
    }, 1000 / this.fps);
  }

  pause() {
    clearInterval(this.interval);
    this.isPlaying = false;
    this.playButton.innerText = "Play";
  }

  destroy() {
    document.getElementById(this.containerId).innerHTML = "";
    clearInterval(this.interval);
  }
}
