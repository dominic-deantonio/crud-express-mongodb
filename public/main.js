const alertBox = document.getElementById('no-quote-to-delete-alert');

function clickMe() {
    fetch('/quotes', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            name: 'Darth Vader',
            quote: 'I find your lack of faith disturbing.'
        })
    }).then(res => {
        if (res.ok) return res.json()
    }).then(response => {
        window.location.reload(true)
    })
}

async function deleteVader() {
    alertBox.setAttribute('hidden', true);
    const response = await fetch('/quotes', {
        method: 'delete',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            name: 'Darth Vader'
        })
    });
    const json = await response.json();
    if (json === 'No quote to delete') {
        console.log(alertBox);
        alertBox.removeAttribute('hidden');
    } else {
        console.log('reloading...')
        window.location.reload(true)
    }
}