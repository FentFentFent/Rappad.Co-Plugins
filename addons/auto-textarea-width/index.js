(function(addon) {
	const textareaRef = () => addon.rappad.editor.react.refs.lyricsTextbox;

	let oldRender = null;
	let inputListener = null;

function resizeTextarea() {
	const textarea = textareaRef();
	if (!textarea) return;

	const lines = (textarea.value || textarea.placeholder || '').split('\n');
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

	const padding = 20; // optional padding for comfort
	const safeMaxWidth = window.innerWidth - padding;

	textarea.style.whiteSpace = 'pre';
	textarea.style.overflowX = 'auto';
	textarea.style.width = Math.min(maxWidth + 4, safeMaxWidth) + 'px';
};


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
			if (oldRender) addon.rappad.editor.react.renderSongLyrics = oldRender;
			if (textarea && inputListener) {
				textarea.removeEventListener('input', inputListener);
				inputListener = null;
			}
		}
	};
})(addon);
