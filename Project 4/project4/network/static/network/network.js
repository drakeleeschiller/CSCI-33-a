document.addEventListener('DOMContentLoaded', function () {

    // // Use buttons to toggle between views
    // document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
    // document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
    // document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
    // TO-DO: Change this so that compose post runs
    document.querySelector('#all_posts').classList.add("list-group");
    document.querySelector('#all_posts').addEventListener('click', () => load_posts());
    // By default, load the posts
    document.querySelector('#all_posts').style.display = 'block';
    load_posts();
});

function compose_post() {
    const post_body = document.querySelector('#post_body');
    document.querySelector('#post_form').onsubmit = () => {
        // Post the post on submission of the form

        submit_post(post_body.value);
        // Prevent the actual submission of the form
    }
    return false;
}

// Takes in a string from the text area of submit post
function submit_post(post_body) {
    fetch('/posts_home', {
        method: 'POST',
        body: JSON.stringify({
            post_body: post_body,
        })
    }).then(response => console.log(response));
}

function load_posts() {
    console.log("load_posts is being run")
    document.querySelector('#post_form').style.display = 'block';

    fetch_posts().then(post_list => {
        display_posts(post_list);
    });
}

// Fetch the list of posts
// Returns an array of dictionaries
async function fetch_posts() {
    const response = await fetch('/posts', {
        method: "GET"
    }).then(response => response.json());
    return await response;
}

function display_posts(posts) {
    document.querySelector('#all_posts').innerHTML = null;
    return posts.forEach(post => {
        format_one_post(post)
    });
}

function format_one_post(post) {
    const element = document.createElement('div');

    const element_list = ["list-group-item", "list-group-item-action", "flex-column", "align-items-start"];
    element.classList.add(...element_list);

    // Create and format the row's content
    const row_content = document.createElement('div');
    row_content_style_list = ["d-flex", "w-100", "justify-content-between", "m"]
    row_content.classList.add(...row_content_style_list)

    const left_side = document.createElement('div');
    const right_side = document.createElement('div');

    // Create the content for a single row/post
    const author = document.createElement('h5');
    author.innerHTML = post['owner'];
    author.classList.add("mb-1");
    author.addEventListener('click', () => { profile(post['owner']) });

    const body = document.createElement('p');
    body.innerHTML = post['post_body']

    const likes = document.createElement('small');
    likes.innerHTML = `${post['likes']} likes`

    const timestamp = document.createElement('small');
    timestamp.innerHTML = post['timestamp']

    left_content = [author, body, likes];
    left_side.replaceChildren(...left_content);

    right_content = [timestamp];
    right_side.replaceChildren(...right_content);

    content = [left_side, right_side];

    row_content.replaceChildren(...content);

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
    document.querySelector('#post_actual_form').style.display = 'none';
    document.querySelector('#profile').style.display = 'block';
    console.log("PROFILE IS", document.querySelector('#profile'))

    const profile = document.querySelector('#profile');
    const profile_list = ["m-3"];
    profile.classList.add(...profile_list);
    let data = await fetch_profile_data(username)

    console.log("data in profile is", data)

    // header contains the user's name
    const header = document.createElement('h4');
    const header_list = ["d-flex", "justify-content-between"];
    header.classList.add(...header_list);
    header.innerHTML = data['name'];
    follow_button = await create_follow_button(username, data['user_context']);
    header.append(follow_button);

    // subheader contains followers and following info, and the follow button
    const subheader = document.createElement('small');
    subheader.innerHTML = `
    <div class="d-flex justify-content-between">
        <div>Followers: ${data['followers'].length}</div>
    </div>
    <div class="d-flex justify-content-between">
        <div>Following: ${data['following'].length}</div>
    </div>
    
    <hr>
    `;
    console.log("data in profile is: ", data);
    const content = [header, subheader];
    profile.replaceChildren(...content);
    // Display posts authored by the current profile's user
    display_posts(data['posts']);
    return false;
}

async function create_follow_button(username, user_context) {

    const follow_button = document.createElement('button');
    if (user_context == username) {
        follow_button.style.visibility = 'hidden';
        return follow_button;
    }
    // Styling for button
    follow_button.type = "button";
    button_list = ["btn", "btn-sm"];
    follow_button.classList.add(...button_list);
    follow_button.classList.add("btn-outline-info");

    let is_following = await check_if_following(username, user_context);

    if (is_following) {
        follow_button.innerHTML = "Unfollow";
    }
    else {
        follow_button.innerHTML = "Follow";
    }
    follow_button.addEventListener('click', () => {
        check_if_following(username, user_context).then(is_following => {
            change_follow_state(username, user_context, is_following);
            if (follow_button.innerHTML === "Follow") {
                follow_button.innerHTML = "Unfollow";
            }
            else {
                follow_button.innerHTML = "Follow";
            }
        })

    });

    return follow_button;
}

// Checks if the current logged-in user is following the profile being viewed
async function check_if_following(username, user_context) {
    response = await fetch(`/check_follow`, {
        method: 'POST',
        body: JSON.stringify({
            username: username,
            user_context: user_context,
        })
    }).then(response => response.json());
    return (await response === true);

}

function change_follow_state(username, user_context, is_following) {
    // change follow state to unfollowed
    if (is_following) {
        fetch(`/change_follow`, {
            method: 'DELETE',
            body: JSON.stringify({
                username: username,
                user_context: user_context,
            })
        });
    }
    // change follow state to followed
    else {
        fetch(`/change_follow`, {
            method: 'POST',
            body: JSON.stringify({
                username: username,
                user_context: user_context,
            })
        });
    }
}

// Given a user (via their username), only return posts by who they follow
async function following_posts(username){
    document.querySelector('#post_form').style.display = 'none';
    document.querySelector('#profile').style.display = 'none';

    let data = await fetch_profile_data(username);
    console.log("data in following_posts is ", data);
    let following_post_list = await fetch(`fetch_following_posts`, {
        method: 'GET'
    }).then(response => response.json());
    display_posts(following_post_list)
}

