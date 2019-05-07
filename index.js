document.addEventListener('DOMContentLoaded', async function () {
  const cam = navigator.getUserMedia
  const pip = 'pictureInPictureEnabled' in document

  if (!(cam && pip)) {
    alert(`Features not available: ${[!cam &&  'Webcam', !pip && 'Picture in Picture'].filter(Boolean).join(' and ')}`)
  }

  video.srcObject = await navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
  })
  video.play()

  button.addEventListener('click', async function() {
    button.disabled = true
    await video.requestPictureInPicture()
    button.disabled = false
  })
}, false)
