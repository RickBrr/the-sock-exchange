// Store the page number
num = 0;

async function getData() {
    // Move to the next page each time the button is hit.
    num++;
    // Attempt to use fetch to retrieve data over the network from an API endpoint.
    try {
        console.log(`Fetching page #${num}!`);
        let socks = await fetch(`https://ecs.the-sock-exchange.com/api/socks/${num}/10`).then(res => res.json());
        updateHTML(socks);
    } catch {
        // If at any point the process fails (such as when there aren't more socks),
        // inform the user, reset the counter, and wipe the table.
        alert("NO MORE SOCKS!!! Hit Next to start over.");
        num = 0;
        document.getElementById("data").innerHTML = "";
    };
};

function updateHTML(socks) {
	// for (let i = 0; i < socks.length; i++) {
	// 	let sock = socks[i];
	// 	let sockDiv = document.createElement('div');
	// 	sockDiv.innerHTML = `<div>Color: ${sock.color}</div><div>Size: ${sock.size}</div>`;
	// 	document.getElementById('data').appendChild(sockDiv);
	// }

	let table = document.createElement('table');
	table.className = "table";  // Add CSS class to the table
	let thead = document.createElement('thead');
	let tbody = document.createElement('tbody');

	// Create table headers
	let headers = Object.keys(socks[0].sockDetails);
	let tr = document.createElement('tr');

	for (let i = 0; i < headers.length; i++) {
		let th = document.createElement('th');
		th.textContent = headers[i];
		tr.appendChild(th);
	}

	// Same thing as above but using forEach
	// headers.forEach(header => {
	// 	let th = document.createElement('th');
	// 	th.textContent = header;
	// 	tr.appendChild(th);
	// });

	thead.appendChild(tr);
	table.appendChild(thead);

	// Create table body
	socks.forEach(sock => {
		let tr = document.createElement('tr');
		for (let key in sock.sockDetails) {
			let td = document.createElement('td');
			td.textContent = sock.sockDetails[key];
			tr.appendChild(td);
		}
		tbody.appendChild(tr);
	});
	table.appendChild(tbody);

    // Clear the previous table and then add the new table in its place.
    document.getElementById("data").innerHTML = "";
	document.getElementById('data').appendChild(table);
}

// Call the function to fetch and update data
//getData();