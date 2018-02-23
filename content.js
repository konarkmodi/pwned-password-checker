if(typeof('chrome') === 'undefined') {
	// This is done so that the extension can run on firefox browser too.
  var chrome = browser;
}

function getPwdInputs() {
  var ary = [];
  var inputs = document.getElementsByTagName("input");
  for (var i=0; i<inputs.length; i++) {
    if (inputs[i].type.toLowerCase() === "password") {
      ary.push(inputs[i]);
    }
  }
  return ary;
}

function _sha1(str) {
  // We transform the string into an arraybuffer.
  var buffer = new TextEncoder("utf-8").encode(str);
  return crypto.subtle.digest("SHA-1", buffer).then(function (hash) {
    return hex(hash);
  });
}

function hex(buffer) {
  var hexCodes = [];
  var view = new DataView(buffer);
  for (var i = 0; i < view.byteLength; i += 4) {
    // Using getUint32 reduces the number of iterations needed (we process 4 bytes each time)
    var value = view.getUint32(i)
    // toString(16) will give the hex representation of the number without padding
    var stringValue = value.toString(16)
    // We use concatenation and slice for padding
    var padding = '00000000'
    var paddedValue = (padding + stringValue).slice(-padding.length)
    hexCodes.push(paddedValue);
  }

  // Join all the hex strings into one
  return hexCodes.join("");
}

function getPwnedPassword(hash) {
	return new Promise( (resolve, reject) => {
		fetch("https://api.pwnedpasswords.com/range/" + hash, {referrerPolicy: "no-referrer"})
		.then( (response) => {
			if (response.status !== 200) reject();
			response.text().then( body => {
				resolve(body);
			});
		})
		.catch( e => {
			reject(e);
		})
	});
}

function checkPassword (text) {
	return new Promise( (resolve, reject) => {

		_sha1(text).then(h => {
			let hashBackend = h.slice(0,5);
			getPwnedPassword(hashBackend).then( body => {
				body.split('\n').forEach( _ => {
					let completeHash = hashBackend + _.split(':')[0];
					if (completeHash.toLowerCase() === h) {
						resolve('pwned');
					}
				});
				reject('not pwned');
			}).catch( (e) => {
				reject('not pwned');
			})
		});
	});
}

function checkSafe() {
	let id = this.id;
	let password_fields = getPwdInputs();
	if (password_fields.length > 0) {
		password_fields.forEach( (e, idx) => {
		if (id == idx) {
			let pwd = e.value;
			checkPassword(pwd).then( e => {
				alert('Password is compromised, not safe to use.');
			})
			.catch( e => {
				alert('Did not find the password in previous breaches');
			});
		}

		});
	}

}

let password_fields = getPwdInputs();
if (password_fields.length > 0) {
	password_fields.forEach( (e, idx) => {
		let site = e,
		    parent = site.parentElement,
		    next = site.nextSibling,
		    linkButton = document.createElement("a"),
		    text = document.createTextNode(" Check password (Source: Have I been pwned) ");

		linkButton.id = idx;
		linkButton.appendChild(text);
		parent.appendChild(linkButton);

	    linkButton.addEventListener("click", checkSafe, false);
	});
}
