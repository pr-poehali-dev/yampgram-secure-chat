const URLS = {
  auth: 'https://functions.poehali.dev/373c8396-a210-43a5-877c-575566f00f0c',
  friends: 'https://functions.poehali.dev/06d1d150-aa94-45c5-8cd0-85708b015997',
  messages: 'https://functions.poehali.dev/d61e3c01-e097-4949-a364-fa8c6ea5e578',
};

function getToken() {
  return localStorage.getItem('yamp_token') || '';
}

async function req(url: string, options: RequestInit = {}) {
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'X-Token': getToken(),
      ...(options.headers || {}),
    },
  });
  const text = await res.text();
  const data = JSON.parse(text);
  if (!res.ok) throw new Error(data.error || 'Ошибка сервера');
  return data;
}

// AUTH
export async function apiRegister(username: string, name: string, password: string) {
  return req(URLS.auth, {
    method: 'POST',
    body: JSON.stringify({ action: 'register', username, name, password }),
  });
}

export async function apiLogin(username: string, password: string) {
  return req(URLS.auth, {
    method: 'POST',
    body: JSON.stringify({ action: 'login', username, password }),
  });
}

export async function apiGetMe() {
  return req(URLS.auth);
}

// FRIENDS
export async function apiFriends() {
  return req(`${URLS.friends}/?action=list`);
}

export async function apiFriendRequests() {
  return req(`${URLS.friends}/?action=requests`);
}

export async function apiSearchUsers(q: string) {
  return req(`${URLS.friends}/?action=search&q=${encodeURIComponent(q)}`);
}

export async function apiAddFriend(username: string) {
  return req(URLS.friends, {
    method: 'POST',
    body: JSON.stringify({ action: 'add', username }),
  });
}

export async function apiAcceptFriend(user_id: number) {
  return req(URLS.friends, {
    method: 'POST',
    body: JSON.stringify({ action: 'accept', user_id }),
  });
}

export async function apiDeclineFriend(user_id: number) {
  return req(URLS.friends, {
    method: 'POST',
    body: JSON.stringify({ action: 'decline', user_id }),
  });
}

// MESSAGES
export async function apiMessages(with_id: number) {
  return req(`${URLS.messages}/?action=history&with=${with_id}`);
}

export async function apiUnread() {
  return req(`${URLS.messages}/?action=unread`);
}

export async function apiSendMessage(to_id: number, text: string) {
  return req(URLS.messages, {
    method: 'POST',
    body: JSON.stringify({ action: 'send', to_id, text }),
  });
}
