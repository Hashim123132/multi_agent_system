export default function Sidebar() {
  return (
    <div className="w-64 border-r p-4">
      <h2 className="font-bold text-lg mb-4">Chats</h2>

      <div className="space-y-2">
        <div className="p-2 bg-gray-200 rounded cursor-pointer">
          New Chat
        </div>
      </div>
    </div>
  );
}