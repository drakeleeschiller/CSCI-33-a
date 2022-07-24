document.addEventListener('DOMContentLoaded', function() {

    // // Use buttons to toggle between views
    // document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
    // document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
    // document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
    // document.querySelector('#compose').addEventListener('click', () => compose_email({}, false));
    // document.querySelector('#emails-view').classList.add("list-group");
  
    // // By default, load the inbox
    // load_mailbox('inbox');
});

function compose_post(content) {
    const post_body = document.querySelector('#post_body');
    document.querySelector('#post_form').onsubmit = () => {
        // Post the email on submission of the form
        submit_post(post_body.value);
        // Prevent the actual submission of the form
        return false;
    }
}

function submit_post(post_body){
    fetch('', {
        method: 'POST',
        body: JSON.stringify({
            post_body: post_body,
        })
      });
}
