export function Empty({ message }: { message: string }) {
  return (
    <div className="text-center py-16 text-gray-500">
      <p>{message}</p>
    </div>
  );
}