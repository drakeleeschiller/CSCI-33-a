document.addEventListener('DOMContentLoaded', function () {

    // Use buttons to toggle between views
    document.querySelector('#all_posts').classList.add("list-group");
    document.querySelector('#all_posts').addEventListener('click', load_posts);
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
    document.querySelector('#all_posts').style.display = 'block';
    const user_context = document.querySelector('#owner_profile').innerHTML;

    return posts.forEach(post => {
        format_one_post(post, user_context)
    });
}

// user_context is the username of the person logged in right now
// An improvement would be passing in the actual user object or the user id
function format_one_post(post, user_context) {
    const element = document.createElement('div');

    const element_list = ["list-group-item", "list-group-item-action", "flex-column", "align-items-start", "d-flex"];
    element.classList.add(...element_list);

    // Create and format the row's content
    const row_content = document.createElement('div');
    row_content_style_list = ["d-flex", "w-100", "justify-content-between", "m", "row"]
    row_content.classList.add(...row_content_style_list)

    const left_side = document.createElement('div');
    left_side.className = "col-6";
    const right_side = document.createElement('div');
    right_side.className = "col-4";

    // Create the content for a single row/post
    const author = document.createElement('h5');
    author.innerHTML = post['owner'];
    author.classList.add("mb-1");
    author.addEventListener('click', () => { profile(post['owner']) });

    const body = document.createElement('p');
    body.innerHTML = post['post_body']

    const likes = document.createElement('small');
    likes.innerHTML = `${post['likes']} likes`

    const timestamp = document.createElement('div');
    timestamp.innerHTML = post['timestamp']

    const like_button = document.createElement('button');
    like_button.innerHTML = "Like"
    button_list = ["btn", "btn-sm", "ml-2"];
    like_button.classList.add(...button_list);
    like_button.classList.add("btn-outline-primary");
    like_button.addEventListener('click', async () => {
        await change_likes_count(post, user_context).then(async (response) => { 
            like_button.innerHTML = response;
            console.log("response is ", response);
            console.log("like_button.innerHTML is ", like_button.innerHTML)
        });
    });

    const balance = 10000;
    const balance_string = balance.toLocaleString('en-us', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
    const investment_stuff =
        `<div class="flex justify-content-center col-2 text-right">
        <div>${balance_string}</div>
        <div class="${Math.random() - 0.5 > 0 ? "text-success" : "text-danger"} "> +$10</span>
     </div>`;

    left_content = [author, body, likes];
    left_side.replaceChildren(...left_content);

    right_content = [timestamp, like_button];
    right_side.replaceChildren(...right_content);
    right_side.style.textAlign = "right";

    // right_side.classList.add('text-align-right');

    content = [left_side, right_side];

    row_content.replaceChildren(...content);

    right_side.insertAdjacentHTML("beforebegin", investment_stuff);


    // Add row with content to the 'all-posts' container
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
    document.querySelector('#investment_page').style.display = 'none';
    document.querySelector('#profile').style.display = 'block';

    const profile = document.querySelector('#profile');
    const profile_list = ["m-3"];
    profile.classList.add(...profile_list);
    let data = await fetch_profile_data(username);

    // header contains the user's name
    const header = document.createElement('h4');
    const header_list = ["d-flex", "justify-content-between"];
    header.classList.add(...header_list);
    header.innerHTML = data['name'];
    follow_button = await create_follow_button(username, data['user_context']);
    header.append(follow_button);

    const profile_balance = 10000;
    const profile_balance_string = profile_balance.toLocaleString('en-us', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });


    // subheader contains followers and following info, and the follow button
    const subheader = document.createElement('div');
    subheader.className = "d-flex row";
    subheader.innerHTML = `
    <div class="col-2">
    <div>
        <div>Followers: ${data['followers'].length}</div>
    </div>
    <div>
        <div>Following: ${data['following'].length}</div>
    </div>
    </div>

    <div class="col-3">
    <div>
        <div>Balance: ${profile_balance_string}</div>
    </div>
    <div>
        <span> Daily net: </span>
        <span class="${Math.random() - 0.5 > 0 ? "text-success" : "text-danger"}"> +$10</span>
    </div>
    <div>
        <span> Stock of the day: </span>
        <span class="${Math.random() - 0.5 > 0 ? "text-success" : "text-danger"} ">$NFLX<span>
    </div>
    </div>

    </div>
    
    <hr>
    `;
    const content = [header, subheader];
    profile.replaceChildren(...content);
    // Display posts authored by the current profile's user
    display_posts(data['posts']);
    return false;
}

function show_investment_page(username) {
    post_actual_form.style.display = 'none';
    document.querySelector('#investment_page').style.display = 'block';
    document.querySelector('#profile').style.display = 'none';
    document.querySelector('#all_posts').style.display = 'none';

    const balance = 10000;
    const balance_string = balance.toLocaleString('en-us', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
    const current_stock = "$NFLX"

    const desposit_form =
        `
    <form class="form-inline">
        <div class="form-group mx-sm-3 mb-2">
            <input type="number" class="form-control" id="deposit-form" placeholder="0">
        </div>
        <button type="submit" class="btn btn-primary mb-2">Deposit!</button>
    </form>
    `;

    const stock_form =
        `
    <form class="form-inline">
        <div class="form-group mx-sm-3 mb-2">
            <input type="text" class="form-control" id="stock-form" placeholder="0">
        </div>
        <button type="submit" class="btn btn-primary mb-2">Invest!</button>
    </form>
    `;

    investment_page.innerHTML =
        `
    <div id="p-header">${username}</div>
    <div id="p-content"> 
        <div id="p-balance">Balance: ${balance_string}</div>
        <div id="p-current_stock">Current stock: ${current_stock}</div>
        <div id="p-deposit">${desposit_form}</div>
        <div id="p-invest">${stock_form}</div>
        <div id="p-graph"></div>
    </div>
    `;
    // Styling for the portfolio's header
    document.querySelector("#p-header").className = "d-flex align-items-center mb-3 mb-lg-0 me-lg-auto text-dark text-decoration-none";


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
    })
    response = response.json();
    return (response === true);
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

// is_increased parameter is either true (+1) or false (-1)
async function change_likes_count(post, user_context) {
    await fetch('/change_likes', {
        method: 'POST',
        body: JSON.stringify({
            post: post,
            user_context: user_context,
        })
    }).then(async (response) => {
        data = await response.json();
    });
    console.log("data is ", data['button_new_state'])
    return Promise.resolve(data['button_new_state']);
}

// Given a user (via their username), only return posts by who they follow
async function following_posts(username) {
    document.querySelector('#post_form').style.display = 'none';
    document.querySelector('#profile').style.display = 'none';
    document.querySelector('#investment_page').style.display = 'none';


    let data = await fetch_profile_data(username);
    let following_post_list = await fetch(`fetch_following_posts`, {
        method: 'GET'
    }).then(response => response.json());
    display_posts(following_post_list)
}

