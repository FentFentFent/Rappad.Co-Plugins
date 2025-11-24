(function(addon) {
	const textareaRef = () => addon.rappad.editor.react.refs.lyricsTextbox;

	let oldRender = null;
	let inputListener = null;

	function resizeTextarea() {
		const textarea = textareaRef();
		if (!textarea) return;

		textarea.style.whiteSpace = 'pre';
		textarea.style.overflow = 'auto';
		textarea.classList.add('textarea-custom-scrollbar');
	}

	// Inject custom scrollbar styles
	const style = document.createElement('style');
	style.textContent = `
	.textarea-custom-scrollbar::-webkit-scrollbar {
		width: 8px;
		height: 8px;
	}

	.textarea-custom-scrollbar::-webkit-scrollbar-track {
		background: #f0f0f0;
		border-radius: 4px;
	}

	.textarea-custom-scrollbar::-webkit-scrollbar-thumb {
		background: #888;
		border-radius: 4px;
	}

	.textarea-custom-scrollbar::-webkit-scrollbar-thumb:hover {
		background: #555;
	}

	.textarea-custom-scrollbar {
		scrollbar-width: thin; /* Firefox */
		scrollbar-color: #888 #f0f0f0; /* Firefox */
	}
	`;
	document.head.appendChild(style);

	function newRenderSongLyrics(...args) {
		const result = oldRender.apply(this, args);

		requestAnimationFrame(() => {
			const textarea = textareaRef();
			if (!textarea) return;

			resizeTextarea();

			if (!inputListener) {
				inputListener = () => resizeTextarea();
				textarea.addEventListener('input', inputListener);
			}
		});

		return result;
	}

	addon.onToggled = function(enabled) {
		if (!addon.rappad || !addon.rappad.editor || !addon.rappad.editor.react) return;

		const textarea = textareaRef();

		if (enabled) {
			if (!oldRender) oldRender = addon.rappad.editor.react.renderSongLyrics;
			addon.rappad.editor.react.renderSongLyrics = newRenderSongLyrics;

			requestAnimationFrame(() => {
				if (textarea) resizeTextarea();
			});
		} else {
			if (textarea) {
				textarea.classList.remove('textarea-custom-scrollbar');
				if (inputListener) {
					textarea.removeEventListener('input', inputListener);
					inputListener = null;
				}
			}
			if (oldRender) {
				addon.rappad.editor.react.renderSongLyrics = oldRender;
			}
		}
	};
})(addon);
