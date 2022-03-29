
/**
 * 检查是否存在该字体
 * @param {*} name 
 * @returns 
 */
export const checkFont = (name) => {
  const values = document.fonts.values();
  let isHave = false;
  let item = values.next();
  while (!item.done && !isHave) {
    const fontFace = item.value;
    if (fontFace.family === name) {
      isHave = true;
    }
    item = values.next();
  }
  return isHave;
}

/**
 * 加载字体
 * @param {*} obj 
 */
export const loadFont = (obj) => {
  if (document.fonts && !checkFont(obj.cssValue)) {
    // let fontFamily = obj.cssValue;
    let fontFace = new FontFace(obj.cssValue, `local('${obj.cssValue}'),url('${obj.url}') format('ttf'),url('${obj.url}')`);
    fontFace.load().then((loadedFontFace) => {
      document.fonts.add(loadedFontFace);
    })
  }
}

/**
 * 截图视频
 * @param {*} file 
 * @param {*} url 
 * @returns 
 */
export const getCoverFromVideo = (file, url = '') => {
  if (!url && !file) return;
  const video = document.createElement('video');
  video.muted = true;
  video.controls = true;
  video.style.visibility = "hidden"
  video.style.position = 'absolute';
  video.style.top = '0';
  video.crossOrigin = 'anonymous';

  document.body.appendChild(video);
  video.src = file ? window.URL.createObjectURL(file) : url;
  let imgHeight = 0, imgWidth = 0, videoWidth = 0, videoHeight = 0;
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  return new Promise((res, rej) => {
    video.addEventListener("canplay", function () {
      canvas.width = imgWidth = video.offsetWidth;
      canvas.height = imgHeight = video.offsetHeight;
      videoWidth = video.videoWidth;
      videoHeight = video.videoHeight;
      video.play();
      setTimeout(() => {
        video.pause();
        ctx?.drawImage(video, 0, 0, videoWidth, videoHeight, 0, 0, imgWidth, imgHeight);
        const dataUrl = canvas.toDataURL("image/png");
        // const link = document.createElement("a");
        // link.href = dataUrl;
        // link.download = "test.png";
        // document.body.appendChild(link);
        // link.click();
        // document.body.removeChild(link);
        document.body.removeChild(video);
        res(dataUrl);
      }, 1000);
      // video.removeEventListener("canplay", arguments.callee);
    })
  })
}