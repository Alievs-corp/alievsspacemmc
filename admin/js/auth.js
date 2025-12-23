const AUTH_KEY = "alievs_space_admin_session";
const PASS_KEY = "alievs_space_admin_password"; // stored hash-less for demo; replace with real auth (Supabase) later

export function getPassword(){
  return localStorage.getItem(PASS_KEY) || "admin123";
}

export function setPassword(p){
  localStorage.setItem(PASS_KEY, p);
}

export function login(pass){
  if (pass === getPassword()){
    localStorage.setItem(AUTH_KEY, JSON.stringify({ ok:true, at: Date.now() }));
    return true;
  }
  return false;
}

export function logout(){
  localStorage.removeItem(AUTH_KEY);
}

export function requireAuth(){
  try{
    const s = JSON.parse(localStorage.getItem(AUTH_KEY) || "null");
    if (!s?.ok) throw new Error("no session");
  }catch(e){
    location.href = "./login.html";
  }
}