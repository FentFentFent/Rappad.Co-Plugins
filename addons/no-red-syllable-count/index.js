

let SyllableCountTreeItem = React.createClass({
    displayName: 'SyllableCountTreeItem',

    render: function () {
      var className;
      className = classNames({
        zero: this.props.count === 0,
        red: this.props.red
      });
      return React.createElement(
        'li',
        { className: className },
        this.props.count
      );
    }
  });


const oldRender =  addon.rappad.editor.syllableCounter.render;
// Below is a cleaned up version of their code, also prevents tree items from being red.
function newRender() {
	const { lyrics, className } = this.props;

	// split into lines
	const lines = lyrics.split("\n");

	// build <SyllableCountTreeItem /> elements
	const items = lines.map((line, idx) => {
		const words = line.split(" ");

		// count syllables in the line
		const syllables = words.reduce((sum, word) => {
			return sum + this.countSyllablesInWord(word);
		}, 0);

		const isOver100Chars = line.length >= 100;

		return React.createElement(
			SyllableCountTreeItem,
			{
				key: idx,
				count: syllables,
				red: false
			}
		);
	});

	// wrap in <ul>
	return React.createElement(
		"ul",
		{
			className: classNames(className, "hint--top-left"),
			"data-hint": "Syllable Counts"
		},
		items
	);
}
});


addon.onToggled = (t) => {
if (t) {
addon.rappad.syllableCounter.render = newRender.bind(addon.rappad.syllableCounter);
} else {
addon.rappad.syllableCounter.render = oldRender.bind(addon.rappad.syllableCounter);
}
}
