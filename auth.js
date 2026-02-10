async function login() {
  const email = document.getElementById("email").value;

  const { error } = await supabase.auth.signInWithOtp({ email });

  document.getElementById("status").textContent =
    error ? error.message : "Check your email for the magic link";
}
