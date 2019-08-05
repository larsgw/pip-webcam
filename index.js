const chroma = [80, 100, 110]

const Effects = {
  // BEGIN
  // Based on: https://developer.mozilla.org/en-US/docs/Web/Guide/Audio_and_video_manipulation
  // Contributors: mdnwebdocs-bot, chrisdavidmills, mfuji09, a-mt
  // Accessed: Mar 23, 2019, 6:00:16 PM
  // License: CC-BY-SA 2.5
  grey (frame) {
    const l = frame.length / 4

    for (var i = 0; i < l; i++) {
      const grey = (frame[i * 4 + 0] + frame[i * 4 + 1] + frame[i * 4 + 2]) / 3

      frame[i * 4 + 0] = grey
      frame[i * 4 + 1] = grey
      frame[i * 4 + 2] = grey
    }
  },
  sepia (frame) {
    const l = frame.length / 4

    for (var i = 0; i < l; i++) {
      const grey = (frame[i * 4 + 0] + frame[i * 4 + 1] + frame[i * 4 + 2]) / 3

      frame[i * 4 + 0] = grey * 1.1
      frame[i * 4 + 1] = grey * 1.05
      frame[i * 4 + 2] = grey * 0.75
    }
  },
  // END

  chromakey (frame) {
    const l = frame.length / 4

    for (var i = 0; i < l; i++) {
      var d = Math.hypot(
        chroma[0] - frame[i * 4 + 0],
        chroma[1] - frame[i * 4 + 1],
        chroma[2] - frame[i * 4 + 2]
      )
      var a = +(d > 25)
      frame[i * 4 + 3] = [0, 255][a]
    }
  },

  mirror_horizontal (frame) {
    const l = frame.length / 4

    for (var i = 0; i < l; i++) {
      var x = i % this.width
      var y = (i - x) / this.width
      if (x < 0.5 * this.width) {
        continue
      } else {
        var j = (y * this.width) + (this.width - x)
        var pr = frame[i * 4 + 0]
        var pg = frame[i * 4 + 1]
        var pb = frame[i * 4 + 2]

        frame[i * 4 + 0] = frame[j * 4 + 0]
        frame[i * 4 + 1] = frame[j * 4 + 1]
        frame[i * 4 + 2] = frame[j * 4 + 2]
        frame[j * 4 + 0] = pr
        frame[j * 4 + 1] = pg
        frame[j * 4 + 2] = pb
      }
    }
  },

  mirror_vertical (frame) {
    const l = frame.length / 4

    for (var i = 0; i < l; i++) {
      var x = i % this.width
      var y = (i - x) / this.width
      if (y < 0.5 * this.height) {
        continue
      } else {
        var j = ((this.height - y) * this.width) + x
        var pr = frame[i * 4 + 0]
        var pg = frame[i * 4 + 1]
        var pb = frame[i * 4 + 2]

        frame[i * 4 + 0] = frame[j * 4 + 0]
        frame[i * 4 + 1] = frame[j * 4 + 1]
        frame[i * 4 + 2] = frame[j * 4 + 2]
        frame[j * 4 + 0] = pr
        frame[j * 4 + 1] = pg
        frame[j * 4 + 2] = pb
      }
    }
  },

  mirror_left (frame) {
    const l = frame.length / 4

    for (var i = 0; i < l; i++) {
      var x = i % this.width
      var y = (i - x) / this.width
      if (x < 0.5 * this.width) {
        continue
      } else {
        var j = (y * this.width) + (this.width - x)
        frame[i * 4 + 0] = frame[j * 4 + 0]
        frame[i * 4 + 1] = frame[j * 4 + 1]
        frame[i * 4 + 2] = frame[j * 4 + 2]
      }
    }
  },

  mirror_right (frame) {
    const l = frame.length / 4

    for (var i = 0; i < l; i++) {
      var x = i % this.width
      var y = (i - x) / this.width
      if (x > 0.5 * this.width) {
        continue
      } else {
        var j = (y * this.width) + (this.width - x)
        frame[i * 4 + 0] = frame[j * 4 + 0]
        frame[i * 4 + 1] = frame[j * 4 + 1]
        frame[i * 4 + 2] = frame[j * 4 + 2]
      }
    }
  },

  mirror_top (frame) {
    const l = frame.length / 4

    for (var i = 0; i < l; i++) {
      var x = i % this.width
      var y = (i - x) / this.width
      if (y < 0.5 * this.height) {
        continue
      } else {
        var j = ((this.height - y) * this.width) + x
        frame[i * 4 + 0] = frame[j * 4 + 0]
        frame[i * 4 + 1] = frame[j * 4 + 1]
        frame[i * 4 + 2] = frame[j * 4 + 2]
      }
    }
  },

  mirror_bottom (frame) {
    const l = frame.length / 4

    for (var i = 0; i < l; i++) {
      var x = i % this.width
      var y = (i - x) / this.width
      if (y > 0.5 * this.height) {
        continue
      } else {
        var j = ((this.height - y) * this.width) + x
        frame[i * 4 + 0] = frame[j * 4 + 0]
        frame[i * 4 + 1] = frame[j * 4 + 1]
        frame[i * 4 + 2] = frame[j * 4 + 2]
      }
    }
  }
}

class Processor {
  constructor (video, button) {
    this.video = video
    this.canvas = document.createElement('canvas')
    this.context = this.canvas.getContext('2d')
  }

  async play () {
    this.video.srcObject = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true
    })
    this.video.play()

    const self = this
    return new Promise(resolve => {
      this.video.addEventListener('loadedmetadata', function () {
        self.canvas.width = self.width = self.video.videoWidth
        self.canvas.height = self.height = self.video.videoHeight

        resolve()
        self.computeFrame()
      })
    })
  }

  computeFrame () {
    this.context.drawImage(this.video, 0, 0, this.width, this.height)
    const frame = this.context.getImageData(0, 0, this.width, this.height)
    if (this.effect in Effects) {
      Effects[this.effect].call(this, frame.data)
    }
    this.context.putImageData(frame, 0, 0)

    window.requestAnimationFrame(this.computeFrame.bind(this))
  }
}

async function init () {
  const cam = navigator.getUserMedia
  const pip = 'pictureInPictureEnabled' in document

  if (!(cam && pip)) {
    alert(`Features not available: ${[!cam &&  'Webcam', !pip && 'Picture in Picture'].filter(Boolean).join(' and ')}`)
  }

  const processor = new Processor(source, button)

  button.addEventListener('click', async function () {
    button.disabled = true
    await target.requestPictureInPicture()
    button.disabled = false
  })

  effects.addEventListener('change', function () {
    console.log(this.value in Effects)
    processor.effect = this.value
  })

  await processor.play()

  target.srcObject = processor.canvas.captureStream()
  target.play()
}

document.addEventListener('DOMContentLoaded', function () {
  init().catch(e => { throw e })
}, false)
