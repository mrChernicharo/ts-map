getAPICount().then(apidata => {
	console.log(apidata);

	const visitSpan = document.createElement('span');
	visitSpan.classList.add('visit-span');
	visitSpan.innerText = `this page has been visited ${apidata.value} times`;

	const visitContainer = document.querySelector('.visit-count');
	visitContainer.append(visitSpan);

	visitContainer.append();
});

async function getAPICount() {
	const countApiUrl = 'https://api.countapi.xyz/hit/';
	const namespace = 'chernicharo-gordinho-defense-three/';
	const secretKey = import.meta.env.VITE_API_SECRET_KEY;

	const endpoint = countApiUrl + namespace + secretKey;

	const req = await fetch(endpoint);
	const data = await req.json();

	return data;
}
