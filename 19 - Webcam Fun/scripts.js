const video = document.querySelector('.player');
const canvas = document.querySelector('.photo');
const ctx = canvas.getContext('2d');
const strip = document.querySelector('.strip');
const snap = document.querySelector('.snap');

/**
 * Use the webcam to get video stream
 */
function getVideo() {
    navigator.mediaDevices.getUserMedia({video: true, audio: false})
        .then(localMediaStream => {
            video.src = window.URL.createObjectURL(localMediaStream);
            video.play();
        })
        .catch(err => {
            console.error(`this site needs access to your webcam`, err)
        });
}

/**
 * Paint the webcam image on canvas
 * @returns {number}
 */
function paintToCanvas() {
    const videoWidth = video.videoWidth;
    const videoHeight = video.videoHeight;

    canvas.width = videoWidth;
    canvas.height = videoHeight;


    return setInterval(() => {
        // draw image into canvas every 16 ms
        ctx.drawImage(video, 0, 0, videoWidth, videoHeight);

        // take the pixels out
        let pixels = ctx.getImageData(0, 0, videoWidth, videoHeight);
        // mess with them
        pixels = rgbSplit(pixels);
        // stack image with transparency. Ghost effect
        ctx.globalAlpha = 0.1;
        // put them back
        ctx.putImageData(pixels, 0, 0);

    }, 16);

}

/**
 * Take photo from the canvas and make it downloadable
 */
function takePhoto() {
    // sound part
    snap.currentTime = 0;
    snap.play();

    // take the data out of the canvas
    const data = canvas.toDataURL('image/jpeg');
    const link = document.createElement('a');
    link.href = data;
    link.setAttribute('download', 'handsome');
    link.innerHTML = `<img src="${data}" alt="handsome" />`;
    strip.insertBefore(link, strip.firstChild);

}

/**
 * Apply red effect on photo
 * @param pixels
 * @returns {*}
 */
function redEffect(pixels) {
    for (let i = 0; i < pixels.data.length; i += 4) {
        pixels.data[i + 0] = pixels.data[i + 0] + 100; // red
        pixels.data[i + 1] = pixels.data[i + 1] - 50; // green
        pixels.data[i + 2] = pixels.data[i + 2] * 0.5; // blue
    }
    return pixels;
}

/**
 *
 * @param pixels
 * @returns {*}
 */
function rgbSplit(pixels) {
    for (let i = 0; i < pixels.data.length; i += 4) {
        pixels.data[i - 150] = pixels.data[i + 0]; // red
        pixels.data[i + 100] = pixels.data[i + 1]; // green
        pixels.data[i - 150] = pixels.data[i + 2]; // blue
    }
    return pixels;
}

/**
 * Remove color chosen from inputs depending of a range/level
 * @param pixels
 * @returns {*}
 */
function greenScreen(pixels) {
    const levels = {};

    document.querySelectorAll('.rgb input').forEach((input) => {
        levels[input.name] = input.value;
    });

    for (i = 0; i < pixels.data.length; i = i + 4) {
        let red = pixels.data[i + 0];
        let green = pixels.data[i + 1];
        let blue = pixels.data[i + 2];
        let alpha = pixels.data[i + 3];

        if (red >= levels.rmin
            && green >= levels.gmin
            && blue >= levels.bmin
            && red <= levels.rmax
            && green <= levels.gmax
            && blue <= levels.bmax) {
            // take it out!
            pixels.data[i + 3] = 0;
        }
    }

    return pixels;
}


getVideo();

video.addEventListener('canplay', paintToCanvas);