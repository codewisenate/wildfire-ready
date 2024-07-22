/**
 * Initialize the DOM when ready
 */
const domReady = () => {
	setTimeout(function () {
		const openModalVideoBtn = document.querySelector('#openModalBtn a');
		const openTranscriptBtn = document.querySelector('#openTranscriptBtn a');
		const closeTranscriptBtn = document.querySelector('#closeTranscriptBtn a');
		const transcriptContentGroup = document.querySelector('#transcript-content');
		const bgPlayPauseContainer = document.querySelector('#bgPlayPause');
		const bgPlayPauseBtn = bgPlayPauseContainer ? bgPlayPauseContainer.querySelector('a') : null;
		const landingAreaVideo = document.querySelector('.wp-block-cover__video-background');
		let wasLandingAreaVideoPlaying = true;

		/**
		 * Create a modal dialog with a video element
		 * @param {string} videoSrc - The source URL for the video
		 * @returns {HTMLDialogElement} - The created dialog element
		 */
		const createModal = (videoSrc) => {
			const dialog = document.createElement('dialog');
			dialog.id = 'modal';

			const video = document.createElement('video');
			video.id = 'video';
			video.autoplay = true;
			video.muted = true;

			const source = document.createElement('source');
			source.src = videoSrc;
			source.type = 'video/mp4';

			const message = document.createElement('div');
			message.id = 'message';
			message.innerText = 'Click anywhere or press ESCAPE to close.';

			video.appendChild(source);
			dialog.appendChild(video);
			dialog.appendChild(message);

			return dialog;
		};

		/**
		 * Create and append modal styles to the document head
		 */
		const createModalStyles = () => {
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
			document.head.appendChild(style);
		};

		/**
		 * Check if the user prefers reduced motion
		 * @returns {boolean} - True if the user prefers reduced motion, otherwise false
		 */
		const prefersReducedMotion = () => {
			if (window.matchMedia) {
				const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
				if (mediaQuery) { wasLandingAreaVideoPlaying = false; }
				return mediaQuery.matches;
			}
			return false;
		};

		/**
		 * Handle modal opening and closing functionality
		 * @param {HTMLAnchorElement} openModalVideoBtn - The button that triggers the modal
		 * @param {HTMLVideoElement} landingAreaVideo - The background video element
		 */
		const handleModal = (openModalVideoBtn, landingAreaVideo) => {
			const dialog = createModal(openModalVideoBtn.getAttribute('href'));
			document.body.appendChild(dialog);
			createModalStyles();

			/**
			 * Open the modal dialog and play the video
			 * @param {Event} e - The event object
			 */
			const openModal = (e) => {
				e.preventDefault();
				document.body.classList.add('fixed');
				if (landingAreaVideo) {
					wasLandingAreaVideoPlaying = !landingAreaVideo.paused;
					landingAreaVideo.pause();
				}
				dialog.showModal();
				const video = dialog.querySelector('video');
				video.muted = false;
				video.currentTime = 0;
				video.controls = true;
				video.play();
			};

			/**
			 * Close the modal dialog and resume background video if applicable
			 */
			const closeModal = () => {
				document.body.classList.remove('fixed');
				if (landingAreaVideo  && wasLandingAreaVideoPlaying && !prefersReducedMotion()) { 
					landingAreaVideo.play();
					bgPlayPauseContainer.classList.remove('paused');
				}
				dialog.close();
				const video = dialog.querySelector('video');
				video.muted = true;
				video.pause();
			};

			/**
			 * Handle key press events to close the modal on Escape key press
			 * @param {KeyboardEvent} event - The keyboard event object
			 */
			const handleKeyPress = (event) => {
				if (event.key === 'Escape') closeModal();
			};

			openModalVideoBtn.setAttribute('role', 'button');
			
			openModalVideoBtn.addEventListener('click', openModal);
			dialog.addEventListener('click', closeModal);
			document.addEventListener('keydown', handleKeyPress);

			const observer = new MutationObserver((mutations) => {
				mutations.forEach((mutation) => {
					if (mutation.attributeName === 'open') {
						if (dialog.open) {
							dialog.addEventListener('click', closeModal);
							document.addEventListener('keydown', handleKeyPress);
							if (!bgPlayPauseContainer.classList.contains('paused')) bgPlayPauseContainer.classList.add('paused');
						} else {
							dialog.removeEventListener('click', closeModal);
							document.removeEventListener('keydown', handleKeyPress);
							if (bgPlayPauseContainer && wasLandingAreaVideoPlaying) bgPlayPauseContainer.classList.remove('paused');
							closeModal();
						}
					}
				});
			});

			observer.observe(dialog, { attributes: true });
		};

		if (openModalVideoBtn) handleModal(openModalVideoBtn, landingAreaVideo);

		if (bgPlayPauseContainer) {
			const targetFrame = 300;
			const frameRate = 30;
			const targetTime = targetFrame / frameRate;

			if (prefersReducedMotion() && landingAreaVideo) {
				landingAreaVideo.autoplay = false;
				landingAreaVideo.pause();
				landingAreaVideo.currentTime = targetTime;
				bgPlayPauseContainer.classList.add('paused');
				wasLandingAreaVideoPlaying = false;
			}

			if (bgPlayPauseBtn && landingAreaVideo) {

				bgPlayPauseBtn.setAttribute('role', 'button');

				bgPlayPauseBtn.addEventListener('click', (e) => {
					e.preventDefault();
					if (landingAreaVideo.paused) {
						landingAreaVideo.play();
						bgPlayPauseContainer.classList.remove('paused');
						wasLandingAreaVideoPlaying = true;
					} else {
						landingAreaVideo.pause();
						bgPlayPauseContainer.classList.add('paused');
						wasLandingAreaVideoPlaying = false;
					}
				});
			}
		}

		if (openTranscriptBtn && transcriptContentGroup) {

			openTranscriptBtn.setAttribute('role', 'button');

			openTranscriptBtn.addEventListener('click', (e) => {
				e.preventDefault();
				transcriptContentGroup.classList.toggle('hidden');
				if (transcriptContentGroup.classList.contains('hidden')) {
					openTranscriptBtn.querySelector('strong').innerText = 'Read transcript';
					setTimeout(function () {
						window.scrollTo({ top: 0, behavior: 'smooth' });
					}, 0);
				} else {
					openTranscriptBtn.querySelector('strong').innerText = 'Close transcript';
					const header = document.querySelector('#transcript-content .wp-block-heading');
					header.setAttribute('tabindex', '0');
					header.focus();
					header.removeAttribute('tabindex');
					setTimeout(function () {
						document.querySelector('#transcript-content').scrollIntoView({ behavior: 'smooth' });
					}, 0);
				}
			});
		}

		if (closeTranscriptBtn && transcriptContentGroup) {
			closeTranscriptBtn.setAttribute('role', 'button');
		
			closeTranscriptBtn.addEventListener('click', (e) => {
				e.preventDefault();
				transcriptContentGroup.classList.add('hidden');
				openTranscriptBtn.querySelector('strong').innerText = 'Read transcript';
				openTranscriptBtn.focus();
				setTimeout(function () {
					window.scrollTo({ top: 0, behavior: 'smooth' });
				}, 0);
			});
		
			closeTranscriptBtn.addEventListener('keypress', (e) => {
				if (e.key === ' ' || e.key === 'Enter') {
					e.preventDefault();
					closeTranscriptBtn.click();
				}
			});
		}
		
	}, 0);
};

if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', domReady);
} else {
	domReady();
}
