document.addEventListener('DOMContentLoaded', function () {
    const startRecordingButton = document.getElementById('startRecording');
    const stopButton = document.getElementById('stop');
    const downloadButton = document.getElementById('download');
    const result = document.getElementById('result');
//    const progressBar = document.getElementById('progressBar');
    let intervalId; // Declare intervalId in the global scope


    startRecordingButton.addEventListener('click', startRecording);
    stopButton.addEventListener('click', stopRecording);
    downloadButton.addEventListener('click', downloadFile);

    async function startRecording() {
    // Set the duration of the recording in milliseconds
    result.innerHTML = "Recording...";
    const duration = 10000;
    const progressBar = document.getElementById('progressBar');
    progressBar.style.width = '0%';

    const increment = 100 / (duration / 100);
    let progress = 0;

    intervalId = setInterval(function() {
      progress += increment;
      progressBar.style.width = progress + '%';

      if (progress >= 100) {
        clearInterval(intervalId);
      }
    }, 100);

        // Start recording using /start_recording endpoint
        fetch('/start_recording')
            .then(response => response.json())
            .then(data => {
                console.log(data.message);
                downloadButton.style.display = 'inline';
                result.innerHTML = data.message;
            })
            .catch(error => console.error('Error:', error));
        }

// Download File

    async function downloadFile() {
        clearInterval(intervalId);
        document.getElementById('progressBar').style.width = '0%';
        document.getElementById('spinner').classList.remove('d-none');

        // Prompt the user for a file name
        var fileName = prompt("Enter file name:");
        result.innerHTML = "Processing..";
        // Send the file name to the server using AJAX
        fetch('/upload', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ file_name: fileName }),
        })
        .then(response => response.json())
        .then(data => {
            // Display the server's response
            result.innerHTML = data.message;
            alert(data.message);
            if(data.val){
            showGif('/static/images/one.gif');
            }else{
            showGif('/static/images/two.gif');
            }
            document.getElementById('spinner').classList.add('d-none');
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }

//    Stop Recording
    function stopRecording() {
    clearInterval(intervalId);
    document.getElementById('progressBar').style.width = '0%';

    fetch('/stop_recording')
    .then(response => response.json())
            .then(data => {
                console.log(data.message);
                result.innerHTML = data.message;
            })
    .catch(error => console.error('Error:', error));
    console.log("Recording Stopped");
    }

//    Shoe GIF
    function showGif(path) {
    const gifContainer = document.getElementById('gifContainer');
    const gifImage = document.getElementById('gifImage');

    // Set the source of the GIF
    gifImage.src = path;

    // Show the GIF container
    gifContainer.style.display = 'block';
  }

});
