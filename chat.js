let currentChat = null;

async function loadChat(chatId) {
  currentChat = chatId;

  const { data } = await supabase
    .from("messages")
    .select("*")
    .eq("chat_id", chatId)
    .order("created_at");

  data.forEach(addMessageToUI);

  supabase
    .channel("chat-" + chatId)
    .on(
      "postgres_changes",
      { event: "INSERT", table: "messages", filter: `chat_id=eq.${chatId}` },
      (payload) => addMessageToUI(payload.new)
    )
    .subscribe();
}

function addMessageToUI(msg) {
  const div = document.createElement("div");
  div.textContent = msg.content;
  document.getElementById("messages").appendChild(div);
}

async function sendMessage() {
  const text = document.getElementById("msgInput").value;

  await supabase.from("messages").insert({
    chat_id: currentChat,
    sender_id: (await supabase.auth.getUser()).data.user.id,
    content: text
  });

  document.getElementById("msgInput").value = "";
}
