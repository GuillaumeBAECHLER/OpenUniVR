var Peer = require('simple-peer')

function bindEvents(p) {
    p.on('error', function(err) {
        console.error(err)
    })
    p.on('signal', function(data) {
        document.querySelector('#offer').textContent = JSON.stringify(data)
    })
    p.on('stream', function(stream) {
        var video = document.querySelector('#receiver-video');
        if ("srcObject" in video) {
            video.srcObject = stream
        } else {
            // Avoid using this in new browsers, as it is going away.
            video.src = window.URL.createObjectURL(stream);
        }
        video.volume = 0
        video.onloadedmetadata = function(e) {
            video.play()
        };
    })

    document.querySelector('#incoming').addEventListener('submit', function(e) {
        e.preventDefault()
        p.signal(JSON.parse(e.target.querySelector('textarea').value))  
    })
}

function startPeer(initiator) {
    navigator.mediaDevices.getUserMedia({ audio: true, video: true })
        .then(function(stream) {
            var video = document.querySelector('#emitter-video');
            let p = new Peer({
                initiator,
                stream,
                trickle: false
            })
            bindEvents(p)
            // Older browsers may not have srcObject
            if ("srcObject" in video) {
                video.srcObject = stream
            } else {
                // Avoid using this in new browsers, as it is going away.
                video.src = window.URL.createObjectURL(stream);
            }
            video.volume = 0
            video.onloadedmetadata = function(e) {
                video.play()
            };
        })
        .catch(function(err) {
            document.querySelector('#error').innerHTML = err.name + ": " + err.message
        });
}

document.querySelector('#start').addEventListener('click', function (e) {
    startPeer(true)
})

document.querySelector('#receive').addEventListener('click', function (e) {
    startPeer(false)
})