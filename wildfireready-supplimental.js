const domReady = () => {

	setTimeout(function () {
		const openModalVideoBtn = document.querySelector('#openModalBtn a');
		const openModalTranscriptBtn = document.querySelector('#openModalTranscriptBtn a');
		const bgPlayPauseContainer = document.querySelector('#bgPlayPause');
		const bgPlayPauseBtn = bgPlayPauseContainer.querySelector('a');
		const landingAreaVideo = document.querySelector('.wp-block-cover__video-background');

		if (openModalVideoBtn) {
			// Create the dialog element
			const dialog = document.createElement('dialog');
			dialog.id = 'modal';

			// Create the video element
			const video = document.createElement('video');
			video.id = 'video';
			video.autoplay = true;
			video.muted = true;

			// Create the source element for the video from the href of the button
			const source = document.createElement('source');
			source.src = openModalVideoBtn.getAttribute('href');
			source.type = 'video/mp4';

			const message = document.createElement('div');
			message.id = 'message';
			message.innerText = 'Click anywhere or press ESCAPE to close.'

			// Append the source element to the video element
			video.appendChild(source);

			// Append the video element to the dialog element
			dialog.appendChild(video);

			// Append the message element to the dialog element
			dialog.appendChild(message);

			// Append the dialog element to the document body
			document.body.appendChild(dialog);

			// Create the style element
			const style = document.createElement('style');
			style.textContent = `
			dialog {
				width: 100%;
				height: 100%;
				border: 0;
				margin: 0 auto;
				padding: 0;
				background-color: transparent;
				overflow: hidden;
			}
			dialog::backdrop {
				background-color: rgba(0, 0, 0, 0.8);
			}

			#message {
				color: #fff;
				font-size: 1rem;
				height: auto;
				text-align: center;
				display: inline-block;
				background-color: black;
				margin: 0 auto;
				padding: 0.75rem;
			}
		
			#video {
				width: 100%;
				max-width: 1920px;
				height: calc(100% - 6rem);
				margin: auto;
				display: block;
			}
			body.fixed {
				overflow: hidden;
			}
			`;

			// Append the style element to the document's head
			document.head.appendChild(style);

			// Function to open the modal dialog and play the video
			function openModal(e) {

				e.preventDefault();

				document.body.classList.add('fixed');
				if (landingAreaVideo) {
					landingAreaVideo.pause();
				}

				dialog.showModal();

				video.currentTime = 0;
				video.muted = false;
				video.play();

				dialog.addEventListener('click', closeModal);
				dialog.addEventListener('keypress', closeModal);
			}

			// Function to close the modal dialog and play the landing video
			function closeModal(e) {

				document.body.classList.remove('fixed');

				// Remove the event listeners
				dialog.removeEventListener('click', closeModal);
				dialog.removeEventListener('keypress', closeModal);

				if (landingAreaVideo) {
					if (!prefersReducedMotion()) {
						landingAreaVideo.play();
					}
				}

				dialog.close();
				video.pause();
				video.muted = true;

			}

			// Function to check if the user prefers reduced motion
			function prefersReducedMotion() {
				if (window.matchMedia) {
					const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
					return mediaQuery.matches;
				}
				return false;
			}

			openModalVideoBtn.addEventListener('click', openModal);

			if (prefersReducedMotion()) {
				video.pause();
				video.currentTime = 25;
			}

			// Function to handle key press events
			function handleKeyPress(event) {
				// Close the modal dialog if the Escape key is pressed
				if (event.key === 'Escape') {
					closeModal();
				}
			}

			if (bgPlayPauseContainer) {
				/**
				 * Pause background video on prefers-reduced-motion system setting for accessibility.
				 */
				const motionQuery = matchMedia('(prefers-reduced-motion)');
				const targetFrame = 300;
				const frameRate = 30;
				const targetTime = targetFrame / frameRate;

				if (motionQuery.matches && landingAreaVideo) {
					landingAreaVideo.autoplay = false;
					landingAreaVideo.pause();
					landingAreaVideo.currentTime = targetTime;

					bgPlayPauseContainer.classList.add('paused');
				}
				/**
				 * Pause background video button listener for accessibility.
				 */
				if (bgPlayPauseBtn && landingAreaVideo) {
					bgPlayPauseBtn.addEventListener('click', (e) => {
						e.preventDefault();

						if (landingAreaVideo.paused) {
							landingAreaVideo.play();
							bgPlayPauseContainer.classList.remove('paused');
						} else {
							landingAreaVideo.pause();
							bgPlayPauseContainer.classList.add('paused');
						}
					});
				}
			}

			// Create a MutationObserver instance to watch for changes in the open attribute
			const observer = new MutationObserver(function (mutations) {
				mutations.forEach(function (mutation) {
					if (mutation.attributeName === 'open') {
						if (dialog.open) {
							// Dialog opened
							// Add event listeners to handle clicks and key presses
							dialog.addEventListener('click', closeModal);
							document.addEventListener('keydown', handleKeyPress);
						} else {
							// Dialog closed
							// Remove event listeners
							dialog.removeEventListener('click', closeModal);
							document.removeEventListener('keydown', handleKeyPress);
							closeModal();
						}
					}
				});
			});

			// Observe changes in the open attribute of the dialog element
			observer.observe(dialog, { attributes: true });
		}

		if(openModalTranscriptBtn) {
			// deal with transcript
		}
	}, 0);
};

if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', domReady);
} else {
	domReady();
}
