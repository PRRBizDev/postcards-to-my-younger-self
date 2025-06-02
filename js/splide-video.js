document.addEventListener('DOMContentLoaded', function() {
  // Initialize YouTube API variables
  var players = [];
  var videoIds = [
    '8DKLYsikxTs',  // First video ID
    '02xQVDyLWsw',  // Second video ID
    'K2GOERPXgeI'   // Third video ID
  ];

  // Initialize Splide
  var splide = new Splide('.splide', {
    type: 'loop',
    perPage: 1,
    perMove: 1,
    gap: '2rem',
    pagination: true,
    arrows: true,
    autoplay: true,
    interval: 8000,
    pauseOnHover: true,
    pauseOnFocus: true,
  }).mount();

  // Function to create YouTube players when API is ready
  window.onYouTubeIframeAPIReady = function() {
    // Create placeholder divs for YouTube players
    for (var i = 0; i < videoIds.length; i++) {
      var playerId = 'youtube-player-' + i;
      var placeholderDiv = document.createElement('div');
      placeholderDiv.id = playerId;

      // Find the corresponding video overlay in each slide
      var videoOverlay = document.querySelectorAll('.video-overlay')[i];
      if (videoOverlay) {
        videoOverlay.parentNode.insertBefore(placeholderDiv, videoOverlay);
        placeholderDiv.style.display = 'none'; // Hide initially
      }

      // Create the player
      players[i] = new YT.Player(playerId, {
        videoId: videoIds[i],
        playerVars: {
          autoplay: 0,
          controls: 1,
          modestbranding: 1,
          rel: 0,
        },
        events: {
          'onStateChange': function(event) {
            // Create closure to capture current index
            return function(event) {
              onPlayerStateChange(event, i);
            };
          }(i)
        }
      });
    }
  };

  // Handle player state changes
  function onPlayerStateChange(event, currentIndex) {
    // YT.PlayerState.PLAYING = 1
    if (event.data === 1) {
      // Pause Splide autoplay
      splide.Components.Autoplay.pause();

      // Pause other videos
      for (var i = 0; i < players.length; i++) {
        if (i !== currentIndex && players[i] && typeof players[i].pauseVideo === 'function') {
          players[i].pauseVideo();
        }
      }
    }
    // YT.PlayerState.ENDED = 0
    else if (event.data === 0) {
      // Resume Splide autoplay
      splide.Components.Autoplay.play();
    }
  }

  // Handle click on video thumbnails
  var videoOverlays = document.querySelectorAll('.video-overlay');
  for (var i = 0; i < videoOverlays.length; i++) {
    (function(index) {
      videoOverlays[index].addEventListener('click', function() {
        // Show YouTube player
        var playerId = 'youtube-player-' + index;
        var player = document.getElementById(playerId);
        player.style.display = 'block';

        // Hide thumbnail overlay
        this.style.display = 'none';

        // Play the video
        if (players[index] && typeof players[index].playVideo === 'function') {
          players[index].playVideo();
        }
      });
    })(i);
  }

  // Handle slide change
  splide.on('moved', function() {
    // Pause all videos
    for (var i = 0; i < players.length; i++) {
      if (players[i] && typeof players[i].pauseVideo === 'function') {
        players[i].pauseVideo();
      }

      // Reset UI
      var playerId = 'youtube-player-' + i;
      var player = document.getElementById(playerId);
      if (player) {
        player.style.display = 'none';
      }

      var videoOverlay = videoOverlays[i];
      if (videoOverlay) {
        videoOverlay.style.display = 'block';
      }
    }
  });
});
