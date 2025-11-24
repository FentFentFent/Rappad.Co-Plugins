(function(addon) {
	const textareaRef = () => addon.rappad.editor.react.refs.lyricsTextbox;

	let oldRender = null;

	function resizeTextarea() {
		const textarea = textareaRef();
		if (!textarea) return;

		const lines = textarea.value.split('\n');
		let maxWidth = 0;

		const span = document.createElement('span');
		document.body.appendChild(span);
		span.style.visibility = 'hidden';
		span.style.whiteSpace = 'pre';
		span.style.font = getComputedStyle(textarea).font;

		lines.forEach(line => {
			span.textContent = line || ' ';
			maxWidth = Math.max(maxWidth, span.offsetWidth);
		});

		document.body.removeChild(span);

		textarea.style.whiteSpace = 'pre';
		textarea.style.overflowX = 'auto';
		textarea.style.minWidth = '100px';
		textarea.style.width = Math.min(maxWidth + 4, window.innerWidth) + 'px';
	}

	function newRenderSongLyrics(...args) {
		const result = oldRender.apply(this, args);

		// wait a frame for React to finish rendering
		requestAnimationFrame(() => {
			resizeTextarea();
		});

		return result;
	}

	addon.onToggled = function(enabled) {
		if (!addon.rappad || !addon.rappad.editor || !addon.rappad.editor.react) return;

		if (enabled) {
			if (!oldRender) oldRender = addon.rappad.editor.react.renderSongLyrics;
			addon.rappad.editor.react.renderSongLyrics = newRenderSongLyrics;
			// trigger resize for current textarea
			requestAnimationFrame(resizeTextarea);
		} else {
			if (oldRender) {
				addon.rappad.editor.react.renderSongLyrics = oldRender;
			}
		}
	};
})(addon);
