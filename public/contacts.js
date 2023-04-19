(function () {
	const data = {};
	const form = document.querySelector("form#update");
	const inputs = form.querySelectorAll("input[type=text]");

	inputs.forEach((input) => {
		input.addEventListener('change', (event) => {
			const { name, value } = event.target;
			data[name] = value;
		});
	});

	form.addEventListener('submit', async (event) => {
		event.preventDefault();
		const response = await fetch("/contacts", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(data),
		});
		window.location.reload();
	});
})();