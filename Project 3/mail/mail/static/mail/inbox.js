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
  document.querySelector('#message-view').style.display = 'none';
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
    send_email(compose_recipients.value, compose_subject.value, compose_body.value);
    load_mailbox('sent');

    // Prevent the actual submission of the form
    return false;
  }
}

function send_email(recipients, subject, body) {
  fetch('/emails', {
    method: 'POST',
    body: JSON.stringify({
        recipients: recipients,
        subject: subject,
        body: body
    })
  });
}

function load_mailbox(mailbox) {
  
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#message-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'none';

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;

  // Iterate through the list of emails and put each one in a div
  fetch_email_list(mailbox).then(result => {
    display_email_list(result, mailbox);
  })
}

function view_message(email) {
  // Show the message and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#message-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';

  response = 
    fetch('emails/' + email['id'], {
      method: "GET"
    }).then(response => response.json())

  const message_view = document.querySelector('#message-view');
  
  const subject = document.createElement('h4');
  subject.innerHTML = email['subject'];

  // subheader contains sender, recipients, and timestamp
  const subheader = document.createElement('small')
  subheader.innerHTML = `
  <div class="d-flex justify-content-between">
    <div>From: ${email['sender']}</div>
    <div>${email['timestamp']}</div>
  </div>
  <div>To: ${email['recipients']}</div>
  <hr>
  `;

  const body = document.createElement('div');
  body.innerHTML = email['body']

  message_view.append(subject);
  message_view.append(subheader);
  message_view.append(body);

  return false;
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
function display_email_list(email_list, mailbox) {
  return email_list.forEach(email => {
    format_one_row(email, mailbox)
  });
}

function format_one_row(email, mailbox) {
  // Create the click-able parent box
  const element = document.createElement('div');

  // Add an event-listener if the row has been clicked
  element.addEventListener('click', () => {
    // Immediately after clicking, set the bg color to grey
    if (mailbox != 'sent'){element.style.backgroundColor = "rgb(205, 199, 199)";}
    // Set the 'read' attribute of this email to true
    fetch(`/emails/${email['id']}`, {
      method: 'PUT',
      body: JSON.stringify({
          read: true
      })
    });
    // View the message after all the other onclick handling
    view_message(email);
  });

  // Styling
  const element_list = ["list-group-item", "list-group-item-action", "flex-column", "align-items-start"];
  // When rendering, set the background color to grey if the email has been read
  if (email['read'] && mailbox != 'sent') {
    element.classList.add("read")
  }
  element.classList.add(...element_list);

  // Create and format the row's content
  const row_content = document.createElement('div');
  row_content_style_list = ["d-flex", "w-100", "justify-content-between"]
  row_content.classList.add(...row_content_style_list)
  

  let email_person = (mailbox == 'sent' ? `To: ${email['recipients']}` : `From: ${email['sender']}`);

  // Nice to have: Change the sender to be the name of the sender, not their email
  row_content.innerHTML = `
    <div>
      <h5 class="mb-1">${email['subject']}</h5>
      <h6>${email_person}</h6>
    </div>
    <small>${email['timestamp']}</small>
    `;
  
  // Add row with content to the 'emails-view' container
  element.append(row_content);
  document.querySelector('#emails-view').append(element);
}