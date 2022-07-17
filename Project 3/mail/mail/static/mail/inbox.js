document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);
  document.querySelector('#emails-view').classList.add("list-group");

  // By default, load the inbox
  load_mailbox('inbox');
});

function compose_email() {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';

  const compose_recipients = document.querySelector('#compose-recipients');
  const compose_subject = document.querySelector('#compose-subject');
  const compose_body = document.querySelector('#compose-body');

  // Clear out composition fields
  compose_recipients.value = '';
  compose_subject.value = '';
  compose_body.value = '';

  // Send the email out on submission of the form
  document.querySelector('#compose-form').onsubmit = () => {
    fetch('/emails', {
      method: 'POST',
      body: JSON.stringify({
          recipients: compose_recipients.value,
          subject: compose_subject.value,
          body: compose_body.value
      })
    })
    .then(response => response.json())
    .then(result => {
        // Print result
        console.log(result);
    });
    load_mailbox('sent');
    // Prevent the actual submission of the form
    return false;
  }
}

function load_mailbox(mailbox) {
  
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;

  // Iterate through the list of emails and put each one in a div
  fetch_email_list(mailbox).then(result => {
    display_email_list(result)
  })
}

// Fetch the list of emails from a specific mailbox
// Returns an array of dictionaries
async function fetch_email_list(mailbox) {
  const response = await fetch('/emails/' + mailbox, {
    method: "GET"
  });
  return await response.json();
}

// Create divs for and display each email in a list
function display_email_list(email_list) {
  return email_list.forEach(email => {
    // TO-DO: Might want to change this later to a custom element
    const element = document.createElement('a');
    const style_list = ["list-group-item", "list-group-item-action", "flex-column", "align-items-start"];
    element.classList.add(...style_list);
    // TO-DO: Change this to correct href once view for a single email is created
    element.href = '#'
    element.innerHTML = email['subject'];
    document.querySelector('#emails-view').append(element);
  });
}


