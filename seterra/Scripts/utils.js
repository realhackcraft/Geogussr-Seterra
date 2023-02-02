function getCookie(cookieName) {
  const cookie = document.cookie
    .split("; ")
    .map((el) => {
      const [name, value] = el.split("=");
      return { name, value };
    })
    .find(({ name }) => cookieName === name);
  if (cookie) {
    return cookie.value;
  }
}

function getProfile() {
  const rawProfile = getCookie("_geoguessr_profile");
  try {
    if (rawProfile) return JSON.parse(decodeURIComponent(rawProfile));
    return;
  } catch {
    return;
  }
}

const isSignedInWithPatreon = () => Boolean(getCookie("memberId"));
const isSignedInWithGeoGuessr = () => Boolean(getProfile());

window.isSignedInWithPatreon = () => isSignedInWithPatreon();
window.isSignedInWithGeoGuessr = () => isSignedInWithGeoGuessr();
window.isSignedIn = () => isSignedInWithPatreon() || isSignedInWithGeoGuessr();

window.getUserId = function () {
  if (isSignedInWithPatreon()) {
      const raw = getCookie("memberId");
      return raw ? decodeURIComponent(raw) : undefined;
  }

  const profile = getProfile();
  if (profile) {
    return profile.UserId;
  }
};

window.getNickName = function () {
  if (isSignedInWithPatreon()) {
      const raw = getCookie("memberName");
      return raw ? decodeURIComponent(raw) : undefined;
  }

  const profile = getProfile();
  if (profile) {
    return profile.Nick;
  }
};

window.isProUser = function () {
  if (isSignedInWithPatreon()) {
    return getCookie("hasAccount") === "true";
  }

  const profile = getProfile();
  if (profile) {
    return profile.IsProUser;
  }

  return false;
};

window.getPledgeLevel = function () {
  if (isSignedInWithPatreon()) {
    return parseInt(getCookie("pledges"));
  }

  const profile = getProfile();
  if (profile) {
    return profile.IsProUser ? 1000 : 0;
  }
  return 0;
};
