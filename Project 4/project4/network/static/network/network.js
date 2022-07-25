document.addEventListener('DOMContentLoaded', function () {

    // // Use buttons to toggle between views
    // document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
    // document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
    // document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
    // TO-DO: Change this so that compose post runs
    document.querySelector('#post_button').addEventListener('click', () => compose_post());
    document.querySelector('#all_posts').classList.add("list-group");
    document.querySelector('#owner_profile').addEventListener('click', () => profile(document.querySelector('#owner_profile').innerHTML));
    console.log("1");
    // By default, load the posts
    load_posts();
});

function compose_post() {
    console.log("compose_post");
    const post_body = document.querySelector('#post_body');
    // console.log("post body value is", post_body.value);
    document.querySelector('#post_form').onsubmit = () => {
        // Post the post on submission of the form

        submit_post(post_body.value);
        // Prevent the actual submission of the form
    }
    return false;
}

// Takes in a string from the text area of submit post
function submit_post(post_body) {
    console.log("submit_post")
    fetch('/posts_home', {
        method: 'POST',
        body: JSON.stringify({
            post_body: post_body,
        })
    }).then(response => response.json()).then(results => { console.log("response in submit post", response) });
}

function load_posts() {
    console.log("2");
    document.querySelector('#post_form').style.display = 'block';
    document.querySelector('#profile').style.display = 'block';

    console.log("fetch_posts is: ", fetch_posts())
    fetch_posts().then(post_list => {
        console.log("post list in load post is", post_list);
        display_posts(post_list);
    });
}

// Fetch the list of posts
// Returns an array of dictionaries
async function fetch_posts() {
    console.log("3");
    const response = await fetch('/posts', {
        method: "GET"
    }).then(response => response.json());
    console.log('response is:', response);
    return await response;
}

function display_posts(posts) {
    console.log("4");
    document.querySelector('#all_posts').innerHTML = null;
    return posts.forEach(post => {
        format_one_post(post)
    });
}

function format_one_post(post) {
    // post = post.serialize();
    console.log("5");
    const element = document.createElement('div');

    const element_list = ["list-group-item", "list-group-item-action", "flex-column", "align-items-start"];
    element.classList.add(...element_list);

    // Create and format the row's content
    const row_content = document.createElement('div');
    row_content_style_list = ["d-flex", "w-100", "justify-content-between"]
    row_content.classList.add(...row_content_style_list)

    const left_side = document.createElement('div');
    const right_side = document.createElement('div');

    // Create the content for a single row/post
    const author = document.createElement('h5');
    author.innerHTML = post['owner'];
    author.classList.add("mb-1");
    author.addEventListener('click', () => {console.log("THIS IS RUNNING")});
    author.addEventListener('click', () => {profile(post['owner'])});

    const body = document.createElement('p');
    body.innerHTML = post['post_body']

    const likes = document.createElement('small');
    likes.innerHTML = post['likes']

    const timestamp = document.createElement('small');
    timestamp.innerHTML = post['timestamp']

    left_content = [author, body, likes];
    left_side.replaceChildren(...left_content);

    right_content = [timestamp];
    right_side.replaceChildren(...right_content);

    content = [left_side, right_side];

    row_content.replaceChildren(...content);

    // row_content.innerHTML = `
    // <div>
    //   <h5 class="mb-1">${owner}</h5>
    //   <p>${post['post_body']}</p>
    //   <small>${post['likes']} likes</small>
    // </div>
    // <small>${post['timestamp']}</small>
    // `;

    // Add row with content to the 'emails-view' container
    element.append(row_content);
    document.querySelector('#all_posts').append(element);
}

function fetch_profile_data(username) {
    let response = fetch('profile/' + username, {
        method: "GET"
    })
    .then(response => response.json())
    return response;
}

async function profile(username) {
    document.querySelector('#post_form').style.display = 'none';
    document.querySelector('#profile').style.display = 'block';


    console.log("profile in network.js")
    const profile = document.querySelector('#profile');
    let data = await fetch_profile_data(username)
    console.log("data in profile is ", data);
    console.log("name is", data['name'])

    // header contains the user's name
    const header = document.createElement('h4');
    const header_list = ["d-flex", "justify-content-between"];
    header.classList.add(...header_list);
    header.innerHTML = data['name'];

    // subheader contains followers and following info
    const subheader = document.createElement('small');
    subheader.innerHTML = `
    <div class="d-flex justify-content-between">
        <div>Followers: ${data['followers']}</div>
    </div>
    <div class="d-flex justify-content-between">
        <div>Following: ${data['following']}</div>
    </div>
    <hr>
    `;
    // TO-DO: Show the posts from this user and refactor view_posts to take in a user id?
    const user_posts = document.createElement("div");
    // console.log("data['posts'] is: ", data['posts']);
    console.log("display_posts is", display_posts(data['posts']));
    user_posts.innerHTML = display_posts(data['posts']);
    console.log("user_posts is: ",user_posts);
    // const test = document.createElement("div");
    // test.innerHTML = "HELLLLOOO";
    // user_posts.append(test);
    const content = [header, subheader, user_posts];
    profile.replaceChildren(...content);
    return false;
}
