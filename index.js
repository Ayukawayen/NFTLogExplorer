let provider;

window.ethereum.request({
	method: 'eth_requestAccounts',
}).then((response)=>{
	provider = new ethers.providers.Web3Provider(window.ethereum);

	document.querySelector('input[name="addr"]').value = response[0];
	document.querySelector('#load').addEventListener('click', onLoadClick);
});

async function onLoadClick() {
	let addr64 = '0x' + '0'.repeat(24) + document.querySelector('input[name="addr"]').value.substr(2).toLowerCase();

	let logs = [];
	logs = logs.concat(await provider.getLogs({topics:[
		'0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
		null,
		addr64,
	], fromBlock:0}));
	logs = logs.concat(await provider.getLogs({topics:[
		'0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
		addr64,
		null,
	], fromBlock:0}));

	logs.sort(sortLogDesc);

	document.querySelector('#tokens').removeChild(document.querySelector('#tokens >tbody'));
	
	let listNode = createElement('tbody', {}, []);
	document.querySelector('#tokens').appendChild(listNode);
	
	for(let i=0; i<logs.length; ++i) {
		let log = logs[i];
		if(log.topics.length < 4) continue;

		let node = createElement('tr', {}, [
			createElement('td', {}, [ log.transactionHash ]),
			createElement('td', {}, [ log.blockNumber ]),
			createElement('td', {}, [ '0x'+log.topics[1].substr(26) ]),
			createElement('td', {}, [ '0x'+log.topics[2].substr(26) ]),
			createElement('td', {}, [ BigInt(log.topics[3]).toString() ]),
			createElement('td', {}, [ log.address ]),
		]);
		
		listNode.appendChild(node);
	}
}

function sortLogDesc(a,b) {
	if(b.blockNumber == a.blockNumber) {
		return b.logIndex - a.logIndex;
	}
	return b.blockNumber - a.blockNumber;
}
